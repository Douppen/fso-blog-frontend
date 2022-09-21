import React, { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { likeBlog, removeBlog } from "../reducers/blogReducer";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Comments from "./Comments";
import fetchUsers from "../reducers/userReducer";

const Blog = ({ blog, user }) => {
  const [showDetails, setShowDetails] = useState(false);
  const dispatch = useDispatch();

  const handleLike = (blog) => {
    dispatch(likeBlog(blog)).then(() => {
      toast.success("Successfully liked blog!");
    });
  };

  const handleRemove = (blog) => {
    if (window.confirm(`Sure you want to remove ${blog.title}?`)) {
      dispatch(removeBlog(blog.id));
      dispatch(fetchUsers());
    }
  };

  return (
    <div className="blog shadow-lg rounded-2xl p-4 m-6 bg-darkpurple text-beige">
      <h3 className="text-beige font-medium text-2xl mb-4">
        <strong>
          <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
        </strong>{" "}
        <em className="text-cream">(shared by {blog.user.name})</em>
      </h3>
      {showDetails && (
        <div>
          {blog.url && (
            <p className="font-medium">
              URL:{" "}
              <a
                target="_blank"
                className="italic dont-break-out font-normal hover:text-cream"
                href={blog.url}
                rel="noreferrer"
              >
                {blog.url}
              </a>
            </p>
          )}

          {blog.author && (
            <p className="text-orange"> Written by {blog.author}</p>
          )}
          <div className="mb-2 mt-4 flex items-center space-x-3">
            <p className="text-cream">{blog.likes} likes</p>
            <button
              className="rounded hover:scale-110 active:scale-90 duration-150 transition-all"
              onClick={() => handleLike(blog)}
            >
              like
            </button>
          </div>
          <Comments blog={blog} />
          {user.username === blog.user.username && (
            <button onClick={() => handleRemove(blog)}>delete</button>
          )}
        </div>
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
  handleLike: PropTypes.func,
  handleRemove: PropTypes.func,
  user: PropTypes.object.isRequired,
};

export default Blog;
