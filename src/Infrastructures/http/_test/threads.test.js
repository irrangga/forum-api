const pool = require('../../database/postgres/pool')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ServerTestHelper = require('../../../../tests/ServerTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const container = require('../../container')
const createServer = require('../createServer')

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
    await ServerTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
  })

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const requestPayload = {
        title: 'sebuah thread',
        body: 'sebuah body thread'
      }

      const accessToken = await ServerTestHelper.getAccessToken({ id: 'user-123' })
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedThread).toBeDefined()
      expect(responseJson.data.addedThread.owner).toEqual('user-123')
    })

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        title: 'abc'
      }
      const accessToken = await ServerTestHelper.getAccessToken({ id: 'user-123' })
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada')
    })

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        title: 123,
        body: true,
        owner: ['abc']
      }
      const accessToken = await ServerTestHelper.getAccessToken({ id: 'user-123' })
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai')
    })
  })

  describe('when GET /threads/{threadId}', () => {
    it('should response 200 and persisted detail thread', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' })
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        owner: 'user-123'
      })
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        content: 'sebuah content',
        owner: 'user-123'
      })
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123'
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.thread).toBeDefined()
    })
  })
})
