const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const api = supertest(app);

const Blog = require("../models/blogdb");
const helper = require("../utils/list_helper");
const User = require("../models/user");

let token;

describe("when there is initially some blogs saved", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash(process.env.SECRET, 10);
    const user = new User({ username: "root2", passwordHash });
    await user.save();
    token = jwt.sign({ id: user._id.toString() }, process.env.SECRET);

    // console.log("User ID:", user);

    await Blog.deleteMany({});
    const initialBlogsArray = helper.initialBlogs(user);
    await Blog.insertMany(initialBlogsArray);
  });

  test("blogs are returned as json", async () => {
    const response = await api.get("/api/blogs");
    assert.strictEqual(response.status, 200);
    assert.ok(response.headers["content-type"].match(/^application\/json/));
  });

  test("there are two blogs", async () => {
    const response = await api.get("/api/blogs");
    assert.strictEqual(response.body.length, 2);
  });

  test("the first blog is about ", async () => {
    const response = await api.get("/api/blogs");
    const contents = response.body.map((e) => e.title);
    assert.strictEqual(contents.includes("First Blog"), true);
  });

  test("blogs have id property", async () => {
    const response = await api.get("/api/blogs");
    assert.strictEqual(response.status, 200);
    response.body.forEach((blog) => {
      assert.ok(!blog.hasOwnProperty("_id"));
      assert.ok(blog.hasOwnProperty("id"));
    });
  });

  test("creating a new blog post", async () => {
    const prevResponse = await api.get("/api/blogs");
    const prevLength = prevResponse.body.length;

    const newBlog = {
      title: "Another Blog Post",
      author: "John Doe",
      url: "https://example.com",
      likes: 10,
    };

    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog);

    assert.strictEqual(response.status, 201);

    const fetchResponse = await api.get("/api/blogs");
    const newLength = fetchResponse.body.length;
    assert.strictEqual(newLength, prevLength + 1);

    const createdBlog = fetchResponse.body.find(
      (blog) => blog.title === newBlog.title
    );
    assert.strictEqual(createdBlog.author, newBlog.author);
    assert.strictEqual(createdBlog.url, newBlog.url);
    assert.strictEqual(createdBlog.likes, newBlog.likes);
  });

  test("likes default to 0 if missing", async () => {
    const newBlogWithoutLikes = {
      title: "New Blog Post without likes",
      author: "Jane Doe",
      url: "https://example.com",
    };

    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlogWithoutLikes);
    assert.strictEqual(response.status, 201);
    const fetchResponse = await api.get("/api/blogs");
    const createdBlog = fetchResponse.body.find(
      (blog) => blog.title === newBlogWithoutLikes.title
    );
    assert.strictEqual(createdBlog.likes, 0);
  });

  test("responds with status code 400 if title is missing", async () => {
    const newBlogWithoutTitle = {
      author: "John Doe",
      url: "https://example.com",
      likes: 10,
    };

    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlogWithoutTitle);
    assert.strictEqual(response.status, 400);
  });

  test("responds with status code 400 if url is missing", async () => {
    const newBlogWithoutUrl = {
      title: "New Blog Post Without Url",
      author: "Jane Doe",
      likes: 10,
    };

    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlogWithoutUrl);
    assert.strictEqual(response.status, 400);
  });

  describe("deletion of a blog", () => {
    test("succeeds with status code 204 if id is valid", async () => {
      const initialResponse = await api.get("/api/blogs");
      const initialBlogs = initialResponse.body;      
      const blogToDelete = initialBlogs[0];

      const response = await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set("Authorization", `Bearer ${token}`)
      assert.strictEqual(response.status, 204);

      const updatedResponse = await api.get("/api/blogs");
      const updatedBlogs = updatedResponse.body;

      const isBlogDeleted = updatedBlogs.some(
        (blog) => blog.id === blogToDelete.id
      );
      assert.strictEqual(isBlogDeleted, false);
    });
  });

  test("updating a blog post", async () => {
    const initialResponse = await api.get("/api/blogs");
    const initialBlogs = initialResponse.body;

    const blogToUpdate = initialBlogs[0];
    const updatedLikes = blogToUpdate.likes + 1;

    const updatedBlogData = { likes: updatedLikes };
    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlogData);

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.likes, updatedLikes);
  });
});

after(async () => {
  await mongoose.connection.close();
});
