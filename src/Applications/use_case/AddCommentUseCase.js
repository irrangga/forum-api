const RegisterComment = require('../../Domains/comments/entities/RegisterComment')

class AddCommentUseCase {
  constructor ({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository
    this._threadRepository = threadRepository
  }

  async execute (useCasePayload) {
    const registerComment = new RegisterComment({ content: useCasePayload.content })
    await this._threadRepository.verifyAvailableThread(useCasePayload.threadId)
    return this._commentRepository.addComment(registerComment, useCasePayload.threadId, useCasePayload.owner)
  }
}

module.exports = AddCommentUseCase
