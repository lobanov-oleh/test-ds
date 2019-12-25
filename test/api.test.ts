import path from 'path'
import request from 'supertest'
import app from '@src/app'
import { expect } from '@test/bootstrap/chai'

const START = 1
const END = 5

let token: string
let filename: string

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

describe('GET /api/v1/videos/upload', () => {
  before(getToken)

  it('should upload', async () => {
    const res = await request(app)
      .post('/api/v1/videos/upload')
      .field('start', START)
      .field('end', END)
      .attach('video', path.join(__dirname, 'data/video.mp4'))
      .set({ Authorization: 'bearer ' + token })

    expect(res.status).to.equal(200)
    expect(res.body).not.to.be.empty()
    expect(res.body.filename).not.to.be.empty()

    filename = res.body.filename
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

describe('GET /api/v1/videos/{filename}/restart', () => {
  it('should restart video trimming', async () => {
    const res = await request(app)
      .get(`/api/v1/videos/${filename}/restart`)
      .set({ Authorization: 'bearer ' + token })

    expect(res.status).to.equal(200)
    expect(res.body).not.to.be.empty()
    expect(res.body.status).to.be.equal('restarted')
  })
})

describe('GET /api/v1/videos/{filename}/link', () => {
  const requestVideo = async (): Promise<request.Test> => request(app)
    .get(`/api/v1/videos/${filename}/link`)
    .set({ Authorization: 'bearer ' + token })

  before(async () => {
    let res = await requestVideo()

    while (res.status !== 200) {
      res = await requestVideo()
    }
  })

  it('should get video link and duration', async () => {
    const res = await requestVideo()

    expect(res.status).to.equal(200)
    expect(res.body).not.to.be.empty()
    expect(res.body.link).not.to.be.empty()
    expect(res.body.duration).to.be.equal(END - START)
  })
})
