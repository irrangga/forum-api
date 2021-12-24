const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const RegisterThread = require('../../../Domains/threads/entities/RegisterThread')
const AddedThread = require('../../../Domains/threads/entities/AddedThread')
const pool = require('../../database/postgres/pool')
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('addThread function', () => {
    it('should persist register thread', async () => {
      // Arrange
      const registerThread = new RegisterThread({
        title: 'sebuah thread',
        body: 'sebuah body thread'
      })
      await UsersTableTestHelper.addUser({ id: 'user-123' })
      const fakeIdGenerator = () => '123' // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      await threadRepositoryPostgres.addThread(registerThread, 'user-123')

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadById('thread-123')
      expect(threads).toHaveLength(1)
    })

    it('should return added thread correctly', async () => {
      // Arrange
      const registerThread = new RegisterThread({
        title: 'sebuah thread',
        body: 'sebuah body thread'
      })
      await UsersTableTestHelper.addUser({ id: 'user-123' })
      const fakeIdGenerator = () => '123' // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(registerThread, 'user-123')

      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'sebuah thread',
        owner: 'user-123'
      }))
    })
  })

  describe('getThreadByThreadId', () => {
    it('should return commented thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' })
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        owner: 'user-123'
      })
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool)

      // Action
      const commentedThread = await threadRepositoryPostgres.getThreadByThreadId('thread-123')

      // Assert
      await expect(threadRepositoryPostgres.getThreadByThreadId('thread-123'))
        .resolves.not.toThrow(NotFoundError)
      expect(commentedThread).toHaveProperty('id')
      expect(commentedThread).toHaveProperty('title')
      expect(commentedThread).toHaveProperty('body')
      expect(commentedThread).toHaveProperty('username')
      expect(commentedThread).toHaveProperty('date')
    })
  })
})
