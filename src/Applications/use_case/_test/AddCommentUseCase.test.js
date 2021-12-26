const AddCommentUseCase = require('../AddCommentUseCase')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const RegisterComment = require('../../../Domains/comments/entities/RegisterComment')
const AddedComment = require('../../../Domains/comments/entities/AddedComment')

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      content: 'sebuah comment',
      owner: 'user-123'
    }
    const expectedAddedComment = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner
    })

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository()
    const mockThreadRepository = new ThreadRepository()

    /** mocking needed function */
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAddedComment))
    mockThreadRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve())

    /** creating use case instance */
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository
    })

    // Action
    const addedComment = await addCommentUseCase.execute(useCasePayload)

    // Assert
    expect(addedComment).toStrictEqual(expectedAddedComment)
    expect(mockCommentRepository.addComment).toBeCalledWith(new RegisterComment({
      content: useCasePayload.content
    }),
    useCasePayload.threadId,
    useCasePayload.owner
    )
  })
})
