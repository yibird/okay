/**
 * 并行执行任务,并限制并发数。泛型T表示Promise的返回值类型
 * @param tasks 任务数组
 * @param concurrency 并发数
 * @returns 任务结果数组
 */
export function parallelTasks<T>(
  tasks: Array<() => Promise<T>>,
  concurrency: number,
): Promise<T[]> {
  if (!Array.isArray(tasks)) {
    throw new TypeError('tasks must be an array of functions')
  }
  if (tasks.length === 0) return Promise.resolve([])

  const limit = Math.max(1, Math.floor(concurrency || 1))
  const results: T[] = Array.from({ length: tasks.length })
  let nextIndex = 0
  let running = 0

  return new Promise<T[]>((resolve, reject) => {
    function runNext() {
      if (nextIndex >= tasks.length && running === 0) {
        resolve(results)
        return
      }

      while (running < limit && nextIndex < tasks.length) {
        const current = nextIndex++
        let p: Promise<T>
        try {
          p = tasks[current]()
        } catch (error) {
          reject(error)
          return
        }
        running++
        p.then((res) => {
          results[current] = res
          running--
          runNext()
        }).catch((error) => {
          reject(error)
        })
      }
    }

    runNext()
  })
}
