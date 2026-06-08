/**
 * 可被 `timeSlice` 分片执行的生成器。
 */
export type TimeSliceGenerator<TReturn = void> = Generator<unknown, TReturn, unknown>

/**
 * 返回分片生成器的任务函数。
 */
export type TimeSliceGeneratorFn<TReturn = void> = () => TimeSliceGenerator<TReturn>

interface IdleDeadlineLike {
  readonly didTimeout: boolean
  timeRemaining(): number
}

type RequestIdleCallbackLike = (
  callback: (deadline: IdleDeadlineLike) => void,
  options?: {
    timeout?: number
  },
) => number

type RequestAnimationFrameLike = (callback: (time: number) => void) => number

type UnrefablePort = MessagePort & {
  unref?: () => void
}

const now = () => globalThis.performance?.now() ?? Date.now()

const normalizeFrameTime = (maxFrameTime: number) => {
  if (!Number.isFinite(maxFrameTime) || maxFrameTime <= 0) {
    throw new TypeError('maxFrameTime 必须是大于 0 的有限数字')
  }

  return maxFrameTime
}

const createDeadline = (maxFrameTime: number, startTime = now()): IdleDeadlineLike => ({
  didTimeout: false,
  timeRemaining: () => Math.max(0, maxFrameTime - (now() - startTime)),
})

const getRequestIdleCallback = () => {
  const requestIdleCallback = (
    globalThis as typeof globalThis & {
      requestIdleCallback?: RequestIdleCallbackLike
    }
  ).requestIdleCallback

  return typeof requestIdleCallback === 'function' ? requestIdleCallback.bind(globalThis) : null
}

const getRequestAnimationFrame = () => {
  const requestAnimationFrame = (
    globalThis as typeof globalThis & {
      requestAnimationFrame?: RequestAnimationFrameLike
    }
  ).requestAnimationFrame

  return typeof requestAnimationFrame === 'function' ? requestAnimationFrame.bind(globalThis) : null
}

const scheduleMacrotask = (() => {
  if (typeof MessageChannel === 'function') {
    const channel = new MessageChannel()

    // Singly-linked queue — enqueue is O(1), dequeue is O(1), no array shifting.
    type Node = { cb: () => void; next: Node | null }
    let head: Node | null = null
    let tail: Node | null = null

    ;(channel.port1 as UnrefablePort).unref?.()
    ;(channel.port2 as UnrefablePort).unref?.()

    channel.port1.onmessage = () => {
      /* v8 ignore next */
      if (head === null) return
      const cb = head.cb
      head = head.next
      if (head === null) tail = null
      cb()
    }

    return (callback: () => void) => {
      const node: Node = { cb: callback, next: null }
      if (tail === null) {
        head = tail = node
      } else {
        /* v8 ignore next 2 */
        tail.next = node
        tail = node
      }
      channel.port2.postMessage(undefined)
    }
  }

  /* v8 ignore next 3 */
  return (callback: () => void) => {
    setTimeout(callback, 0)
  }
})()

const scheduleSlice = (callback: (deadline: IdleDeadlineLike) => void, maxFrameTime: number) => {
  const requestIdleCallback = getRequestIdleCallback()

  if (requestIdleCallback) {
    requestIdleCallback((deadline) => callback(deadline), {
      timeout: Math.ceil(maxFrameTime),
    })
    return
  }

  const requestAnimationFrame = getRequestAnimationFrame()

  if (requestAnimationFrame) {
    requestAnimationFrame(() => {
      const startTime = now()
      scheduleMacrotask(() => callback(createDeadline(maxFrameTime, startTime)))
    })
    return
  }

  scheduleMacrotask(() => callback(createDeadline(maxFrameTime)))
}

/**
 * 将生成器任务切成多个时间片执行，避免长同步循环持续占用主线程。
 *
 * 浏览器环境优先使用 `requestIdleCallback`，不可用时使用 `requestAnimationFrame`
 * 结合 `MessageChannel` 让出控制权；非浏览器环境会回退到宏任务调度。
 *
 * @param generatorFn 返回生成器的函数，每次 `yield` 都是一个可被暂停的检查点。
 * @param maxFrameTime 每个时间片最多执行的毫秒数，默认接近一帧预算。
 * @returns 生成器完成时解析为生成器的返回值。
 */
export function timeSlice<TReturn = void>(
  generatorFn: TimeSliceGeneratorFn<TReturn>,
  maxFrameTime = 16,
): Promise<TReturn> {
  const frameTime = normalizeFrameTime(maxFrameTime)

  return new Promise((resolve, reject) => {
    let iterator: TimeSliceGenerator<TReturn>

    try {
      iterator = generatorFn()
    } catch (error) {
      reject(error)
      return
    }

    const run = (deadline: IdleDeadlineLike) => {
      try {
        while (deadline.timeRemaining() > 0 || deadline.didTimeout) {
          const result = iterator.next()
          if (result.done) {
            resolve(result.value)
            return
          }
        }
        scheduleSlice(run, frameTime)
      } catch (error) {
        reject(error)
      }
    }
    scheduleSlice(run, frameTime)
  })
}
