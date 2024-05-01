const { test, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('blogs are returned as json', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.status, 200)
    assert.strictEqual(response.body.length, 2)
})

after(async () => {
    await mongoose.connection.close()
})
