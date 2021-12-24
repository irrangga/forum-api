const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase')

describe('GetDetailThreadUseCase', () => {
  it('should orchestrating the get commented thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123'
    }
    const thread = {
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding'

    }

    const comments = {
      comments: [
        {
          id: 'comment-_pby2_tmXV6bcvcdev8xk',
          username: 'johndoe',
          date: '2021-08-08T07:22:33.555Z',
          content: 'sebuah comment'
        }
      ]
    }

    const expectedCommentedThread = {
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-_pby2_tmXV6bcvcdev8xk',
          username: 'johndoe',
          date: '2021-08-08T07:22:33.555Z',
          content: 'sebuah comment'
        }
      ]
    }

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()

    /** mocking needed function */
    mockThreadRepository.getThreadByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(thread))

    mockCommentRepository.getCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(comments))

    /** creating use case instance */
    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository
    })

    // Action
    const commentedThread = await getDetailThreadUseCase.execute(useCasePayload)

    // Assert
    expect(commentedThread).toStrictEqual(expectedCommentedThread)
    expect(mockThreadRepository.getThreadByThreadId).toBeCalledWith(useCasePayload.threadId)
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(useCasePayload.threadId)
  })
})
