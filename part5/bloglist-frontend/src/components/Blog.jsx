import { useState } from "react";
import blogService from '../services/blogs'

const Blog = ({ blog, setBlogs }) => {
  const [view, setView] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1
    }
    try {
      await blogService.update(updatedBlog)
      const updatedBlogs = await blogService.getAll();
      setBlogs(updatedBlogs);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author} {" "}
      <button onClick={() => setView(!view)}>{view ? 'hide' : 'view'}</button>
      {view && (
        <div>
          <div>{blog.url}</div>
          <div>
              likes {blog.likes} 
              <button onClick={handleLike}>like</button>
          </div>
          <div>{blog.author}</div>
        </div>
        )}
    </div>
  );
};

export default Blog;
