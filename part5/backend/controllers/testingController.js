const router = require('express').Router()
const Blog = require('../models/blogdb')
const User = require('../models/user')

router.post('/reset', async (request, response) => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  console.log('this function was called!');
  response.status(204).end()
})

module.exports = router