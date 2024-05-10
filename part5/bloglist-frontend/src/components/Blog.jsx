import { useState } from 'react'
import PropTypes from 'prop-types'
import blogService from '../services/blogs'

const Blog = ({ blog, setBlogs, handleLike }) => {
  const [view, setView] = useState(false)

  const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
  let user = JSON.parse(loggedUserJSON)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleRemove = async () => {
    console.log('handle remove!')
    try {
      await blogService.remove(blog)
      const updatedBlogs = await blogService.getAll()
      setBlogs(updatedBlogs)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div style={blogStyle}>
      <span className='title'>{blog.title}</span>
      <span style={{margin: "4px"}}>{blog.author}</span>
      <button onClick={() => setView(!view)}>{view ? 'hide' : 'view'}</button>
      {view && (
        <div>
          <div>{blog.url}</div>
          <div>
            <span>likes</span> 
            <span className='likes'>{blog.likes}</span>
            <button className='likeButton' onClick={()=>handleLike(blog)}>like</button>
          </div>
          <div>{blog.author}</div>
          {blog.user?.username === user?.username && (
            <button onClick={handleRemove}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.shape({
      username: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  setBlogs: PropTypes.func.isRequired,
}

export default Blog
