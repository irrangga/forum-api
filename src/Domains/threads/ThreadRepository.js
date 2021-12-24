class ThreadRepository {
  async addThread (registerThread, owner) {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async getDetailThread (threadId) {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async getThreadByThreadId (threadId) {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async verifyAvailableThread (threadId) {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }
}

module.exports = ThreadRepository
