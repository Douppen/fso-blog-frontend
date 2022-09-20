import React, { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { likeBlog, removeBlog } from "../reducers/blogReducer";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Comments from "./Comments";

const Blog = ({ blog, user }) => {
  const [showDetails, setShowDetails] = useState(false);
  const dispatch = useDispatch();

  const handleLike = (blog) => {
    dispatch(likeBlog(blog));
    const message = `You liked "${blog.title}"`;
    toast.success(message);
  };

  const handleRemove = (blog) => {
    if (window.confirm(`Sure you want to remove ${blog.title}?`)) {
      dispatch(removeBlog(blog.id));
    }
  };

  return (
    <div className="blog shadow-lg rounded-2xl p-4 m-10;">
      <h3 className="text-navy">
        <strong>
          <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
        </strong>{" "}
        <em>(created by {blog.user.username})</em>
      </h3>
      {showDetails && (
        <>
          {blog.url && (
            <p>
              URL: <a href={"https://" + blog.url}>{blog.url}</a>
            </p>
          )}

          {blog.author && (
            <p className="text-navy"> Written by {blog.author}</p>
          )}
          <p className="text-navy">
            {blog.likes} likes{" "}
            <button onClick={() => handleLike(blog)}>like ❤️</button>
          </p>
          <Comments blog={blog} />
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
  handleLike: PropTypes.func,
  handleRemove: PropTypes.func,
  user: PropTypes.object.isRequired,
};

export default Blog;
