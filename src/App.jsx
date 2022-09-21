import React, { useRef, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { useLocalStorage } from "react-use";
import BlogForm from "./components/BlogForm";
import BlogList from "./components/BlogList";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";
import { fetchBlogs } from "./reducers/blogReducer";
import { fetchUsers } from "./reducers/userReducer";
import loginService from "./services/login";
import ProtectedRoute from "./utils/ProtectedRoute";
import RegisterForm from "./components/RegisterForm";
import Navbar from "./components/Navbar";
import UsersList from "./components/UsersList";
import UserPage from "./components/UserPage";
import BlogPage from "./components/BlogPage";

const App = () => {
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
      <Toaster
        toastOptions={{
          style: {
            backgroundColor: "hsl(21, 48%, 14%)",
            color: "rgb(243, 201, 157)",
          },
        }}
      />
      {user && <Navbar user={user} removeUser={removeUser} />}
      <Routes>
        <Route
          path="/login"
          element={<LoginForm handleLogin={handleLogin} />}
        />
        <Route
          path="register"
          element={<RegisterForm handleLogin={handleLogin} />}
        />
        <Route path="/" element={<ProtectedRoute />}>
          <Route
            path="/"
            element={
              <div className="flex flex-col">
                <div className="flex flex-col items-center">
                  <Togglable buttonLabel={"share a blog"} ref={blogFormRef}>
                    <BlogForm toggleRef={blogFormRef} />
                  </Togglable>
                </div>
                <BlogList blogs={blogs} user={user} />
              </div>
            }
          />
        </Route>

        <Route path="/create" element={<ProtectedRoute />}>
          <Route
            path="/create"
            element={<BlogForm toggleRef={blogFormRef} />}
          />
        </Route>
        <Route path="/users" element={<ProtectedRoute />}>
          <Route path="/users" element={<UsersList loggedInUser={user} />} />
        </Route>
        <Route path="/users/:id" element={<ProtectedRoute />}>
          <Route
            path="/users/:id"
            element={<UserPage user={user} logOut={removeUser} />}
          />
        </Route>
        <Route path="/blogs/:id" element={<ProtectedRoute />}>
          <Route path="/blogs/:id" element={<BlogPage user={user} />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
