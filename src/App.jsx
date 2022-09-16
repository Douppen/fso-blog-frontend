import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useLocalStorage } from "react-use";
import blogService from "./services/blogs";
import loginService from "./services/login";

const Blog = ({ blog }) => {
  return (
    <div
      style={{
        border: "2px dotted gray",
        padding: "10px",
        borderRadius: "5px",
        width: "80vw",
        maxWidth: "500px",
        marginTop: "10px",
      }}
    >
      <p
        style={{
          fontWeight: "bold",
          fontSize: "1.1rem",
        }}
      >
        {blog.title}
        <span> by {blog.author}</span>
      </p>
      <p>{blog.url}</p>
      <p
        style={{
          color: "hsl(9, 80%, 61%)",
        }}
      >
        {blog.likes} likes
      </p>
    </div>
  );
};

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [blog, setBlog] = useState({
    title: "",
    author: "",
    url: "",
    likes: 0,
  });

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [user, setUser, removeUser] = useLocalStorage("blogAppUser");

  useEffect(() => {
    if (user) {
      blogService()
        .getAll()
        .then((blogs) => {
          setBlogs(blogs);
        });
    }
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      setUser(user);
      setUsername("");
      setPassword("");
      toast.success("Successfully logged in!");
    } catch (error) {
      const errorMessage = error.response.data.error;
      if (errorMessage === "invalid username") {
        toast.error("Username does not exist");
      } else if (errorMessage === "invalid password") {
        toast.error("Wrong password");
      }
    }
  };

  const handleBlogCreation = async (e) => {
    e.preventDefault();

    try {
      const createdBlog = await blogService().create(blog);
      toast.success("Blog created successfully!");
      setBlogs([...blogs, createdBlog]);
      setBlog({
        title: "",
        author: "",
        url: "",
        likes: 0,
      });
    } catch (e) {
      const errorMessage = e.response.data.error;
      if (errorMessage === "title or url are required") {
        toast.error("A Title or a URL is required");
      } else {
        toast.error(`Something went wrong: ${errorMessage}`);
      }
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
            <h2>blogs</h2>
            {blogs.map((blog) => (
              <Blog key={blog.id} blog={blog} />
            ))}
          </div>
          <div>
            <h2>create new</h2>
            <form onSubmit={(e) => handleBlogCreation(e)}>
              <div>
                title:
                <input
                  type="text"
                  value={blog.title}
                  name="title"
                  onChange={(e) => setBlog({ ...blog, title: e.target.value })}
                />
              </div>
              <div>
                author:
                <input
                  type="text"
                  value={blog.author}
                  name="author"
                  onChange={(e) => setBlog({ ...blog, author: e.target.value })}
                />
              </div>
              <div>
                url:
                <input
                  type="text"
                  value={blog.url}
                  name="url"
                  onChange={(e) => setBlog({ ...blog, url: e.target.value })}
                />
              </div>
              <div>
                likes:
                <input
                  type="number"
                  value={blog.likes}
                  name="likes"
                  onChange={(e) => setBlog({ ...blog, likes: e.target.value })}
                />
              </div>
              <button type="submit">create</button>
            </form>
          </div>
        </>
      ) : (
        <div>
          <form onSubmit={(e) => handleLogin(e)}>
            <div>
              username
              <input
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              password
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit">log in</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default App;
