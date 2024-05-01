const { test, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('blogs are returned as json', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.status, 200)
    assert.ok(response.headers['content-type'].match(/^application\/json/))
})

test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, 2)
})

test('the first blog is about ', async () => {
    const response = await api.get('/api/blogs')
    const contents = response.body.map(e => e.title)
  assert.strictEqual(contents.includes('Once Upon a Time'), true)
})

after(async () => {
    await mongoose.connection.close()
})
