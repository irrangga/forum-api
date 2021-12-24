class CommentRepository {
  async addComment (RegisterComment, threadId, owner) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async verifyCommentAccess (commentId, owner) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async getCommentByThreadId (threadId) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async deleteComment (commentId) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }
}

module.exports = CommentRepository
