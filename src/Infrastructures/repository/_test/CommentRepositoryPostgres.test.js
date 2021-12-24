const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const RegisterComment = require('../../../Domains/comments/entities/RegisterComment')
const AddedComment = require('../../../Domains/comments/entities/AddedComment')
const pool = require('../../database/postgres/pool')
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('addComment function', () => {
    it('should persist register comment', async () => {
      // Arrange
      const registerComment = new RegisterComment({
        content: 'sebuah comment'
      })
      await UsersTableTestHelper.addUser({ id: 'user-123' })
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' })
      const fakeIdGenerator = () => '123' // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      await commentRepositoryPostgres.addComment(registerComment, 'thread-123', 'user-123')

      // Assert
      const comments = await CommentsTableTestHelper.findCommentById('comment-123')
      expect(comments).toHaveLength(1)
    })

    it('should return added comment correctly', async () => {
      // Arrange
      const registerComment = new RegisterComment({
        content: 'sebuah comment'
      })
      await UsersTableTestHelper.addUser({ id: 'user-123' })
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' })
      const fakeIdGenerator = () => '123' // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(registerComment, 'thread-123', 'user-123')

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'sebuah comment',
        owner: 'user-123'
      }))
    })
  })

  describe('verifyCommentAccess function', () => {
    it('should not throw AuthorizationError or NotFoundError when userId match owner column', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' })
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        owner: 'user-123'
      })
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123'
      })
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentAccess('comment-123', 'user-123'))
        .resolves.not.toThrow(NotFoundError)
      await expect(commentRepositoryPostgres.verifyCommentAccess('comment-123', 'user-123'))
        .resolves.not.toThrow(AuthorizationError)
    })
  })
})
