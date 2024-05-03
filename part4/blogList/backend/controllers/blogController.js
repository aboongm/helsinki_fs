const jwt = require("jsonwebtoken");
const blogsRouter = require("express").Router();
const Blog = require("../models/blogdb");
const User = require("../models/user");
const middleware = require('../utils/middleware');

blogsRouter.get("/", async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1});
    response.json(blogs);
  } catch (error) {
    next(error);
  }
});

blogsRouter.post("/", middleware.tokenExtractor, async (request, response, next) => {
  try {
    if (!request.token) {
      return response.status(401).json({ error: 'token missing' });
    }

    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' });
    }

    const user = await User.findById(decodedToken.id);
    if (!user) {
      return response.status(401).json({ error: 'user not found' });
    }

    const blog = new Blog({
      title: request.body.title,
      author: request.body.author,
      url: request.body.url,
      likes: request.body.likes,
      user: user.id
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    response.status(201).json(savedBlog);
  } catch (error) {
    next(error);
  }
});


blogsRouter.delete("/:id", async (request, response, next) => {
  try {
    const id = request.params.id;
    await Blog.findByIdAndDelete(id);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

blogsRouter.put("/:id", async (request, response, next) => {
  const { id } = request.params;
  const { likes } = request.body;

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { likes },
      { new: true }
    );

    if (!updatedBlog) {
      return response.status(404).end();
    }

    response.json(updatedBlog);
  } catch (error) {
    next(error);
  }
});

module.exports = blogsRouter;
