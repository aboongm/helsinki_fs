const _ = require("lodash");
const User = require("../models/user");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => total + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null;

  let favorite = blogs[0];
  for (let i = 1; i < blogs.length; i++) {
    if (blogs[i].likes > favorite.likes) {
      favorite = blogs[i];
    }
  }
  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  };
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;

  const authorCounts = _.countBy(blogs, "author");
  const maxAuthor = _.maxBy(
    Object.keys(authorCounts),
    (author) => authorCounts[author]
  );

  return {
    author: maxAuthor,
    blogs: authorCounts[maxAuthor],
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null;

  const likesByAuthor = _.groupBy(blogs, "author");
  const authorsWithTotalLikes = _.mapValues(likesByAuthor, (blogs) =>
    _.sumBy(blogs, "likes")
  );

  const maxAuthor = _.maxBy(
    Object.keys(authorsWithTotalLikes),
    (author) => authorsWithTotalLikes[author]
  );

  return {
    author: maxAuthor,
    likes: authorsWithTotalLikes[maxAuthor],
  };
};

const initialBlogs = (user) => {
  return [
    {
      title: "First Blog",
      author: "John Doe",
      url: "https://example.com/first-blog",
      user: user,
      likes: 10,
    },
    {
      title: "Second Blog",
      author: "Jane Smith",
      url: "https://example.com/second-blog",
      user: user,
      likes: 15,
    },
  ];
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  initialBlogs,
  usersInDb,
};
