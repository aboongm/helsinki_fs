const dummy = (blogs) => {
    return 1
  }

const totalLikes = (blogs) => {
    return blogs.reduce((total, blog) => total + blog.likes, 0)
}

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
  }
  
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
  }