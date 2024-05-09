import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";
import { beforeEach } from "vitest";

describe("Blog Test", () => {
  // beforeEach(() => {

  // })

  test("renders the blog's title and author, but not the URL or number of likes by default", () => {
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

    const { container } = render(<Blog blog={blog} setBlogs={() => {}} />);

    const titleElement = screen.getByText("Test Blog");
    const authorElement = screen.getByText("John Doe");
    expect(titleElement).toBeDefined();
    expect(authorElement).toBeDefined();

    const urlElement = screen.queryByText("https://testblog.com");
    const likesElement = screen.queryByText("likes 10");
    expect(urlElement).toBeNull();
    expect(likesElement).toBeNull();

    const span = container.querySelector(".title");
    expect(span).toHaveTextContent("Test Blog");
  });

  test("clicking the button renders blog's URL and number of likes", async () => {
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

    const mockHandler = vi.fn();

    render(<Blog blog={blog} setBlogs={() => {}} />);

    const user = userEvent.setup();
    const button = screen.getByText('view');
    await user.click(button);

    const urlElement = screen.getByText("https://testblog.com");
    expect(urlElement).toBeInTheDocument();

    const likesTextElement = screen.getByText("likes");
    expect(likesTextElement).toBeInTheDocument();

    const likesElement = screen.getByText("10");
    expect(likesElement).toBeInTheDocument();
  });
});
