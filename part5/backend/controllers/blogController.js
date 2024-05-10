const blogsRouter = require("express").Router();
const Blog = require("../models/blogdb");

blogsRouter.get("/", async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1});
    response.json(blogs);
  } catch (error) {
    next(error);
  }
});

blogsRouter.post("/",  async (request, response, next) => {
  try {
    const user = request.user
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
    const user = request.user
    const id = request.params.id;
    
    const blog = await Blog.findById(id);
    if (!blog) {
      return response.status(404).json({ error: 'Blog not found' });
    }

    if (!user) {
      return response.status(401).json({ error: 'User not found' });
    }

    if (blog.user.toString() !== user.id.toString()) {
      return response.status(403).json({ error: 'You are not authorized to delete this blog' });
    }

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
