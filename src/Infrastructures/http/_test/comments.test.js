const pool = require('../../database/postgres/pool')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ServerTestHelper = require('../../../../tests/ServerTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const container = require('../../container')
const createServer = require('../createServer')

describe('/comments endpoint', () => {
  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
    await ServerTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
  })

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'sebuah comment'
      }

      const accessToken = await ServerTestHelper.getAccessToken({ id: 'user-123' })
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123', title: 'sebuah thread', body: 'sebuah body thread', owner: 'user-123'
      })
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedComment).toBeDefined()
      expect(responseJson.data.addedComment.owner).toEqual('user-123')
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
        url: '/threads/thread-123/comments',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada')
    })

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        content: 123,
        owner: ['abc']
      }
      const accessToken = await ServerTestHelper.getAccessToken({ id: 'user-123' })
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/{threadId}/comments',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena tipe data tidak sesuai')
    })
  })

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 and persisted comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'sebuah comment'
      }

      const accessToken = await ServerTestHelper.getAccessToken({ id: 'user-123', username: 'dicoding' })
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123', title: 'sebuah thread', body: 'sebuah body thread'
      })
      await CommentsTableTestHelper.addComment({
        id: 'comment-123', content: 'sebuah comment'
      })
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
    })
  })
})
