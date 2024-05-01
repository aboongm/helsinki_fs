const { test, after, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

describe('Blog API', () => {
    test('blogs are returned as json', async () => {
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.status, 200)
        assert.ok(response.headers['content-type'].match(/^application\/json/))
    })

    test('there are two blogs', async () => {
        const response = await api.get('/api/blogs')
        // mongodb should already be having 2 blogs or existing number of blogs
        assert.strictEqual(response.body.length, 2)
    })

    test('the first blog is about ', async () => {
        const response = await api.get('/api/blogs')
        const contents = response.body.map(e => e.title)
        assert.strictEqual(contents.includes('Once Upon a Time'), true)
    })

    test('blogs have id property', async () => {
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.status, 200)
        response.body.forEach(blog => {
            assert.ok(!blog.hasOwnProperty('_id')) 
            assert.ok(blog.hasOwnProperty('id'))   
        })
    })

    test('creating a new blog post', async () => {
        const prevResponse = await api.get('/api/blogs')
        const prevLength = prevResponse.body.length

        const newBlog = {
            title: 'New Blog Post',
            author: 'John Doe',
            url: 'https://example.com',
            likes: 10
        }
    
        const response = await api.post('/api/blogs').send(newBlog)
        assert.strictEqual(response.status, 201)
    
        const fetchResponse = await api.get('/api/blogs')
        const newLength = fetchResponse.body.length
        assert.strictEqual(newLength, prevLength+1) 
    
        const createdBlog = fetchResponse.body.find(blog => blog.title === newBlog.title)
        assert.strictEqual(createdBlog.author, newBlog.author)
        assert.strictEqual(createdBlog.url, newBlog.url)
        assert.strictEqual(createdBlog.likes, newBlog.likes)
    })

    test('likes default to 0 if missing', async () => {
        const newBlogWithoutLikes = {
            title: 'New Blog Post without likes',
            author: 'Jane Doe',
            url: 'https://example.com'
        }
    
        const response = await api.post('/api/blogs').send(newBlogWithoutLikes)
        assert.strictEqual(response.status, 201)
        const fetchResponse = await api.get('/api/blogs')
        const createdBlog = fetchResponse.body.find(blog => blog.title === newBlogWithoutLikes.title)
        assert.strictEqual(createdBlog.likes, 0)
    })
})

after(async () => {
    await mongoose.connection.close()
})
