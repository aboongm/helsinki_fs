import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')

    if (loggedUserJSON) {
      const usernew = JSON.parse(loggedUserJSON)
      setUser(usernew)
      loginService.setToken(usernew.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      loginService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setMessage(`${username} logged-in!`)
      setIsError(false)
      setTimeout(() => {
        setMessage('')
      }, 2000)
    } catch (error) {
      setMessage('wrong username or password')
      setIsError(true)
      setTimeout(() => {
        setMessage(null)
      }, 2000)
    }
  }

  const handleLogout = () => {
    window.localStorage.clear()
    window.location.reload()
  }

  const handleBlog = async ({ title, author, url }) => {
    blogFormRef.current.toggleVisibility()

    try {
      await blogService.create({
        title,
        author,
        url,
      })

      setMessage(`a new blog ${title} by ${author}`)
      setIsError(false)

      setTimeout(() => {
        setMessage('')
      }, 2000)

      const updatedBlogs = await blogService.getAll()
      setBlogs(updatedBlogs)
    } catch (error) {
      setMessage('Something went wrong!')
      setIsError(true)
      setTimeout(() => {
        setMessage(null)
      }, 2000)
    }
  }
  
  const handleLike = async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1
    }
    try {
      await blogService.update(updatedBlog)
      const updatedBlogs = await blogService.getAll()
      setBlogs(updatedBlogs)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} isError={isError} />

      {!user && (
        <>
          <h1>log in to application</h1>
          <form onSubmit={handleLogin}>
            <div>
              username
              <input
                type="text"
                value={username}
                name="Username"
                onChange={({ target }) => setUsername(target.value)}
              />
            </div>
            <div>
              password
              <input
                type="text"
                value={password}
                name="Password"
                onChange={({ target }) => setPassword(target.value)}
              />
            </div>
            <button type="submit">login</button>
          </form>
        </>
      )}

      {user && (
        <>
          <p>
            {user.username} logged in{' '}
            <button onClick={handleLogout}>logout</button>
          </p>

          <Togglable buttonLabel="create new blog" ref={blogFormRef}>
            <BlogForm
              handleBlog={handleBlog}
            />
          </Togglable>

          {blogs.sort((a,b) => a.likes - b.likes).map((blog) => (
            <Blog key={blog.id} blog={blog} setBlogs={setBlogs} handleLike={handleLike} />
          ))}
        </>
      )}
    </div>
  )
}

export default App
