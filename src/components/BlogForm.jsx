import React, { useState } from "react";

const BlogForm = ({ handleBlogCreation }) => {
  const [blog, setBlog] = useState({
    title: "",
    author: "",
    url: "",
    likes: 0,
  });

  return (
    <div>
      <h2>create new</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleBlogCreation(blog).then((status) => {
            if (status === "success") {
              setBlog({ title: "", author: "", url: "", likes: 0 });
            }
          });
        }}
      >
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
  );
};

export default BlogForm;
