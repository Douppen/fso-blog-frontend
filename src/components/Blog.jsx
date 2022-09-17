import React, { useState } from "react";
import PropTypes from "prop-types";

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
    <div style={blogStyle} className="blog">
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
  handleLike: PropTypes.func,
  handleRemove: PropTypes.func,
  user: PropTypes.object.isRequired,
};

export default Blog;
