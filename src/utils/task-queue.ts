class TaskQueue {
  private tasks: Array<() => Promise<unknown>> = [];
  private isRunning: boolean = false;

  // Добавление задачи в очередь
  enqueue<T>(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const wrappedTask = async () => {
        try {
          const result = await task();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };
      this.tasks.push(wrappedTask);
      this.runTasks();
    });
  }

  // Выполнение задач из очереди
  private async runTasks(): Promise<void> {
    if (this.isRunning) {
      return;
    }
    this.isRunning = true;

    while (this.tasks.length > 0) {
      const task = this.tasks.shift();
      if (task) {
        await task();
      }
    }

    this.isRunning = false;
  }
}

const taskQueue = new TaskQueue();
export {taskQueue};
