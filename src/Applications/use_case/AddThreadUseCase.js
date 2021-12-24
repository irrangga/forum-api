const RegisterThread = require('../../Domains/threads/entities/RegisterThread')

class AddThreadUseCase {
  constructor ({ threadRepository }) {
    this._threadRepository = threadRepository
  }

  async execute (useCasePayload) {
    const registerThread = new RegisterThread({ title: useCasePayload.title, body: useCasePayload.body })
    return this._threadRepository.addThread(registerThread, useCasePayload.owner)
  }
}

module.exports = AddThreadUseCase
