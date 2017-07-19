process.env.NODE_ENV = 'test'

const app = require('../app')
const request = require('supertest')
const expect = require('chai').expect

describe('API', () => {

    describe('GET /', () => {
        it('should return Hello, world!', async () => {
            const res = await request(app)
                .get('/')
                .expect(200)
            expect(res.res.text).to.equal('Hello, world!')
        })
    })

    describe('GET /json', () => {
        it('should return a json', async () => {
            const res = await request(app)
                .get('/json')
                .expect(200)
            expect(typeof JSON.parse(res.res.text)).to.equal('object')
        })
    })

    describe('POST /test', () => {
        it('should create a new sentence', async () => {
            const res = await request(app)
                .post('/test')
                .expect(200)
        })
    })

    describe('GET /test', () => {
        it('should return a sentence', async () => {
            const res = await request(app)
                .get('/test')
                .expect(200)
            expect(typeof JSON.parse(res.res.text).sentence).to.equal('string')
        })
    })
})
