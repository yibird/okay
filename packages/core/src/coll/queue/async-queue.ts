export class AsyncQueue<T> {
  private queue: (() => Promise<void>)[] = []
  private isProcessing = false

  /**
   * 入队
   * @param task 异步任务
   * @returns Promise<void>
   */
  private enqueue(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const wrappedTask = async () => {
        try {
          const result = await task()
          resolve(result)
        } catch (error) {
          reject(error)
        }
      }

      this.queue.push(wrappedTask)
      this.process()
    })
  }

  /**
   * 执行异步队列
   */
  private async process() {
    if (this.isProcessing) return
    this.isProcessing = true

    while (this.queue.length > 0) {
      const task = this.queue.shift()!
      await task()
    }
    this.isProcessing = false
  }
}
