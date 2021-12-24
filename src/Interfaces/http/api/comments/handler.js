const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase')
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase')

class CommentsHandler {
  constructor (container) {
    this._container = container

    this.postCommentHandler = this.postCommentHandler.bind(this)
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this)
  }

  async postCommentHandler (request, h) {
    const useCasePayload = {
      threadId: request.params.threadId,
      content: request.payload.content,
      owner: request.auth.credentials.id
    }

    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name)
    const addedComment = await addCommentUseCase.execute(useCasePayload)

    const response = h.response({
      status: 'success',
      data: {
        addedComment
      }
    })
    response.code(201)
    return response
  }

  async deleteCommentHandler (request, h) {
    const useCasePayload = {
      threadId: request.params.threadId,
      commentId: request.params.commentId,
      owner: request.auth.credentials.id
    }

    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name)
    await deleteCommentUseCase.execute(useCasePayload)

    const response = h.response({
      status: 'success'
    })

    response.code(200)
    return response
  }
}

module.exports = CommentsHandler
