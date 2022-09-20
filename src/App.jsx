import React, { useRef, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, Route, Routes, useMatch } from "react-router-dom";
import { useLocalStorage } from "react-use";
import BlogForm from "./components/BlogForm";
import BlogList from "./components/BlogList";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";
import { fetchBlogs, likeBlog, removeBlog } from "./reducers/blogReducer";
import { fetchUsers } from "./reducers/userReducer";
import loginService from "./services/login";
import Comments from "./components/Comments";

const UsersList = () => {
  const users = useSelector((state) => state.users);

  if (users.length === 0) {
    return (
      <div>
        <h2>Users</h2>
        <p>You must be authenticated to view users</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Name</th>
            <th>Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.username}</Link>
              </td>
              <td>{user.name}</td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const UserPage = () => {
  const match = useMatch("/users/:id");
  const users = useSelector((state) => state.users);
  const matchedUser = match
    ? users.find((user) => user.id === match.params.id)
    : null;

  if (!matchedUser) {
    return (
      <div>
        <h2>Users</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h2>
        {matchedUser.name} - {matchedUser.username}
      </h2>
      <h3>Blogs added:</h3>
      <ul>
        {matchedUser.blogs.map((blog) => (
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const BlogPage = ({ user }) => {
  const match = useMatch("/blogs/:id");
  const blogs = useSelector((state) => state.blogs);
  const matchedBlog = match
    ? blogs.find((blog) => blog.id === match.params.id)
    : null;

  const dispatch = useDispatch();

  const [hasBeenRemoved, setHasBeenRemoved] = useState(false);

  if (!matchedBlog) {
    return null;
  }

  const handleLike = () => {
    dispatch(likeBlog(matchedBlog)).then(() =>
      toast.success("Successfully liked blog!")
    );
  };

  const handleRemove = (blog) => {
    if (window.confirm(`Sure you want to remove ${blog.title}?`)) {
      dispatch(removeBlog(blog.id));
      setHasBeenRemoved(true);
    }
  };

  if (hasBeenRemoved) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <h2>{matchedBlog.title}</h2>
      {matchedBlog.author && (
        <p>
          Written by <strong>{matchedBlog.author}</strong>
        </p>
      )}
      {matchedBlog.url && <p>URL: {matchedBlog.url}</p>}
      <p>
        {matchedBlog.likes} likes{" "}
        <button onClick={() => handleLike()}>like ❤️</button>
      </p>
      <p>
        added by
        <Link to={`/users/${matchedBlog.user.id}`}>
          {" "}
          {matchedBlog.user.name}
        </Link>
      </p>
      <Comments blog={matchedBlog} />
      {user.username === matchedBlog.user.username && (
        <button onClick={() => handleRemove(matchedBlog)}>delete ⚠️</button>
      )}
    </div>
  );
};

const Navbar = ({ user, removeUser }) => {
  const handleLogout = () => {
    removeUser();
    toast.success("Successfully logged out!");
    return <Navigate to="/login" />;
  };

  return (
    <nav>
      {user && (
        <div>
          Logged in as {user.username}{" "}
          <button onClick={() => handleLogout()}>log out</button>
        </div>
      )}
      <ul className="flex justify-between text-lg items-center p-4 bg-amber text-navy">
        <Link to="/">Blogs</Link>
        <Link to="/create">Create a blog</Link>
        <Link to="/users">Users</Link>
      </ul>
    </nav>
  );
};

const App = () => {
  // eslint-disable-next-line no-unused-vars
  const [user, setUser, removeUser] = useLocalStorage("blogAppUser");
  const blogFormRef = useRef();

  const blogs = useSelector((state) => state.blogs);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      dispatch(fetchBlogs());
      dispatch(fetchUsers());
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
    }
  };

  return (
    <div>
      <Toaster />
      {user && <Navbar user={user} removeUser={removeUser} />}
      <Routes>
        <Route
          path="/login"
          element={<LoginForm handleLogin={handleLogin} />}
        />
        <Route
          path="/"
          element={
            <>
              <h2>Blogs</h2>
              <Togglable buttonLabel={"create a blog"} ref={blogFormRef}>
                <BlogForm toggleRef={blogFormRef} />
              </Togglable>
              <BlogList blogs={blogs} user={user} />
            </>
          }
        />

        <Route path="/create" element={<BlogForm toggleRef={blogFormRef} />} />
        <Route path="/users" element={<UsersList />} />

        <Route path="users/:id" element={<UserPage />} />
        <Route path="blogs/:id" element={<BlogPage user={user} />} />
      </Routes>
    </div>
  );
};

export default App;
