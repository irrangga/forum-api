class GetDetailThreadUseCase {
  constructor ({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
  }

  async execute (useCasePayload) {
    const { threadId } = useCasePayload

    const thread = await this._threadRepository.getThreadByThreadId(threadId)
    const comments = await this._commentRepository.getCommentByThreadId(threadId)

    const detailThread = Object.assign(thread, comments)

    return detailThread
  }
}

module.exports = GetDetailThreadUseCase
