import { render, screen } from "@testing-library/react";
import Blog from "./Blog";

test("renders the blog's title and author, but does not render its URL or number of likes by default", () => {
  const blog = {
    id: "1",
    title: "Test Blog",
    author: "John Doe",
    url: "https://testblog.com",
    likes: 10,
    user: {
      username: "testuser",
    },
  };

  const {container} = render(<Blog blog={blog} setBlogs={() => {}} />);

  const titleElement = screen.getByText("Test Blog");
  const authorElement = screen.getByText("John Doe");
  expect(titleElement).toBeDefined();
  expect(authorElement).toBeDefined();

  const urlElement = screen.queryByText("https://testblog.com");
  const likesElement = screen.queryByText("likes 10");
  expect(urlElement).toBeNull();
  expect(likesElement).toBeNull();

  const span = container.querySelector('.title')
  expect(span).toHaveTextContent('Test Blog')
});