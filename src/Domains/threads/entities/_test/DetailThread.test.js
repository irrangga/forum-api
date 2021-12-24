const DetailThread = require('../DetailThread')

describe('a DetailThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'abc'
    }

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: ['thread-h_2FkLZhtgBKY2kh4CC02'],
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
        },
        {
          id: 'comment-yksuCoxM2s4MMrZJO-qVD',
          username: 'dicoding',
          date: '2021-08-08T07:26:21.338Z',
          content: '**komentar telah dihapus**'
        }
      ]
    }
    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create RegisterThread object correctly', () => {
    // Arrange
    const payload = {
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
        },
        {
          id: 'comment-yksuCoxM2s4MMrZJO-qVD',
          username: 'dicoding',
          date: '2021-08-08T07:26:21.338Z',
          content: '**komentar telah dihapus**'
        }
      ]
    }
    // Action
    const detailThread = new DetailThread(payload)

    // Assert
    expect(detailThread.id).toEqual(payload.id)
    expect(detailThread.title).toEqual(payload.title)
    expect(detailThread.body).toEqual(payload.body)
    expect(detailThread.date).toEqual(payload.date)
    expect(detailThread.username).toEqual(payload.username)
    expect(detailThread.comments).toEqual(payload.comments)
  })
})
