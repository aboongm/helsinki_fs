import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async (blogData) => {
  console.log('blogData: ', blogData);
  const loggedUserJSON = await window.localStorage.getItem('loggedBlogappUser')
  const user = JSON.parse(loggedUserJSON)
  console.log('token create(): ', user); 
  const credentials = {
    headers: { Authorization: `Bearer ${user.token}`}
  }
  const request = axios.post(baseUrl, blogData, credentials)
  return request.then(response => response.data)
}

export default { getAll, create }