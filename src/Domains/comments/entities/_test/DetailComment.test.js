const DetailComment = require('../DetailComment')

describe('a DetailComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'abc'
    }

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: '123',
      username: 123,
      date: ['abc'],
      content: 123
    }
    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create DetailComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      username: 'user-123',
      date: 'date',
      content: 'sebuah comment',
      isDelete: false
    }
    // Action
    const detailComment = new DetailComment(payload)

    // Assert
    expect(detailComment.id).toEqual(payload.id)
    expect(detailComment.username).toEqual(payload.username)
    expect(detailComment.date).toEqual(payload.date)
    expect(detailComment.content).toEqual(payload.content)
  })

  it('should create DetailComment object correctly when isDelete true', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      username: 'user-123',
      date: 'date',
      content: 'sebuah comment',
      isDelete: true
    }
    // Action
    const detailComment = new DetailComment(payload)

    // Assert
    expect(detailComment.id).toEqual(payload.id)
    expect(detailComment.username).toEqual(payload.username)
    expect(detailComment.date).toEqual(payload.date)
    expect(detailComment.content).toEqual('**komentar telah dihapus**')
  })
})
