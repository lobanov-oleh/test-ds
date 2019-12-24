import path from 'path'
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

describe('GET /api/v1/upload', () => {
  before(getToken)

  it('should upload', async () => {
    const res = await request(app)
      .post('/api/v1/upload')
      .field('start', 1)
      .field('end', 5)
      .attach('video', path.join(__dirname, 'data/video.mp4'))
      .set({ Authorization: 'bearer ' + token })

    expect(res.status).to.equal(200)
    expect(res.body).not.to.be.empty()
    expect(res.body.filename).not.to.be.empty()
  })
})

describe('GET /api/v1/videos', () => {
  it('should get videos with one element', async () => {
    const res = await request(app)
      .get('/api/v1/videos')
      .set({ Authorization: 'bearer ' + token })

    expect(res.status).to.equal(200)
    expect(res.body).not.to.be.empty()
    expect(res.body.videos).to.be.an('array')
    expect(res.body.videos).not.to.be.empty()
    expect(res.body.videos).to.have.lengthOf(1)
  })
})
