import request from 'supertest'
import app from '@src/app'
import { expect } from '@test/chai'

let uuid: string

describe('GET /token', () => {
  it('should return token and user uuid', async () => {
    const res = await request(app).post('/token')

    expect(res.status).to.equal(200)
    expect(res.body).not.to.be.empty()
    expect(res.body.uuid).not.to.be.empty()
    expect(res.body.token).not.to.be.empty()

    uuid = res.body.uuid
  })

  it('should return token for user uuid', async () => {
    const res = await request(app).post('/token')
      .send({ uuid })
      .set('Accept', 'application/json')

    expect(res.status).to.equal(200)
    expect(res.body).not.to.be.empty()
    expect(res.body.uuid).equal(uuid)
  })

  it('should return 404 for unknown uuid', async () => {
    const res = await request(app).post('/token')
      .send({ uuid: 'BAD_UUID' })
      .set('Accept', 'application/json')

    expect(res.status).to.equal(404)
    expect(res.body.error).not.to.be.empty()
  })
})
