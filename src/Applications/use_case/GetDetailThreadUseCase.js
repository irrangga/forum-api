const DetailComment = require('../../Domains/comments/entities/DetailComment')

class GetDetailThreadUseCase {
  constructor ({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
  }

  async execute (useCasePayload) {
    const { threadId } = useCasePayload

    const thread = await this._threadRepository.getThreadByThreadId(threadId)
    const comments = await this._commentRepository.getCommentByThreadId(threadId)

    const finalComments = comments.comments.map((comment) => {
      const detailComments = new DetailComment({
        ...comment,
        isDelete: comment.is_delete
      })

      return {
        ...detailComments
      }
    })

    return {
      ...thread,
      comments: finalComments
    }
  }
}

module.exports = GetDetailThreadUseCase
