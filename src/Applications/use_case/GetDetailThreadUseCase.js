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

    return {
      ...thread,
      comments: comments.comments.map((comment) => ({
        ...new DetailComment({
          ...comment,
          isDelete: comment.is_delete
        })
      }))
    }
  }
}

module.exports = GetDetailThreadUseCase
