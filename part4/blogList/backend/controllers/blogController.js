const blogsRouter = require("express").Router();
const Blog = require("../models/blogdb");

blogsRouter.get("/", async (request, response, next) => {
  try {
    const blogs = await Blog.find({});
    response.json(blogs);
  } catch (error) {
    next(error);
  }
});

blogsRouter.post("/", async (request, response, next) => {
  try {
    const blog = new Blog(request.body);
    const savedBlog = await blog.save();
    response.status(201).json(savedBlog);
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete("/:id", async (request, response, next) => {
  try {
    const id = request.params.id;
    await Blog.findByIdAndDelete(id)
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = blogsRouter;
