import request from 'supertest'
import app from '@src/app'
import v1 from '@api/v1'
import { expect } from '@test/chai'

describe('GET /api', () => {
  it('should return versions', async () => {
    const res = await request(app).get('/api')

    expect(res.status).to.equal(200)
    expect(res.body).not.to.be.empty()
    expect(res.body.versions).to.be.an('array')
  })
})

describe('GET /api/v1', () => {
  it('should return version name', async () => {
    const res = await request(app).get('/api/v1')

    expect(res.status).to.equal(200)
    expect(res.body).not.to.be.empty()
    expect(res.body.name).to.be.equals(v1.name)
  })
})
