const AddedComment = require('../../Domains/comments/entities/AddedComment')
const CommentRepository = require('../../Domains/comments/CommentRepository')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')

class CommentRepositoryPostgres extends CommentRepository {
  constructor (pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  // @ts-ignore
  async addComment (registerComment, threadId, owner) {
    const { content } = registerComment
    const id = `comment-${this._idGenerator()}`
    const date = new Date().toISOString()
    const isDelete = false

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, thread_id, content, owner',
      values: [id, threadId, content, date, owner, isDelete]
    }

    const result = await this._pool.query(query)

    return new AddedComment({ ...result.rows[0] })
  }

  async verifyCommentAccess (commentId, owner) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId]
    }

    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan')
    }

    const comments = result.rows[0]
    if (comments.owner !== owner) {
      throw new AuthorizationError('tidak punya izin untuk mengakses resource ini')
    }
  }

  async getCommentByThreadId (threadId) {
    const query = {
      text: `SELECT
      json_agg(json_build_object(
        'id', comments.id,
        'username', users.username,
        'date', comments.date,
        'content', comments.content
        )) AS comments
      FROM comments
      JOIN users ON comments.owner = users.id
      WHERE comments.thread_id = $1`,
      values: [threadId]
    }

    const result = await this._pool.query(query)

    return result.rows[0]
  }

  async deleteComment (commentId) {
    const query = {
      text: `UPDATE comments 
      SET is_delete = true, content = '**komentar telah dihapus**'
      WHERE id = $1`,
      values: [commentId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan')
    }
  }
}

module.exports = CommentRepositoryPostgres
