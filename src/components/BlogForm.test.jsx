import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";

test("successfully creates a blog after typing in the correct info", async () => {
  const createBlog = jest.fn();
  createBlog.mockResolvedValueOnce({});

  const user = userEvent.setup();

  render(<BlogForm handleBlogCreation={createBlog} />);

  const titleInput = screen.getByPlaceholderText("title");
  const authorInput = screen.getByPlaceholderText("author");
  const urlInput = screen.getByPlaceholderText("url");
  const likesInput = screen.getByPlaceholderText("likes");
  const createBtn = screen.getByText("create");

  await user.type(titleInput, "Test title");
  await user.type(authorInput, "Someone");
  await user.type(urlInput, "https://example.com");
  await user.type(likesInput, "10");
  await user.click(createBtn);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0].title).toBe("Test title");
  expect(createBlog.mock.calls[0][0].author).toBe("Someone");
  expect(createBlog.mock.calls[0][0].url).toBe("https://example.com");
  expect(createBlog.mock.calls[0][0].likes).toBe("10");
});
