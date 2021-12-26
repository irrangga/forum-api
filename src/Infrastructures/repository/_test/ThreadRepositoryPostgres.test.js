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
    it('should throw error when thread is not exists', async () => {
      // Arrange
      const fakeIdGenerator = () => '123' // stub
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

      await UsersTableTestHelper.addUser({ id: 'user-123' })
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' })

      // Action & Assert
      await expect(threadRepositoryPostgres.getThreadByThreadId('thread-321'))
        .rejects.toThrow(NotFoundError)
    })

    it('should return commented thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding'
      })
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body thread'
      })
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool)

      // Action & Assert
      const thread = await threadRepositoryPostgres.getThreadByThreadId('thread-123')
      expect(thread.id).toEqual('thread-123')
      expect(thread.title).toEqual('sebuah thread')
      expect(thread.body).toEqual('sebuah body thread')
      expect(thread.username).toEqual('dicoding')
    })
  })

  describe('verifyAvailableThread function', () => {
    it('should throw error when thread is not exists', async () => {
      // Arrange
      const fakeIdGenerator = () => '123' // stub
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

      await UsersTableTestHelper.addUser({ id: 'user-123' })
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' })

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyAvailableThread('thread-321'))
        .rejects.toThrow(NotFoundError)
    })
  })
})
