import React, { useRef, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import PropTypes from "prop-types";
import { useLocalStorage } from "react-use";
import BlogForm from "./components/BlogForm";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import loginService from "./services/login";

const Blog = ({ blog, handleLike, handleRemove, user }) => {
  const [showDetails, setShowDetails] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "dotted",
    borderWidth: 2,
    margin: 10,
    padding: 10,
    borderRadius: 20,
  };

  return (
    <div style={blogStyle}>
      <p>
        <strong>{blog.title}</strong> <em>(created by {blog.user.username})</em>
      </p>
      {showDetails && (
        <>
          {blog.url && (
            <p
              style={{
                textDecoration: "underline",
              }}
            >
              {blog.url}
            </p>
          )}

          {blog.author && <p> Written by {blog.author}</p>}
          <p
            style={{
              color: "hsl(9, 80%, 61%)",
            }}
          >
            {blog.likes} likes{" "}
            <button onClick={() => handleLike(blog)}>like ❤️</button>
          </p>
          {user.username === blog.user.username && (
            <button onClick={() => handleRemove(blog)}>delete ⚠️</button>
          )}
        </>
      )}
      <div>
        <button onClick={() => setShowDetails((state) => !state)}>
          {showDetails ? "hide" : "show"}
        </button>
      </div>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  handleLike: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

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
