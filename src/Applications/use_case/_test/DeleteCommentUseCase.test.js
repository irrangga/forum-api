const CommentRepository = require('../../../Domains/comments/CommentRepository')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const DeleteCommentUseCase = require('../DeleteCommentUseCase')

describe('DeleteCommentUseCase', () => {
  it('should throw error when payload not contain needed property', async () => {
    // Arrange
    const useCasePayload = {}
    const deleteCommentUseCase = new DeleteCommentUseCase({})

    // Action & Assert
    await expect(deleteCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error if payload not meet data specification', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 123,
      threadId: 123,
      owner: 123
    }
    const deleteCommentUseCase = new DeleteCommentUseCase({})

    // Action & Assert
    await expect(deleteCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-123',
      threadId: 'thread-123',
      owner: 'owner'
    }
    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()

    mockThreadRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentRepository.verifyCommentAccess = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve())

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository
    })

    // Act
    await deleteCommentUseCase.execute(useCasePayload)

    // Assert
    expect(mockThreadRepository.verifyAvailableThread)
      .toHaveBeenCalledWith(useCasePayload.threadId)
    expect(mockCommentRepository.verifyCommentAccess)
      .toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.owner)
    expect(mockCommentRepository.deleteComment)
      .toHaveBeenCalledWith(useCasePayload.commentId)
  })
})
