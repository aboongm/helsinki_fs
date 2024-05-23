import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';
import { beforeEach } from 'vitest';
import BlogForm from './BlogForm';

describe('Blog Tests', () => {
  let blog;

  beforeEach(() => {
    blog = {
      id: '1',
      title: 'Test Blog',
      author: 'John Doe',
      url: 'https://testblog.com',
      likes: 10,
      user: {
        username: 'testuser',
      },
    };
  });

  test("renders the blog's title and author, but not the URL or number of likes by default", () => {
    const { container } = render(
      <Blog blog={blog} setBlogs={() => {}} handleLike={() => {}} />
    );

    const titleElement = screen.getByText('Test Blog');
    const authorElement = screen.getByText('John Doe');
    expect(titleElement).toBeDefined();
    expect(authorElement).toBeDefined();

    const urlElement = screen.queryByText('https://testblog.com');
    const likesElement = screen.queryByText('likes 10');
    expect(urlElement).toBeNull();
    expect(likesElement).toBeNull();

    const span = container.querySelector('.title');
    expect(span).toHaveTextContent('Test Blog');
  });

  test("clicking the button renders blog's URL and number of likes", async () => {
    render(<Blog blog={blog} setBlogs={() => {}} handleLike={() => {}} />);

    const user = userEvent.setup();
    const button = screen.getByText('view');
    await user.click(button);

    const urlElement = screen.getByText('https://testblog.com');
    expect(urlElement).toBeInTheDocument();

    const likesTextElement = screen.getByText('likes');
    expect(likesTextElement).toBeInTheDocument();

    const likesElement = screen.getByText('10');
    expect(likesElement).toBeInTheDocument();
  });

  test('like button event handler is called twice when the like button is clicked twice', async () => {
    const handleLikeMock = vi.fn(() => blog.likes + 1);

    const { container } = render(
      <Blog blog={blog} setBlogs={() => {}} handleLike={handleLikeMock} />
    );

    const user = userEvent.setup();
    const button = screen.getByText('view');
    await user.click(button);

    const likeButton = container.querySelector('.likeButton');
    likeButton.onClick = handleLikeMock;
    await user.click(likeButton);
    await user.click(likeButton);
    expect(handleLikeMock.mock.calls).toHaveLength(2);
  });

  test('<BlogForm /> calls handleBlog with the right details when a new blog is created', async () => {
    const handleBlogMock = vi.fn();
    const user = userEvent.setup();

    render(<BlogForm handleBlog={handleBlogMock} />);

    const inputs = screen.getAllByRole('textbox');
    const sendButton = screen.getByText('create');

    await user.type(inputs[0], 'Test Blog Title');
    await user.type(inputs[1], 'Test Author');
    await user.type(inputs[2], 'https://testblog.com');
    await user.click(sendButton);

    console.log('inputs: ', inputs[0]);
    expect(handleBlogMock.mock.calls).toHaveLength(1);
    expect(handleBlogMock).toHaveBeenCalledWith({
      title: 'Test Blog Title',
      author: 'Test Author',
      url: 'https://testblog.com',
    });
  });
});
