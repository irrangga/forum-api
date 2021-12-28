class DetailComment {
  constructor (payload) {
    this._verifyPayload(payload)

    const { id, username, date, content, isDelete } = payload

    this.id = id
    this.username = username
    this.date = date
    if (isDelete) {
      this.content = '**komentar telah dihapus**'
    } else {
      this.content = content
    }
  }

  _verifyPayload ({ id, username, date, content }) {
    if (!id || !username || !date || !content) {
      throw new Error('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof date !== 'string' || typeof content !== 'string') {
      throw new Error('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = DetailComment
