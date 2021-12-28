class GetDetailThreadUseCase {
  constructor ({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
  }

  async execute (useCasePayload) {
    const { threadId } = useCasePayload

    const thread = await this._threadRepository.getThreadByThreadId(threadId)
    const comments = await this._commentRepository.getCommentByThreadId(threadId)

    const arr = comments.comments
    for (const key in arr) {
      if (arr[key].is_delete) {
        arr[key].content = '**komentar telah dihapus**'
      }
    }

    return Object.assign(thread, comments)
  }
}

module.exports = GetDetailThreadUseCase
