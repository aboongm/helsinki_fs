import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");

    if (loggedUserJSON) {
      const usernew = JSON.parse(loggedUserJSON);
      setUser(usernew);
      loginService.setToken(usernew.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      loginService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
      setMessage(`${username} logged-in!`);
      setIsError(false);
      setTimeout(() => {
        setMessage("");
      }, 2000);
    } catch (error) {
      setMessage("wrong username or password");
      setIsError(true);
      setTimeout(() => {
        setMessage(null);
      }, 2000);
    }
  };

  const handleLogout = () => {
    console.log("logout");
    window.localStorage.clear();
    window.location.reload();
  };

  const handleBlog = async (event) => {
    event.preventDefault();

    try {
      await blogService.create({
        title,
        author,
        url,
      });

      setMessage(`a new blog ${title} by ${author}`);
      setIsError(false);

      setTitle("")
      setAuthor("")
      setUrl("")

      setTimeout(() => {
        setMessage("");
      }, 2000);

      const updatedBlogs = await blogService.getAll();
      setBlogs(updatedBlogs);
    } catch (error) {
      setMessage("Something went wrong!");
      setIsError(true);
      setTimeout(() => {
        setMessage(null);
      }, 2000);
    }
  };

  return (
    <div>
      {!user && (
        <>
          <h1>log in to application</h1>
          <Notification message={message} isError={isError} />

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
          <h2>blogs</h2>
          <Notification message={message} isError={isError} />
          <p>
            {user.username} logged in{" "}
            <button onClick={handleLogout}>logout</button>
          </p>

          <h2>create new</h2>
          <form onSubmit={handleBlog}>
            <div>
              title
              <input
                type="text"
                value={title}
                name="Title"
                onChange={({ target }) => setTitle(target.value)}
              />
            </div>
            <div>
              author
              <input
                type="text"
                value={author}
                name="Author"
                onChange={({ target }) => setAuthor(target.value)}
              />
            </div>
            <div>
              url
              <input
                type="text"
                value={url}
                name="Url"
                onChange={({ target }) => setUrl(target.value)}
              />
            </div>
            <button type="submit">create</button>
          </form>

          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </>
      )}
    </div>
  );
};

export default App;
