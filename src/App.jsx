import React, { useRef, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useLocalStorage } from "react-use";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser, removeUser] = useLocalStorage("blogAppUser");
  const blogFormRef = useRef();

  useEffect(() => {
    if (user) {
      blogService()
        .getAll()
        .then((blogs) => {
          setBlogs(blogs);
        });
    }
  }, [user]);

  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginService.login({ username, password });
      setUser(user);
      toast.success("Successfully logged in!");

      return "success";
    } catch (error) {
      const errorMessage = error.response.data.error;
      if (errorMessage === "invalid username") {
        toast.error("Username does not exist");
      } else if (errorMessage === "invalid password") {
        toast.error("Wrong password");
      }

      return "error";
    }
  };

  const handleBlogCreation = async (blog) => {
    try {
      const createdBlog = await blogService().create(blog);
      toast.success("Blog created successfully!");
      blogFormRef.current.toggleVisibility();
      setBlogs((blogs) => [...blogs, createdBlog]);

      return "success";
    } catch (e) {
      const errorMessage = e.response.data.error;
      if (errorMessage === "title is required") {
        toast.error("Title is required");
      } else {
        toast.error(`Something went wrong: ${errorMessage}`);
      }

      return "error";
    }
  };

  const handleLike = (blog) => {
    blogService()
      .like(blog)
      .then((newBlog) => {
        setBlogs((blogs) =>
          blogs.map((blog) => (blog.id === newBlog.id ? newBlog : blog))
        );
      });
  };

  const handleRemove = (blog) => {
    if (window.confirm(`Sure you want to remove ${blog.title}?`)) {
      blogService()
        .remove(blog.id)
        .then(() => {
          setBlogs((blogs) => blogs.filter((b) => b.id !== blog.id));
        });
    }
  };

  return (
    <div>
      <Toaster />
      {user ? (
        <>
          <div>
            Logged in as {user.username}{" "}
            <button onClick={() => removeUser()}>log out</button>
          </div>
          <div>
            <h2>Blogs</h2>
            {blogs
              .sort((a, b) => b.likes - a.likes)
              .map((blog) => (
                <Blog
                  key={blog.id}
                  blog={blog}
                  handleLike={handleLike}
                  handleRemove={handleRemove}
                  user={user}
                />
              ))}
          </div>
          <Togglable buttonLabel={"create a blog"} ref={blogFormRef}>
            <BlogForm handleBlogCreation={handleBlogCreation} />
          </Togglable>
        </>
      ) : (
        <LoginForm handleLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
