import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

test("by default renders blog's title, but not the url and number of likes", () => {
  const userObj = {
    username: "someone",
    id: "632485f7e269341dd5fc9f23",
    name: "John Doe",
  };

  const blog = {
    title: "Test title",
    author: "Someone",
    url: "https://example.com",
    likes: 10,
    id: "63259f852c90e89408f0382b",
    user: userObj,
  };

  const { container } = render(<Blog blog={blog} user={userObj} />);
  const blogElement = container.querySelector(".blog");

  expect(blogElement).toHaveTextContent("Test title");
  expect(blogElement).not.toHaveTextContent("https://example.com");
  expect(blogElement).not.toHaveTextContent("10 likes");
  expect(blogElement).toContainElement(screen.getByText("show"));
});

test("renders blog's title, url and number of likes when show button has been clicked", async () => {
  const userObj = {
    username: "someone",
    id: "632485f7e269341dd5fc9f23",
    name: "John Doe",
  };

  const blog = {
    title: "Test title",
    author: "Someone",
    url: "https://example.com",
    likes: 10,
    id: "63259f852c90e89408f0382b",
    user: userObj,
  };

  const { container } = render(<Blog blog={blog} user={userObj} />);
  const blogElement = container.querySelector(".blog");

  const user = userEvent.setup();
  const button = screen.getByText("show");

  await user.click(button);

  expect(blogElement).toHaveTextContent("Test title");
  expect(blogElement).toHaveTextContent("https://example.com");
  expect(blogElement).toHaveTextContent("10 likes");
  expect(blogElement).toContainElement(screen.getByText("hide"));
});

test("if the like button is clicked twice, the event handler the component received is called twice", async () => {
  const userObj = {
    username: "someone",
    id: "632485f7e269341dd5fc9f23",
    name: "John Doe",
  };

  const blog = {
    title: "Test title",
    author: "Someone",
    url: "https://example.com",
    likes: 10,
    id: "63259f852c90e89408f0382b",
    user: userObj,
  };

  const mockLikeHandler = jest.fn();

  render(<Blog blog={blog} user={userObj} handleLike={mockLikeHandler} />);

  const user = userEvent.setup();
  const button = screen.getByText("show");

  await user.click(button);
  await user.click(screen.getByText("like ❤️"));
  await user.click(screen.getByText("like ❤️"));

  expect(mockLikeHandler.mock.calls).toHaveLength(2);
});
