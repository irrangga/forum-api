class DeleteCommentUseCase {
  constructor ({
    commentRepository,
    threadRepository
  }) {
    this._commentRepository = commentRepository
    this._threadRepository = threadRepository
  }

  async execute (useCasePayload) {
    this._validatePayload(useCasePayload)
    const { commentId, threadId, owner } = useCasePayload
    await this._threadRepository.verifyAvailableThread(threadId)
    await this._commentRepository.verifyCommentAccess(commentId, owner)
    await this._commentRepository.deleteComment(commentId)
  }

  _validatePayload (payload) {
    const { commentId, threadId, owner } = payload

    const data = [commentId, threadId, owner]
    data.forEach((item) => {
      if (!item) {
        throw new Error('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY')
      }

      if (typeof item !== 'string') {
        throw new Error('DELETE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION')
      }
    })
  }
}

module.exports = DeleteCommentUseCase
