const RegisterComment = require('../../Domains/comments/entities/RegisterComment')

class AddCommentUseCase {
  constructor ({ commentRepository }) {
    this._commentRepository = commentRepository
  }

  async execute (useCasePayload) {
    const registerComment = new RegisterComment({ content: useCasePayload.content })
    return this._commentRepository.addComment(registerComment, useCasePayload.threadId, useCasePayload.owner)
  }
}

module.exports = AddCommentUseCase
