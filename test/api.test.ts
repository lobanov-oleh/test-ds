import request from 'supertest'
import app from '@src/app'
import { expect } from '@test/bootstrap/chai'

let token: string
const getToken = async (): Promise<void> => {
  const res = await request(app).post('/token')
  token = res.body.token
}

describe('GET /api', () => {
  before(getToken)

  it('should return versions', async () => {
    const res = await request(app)
      .get('/api')
      .set({ Authorization: 'bearer ' + token })

    expect(res.status).to.equal(200)
    expect(res.body).not.to.be.empty()
    expect(res.body.versions).to.be.an('array')
  })
})

describe('GET /api/v1', () => {
  before(getToken)

  it('should return version name', async () => {
    const res = await request(app)
      .get('/api/v1')
      .set({ Authorization: 'bearer ' + token })

    expect(res.status).to.equal(200)
    expect(res.body).not.to.be.empty()
    expect(res.body.name).to.be.equals('v1')
  })
})
