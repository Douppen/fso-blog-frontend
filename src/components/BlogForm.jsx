import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { createBlog } from "../reducers/blogReducer";

const BlogForm = ({ toggleRef }) => {
  const [blog, setBlog] = useState({
    title: "",
    author: "",
    url: "",
    likes: 0,
  });

  const dispatch = useDispatch();

  const handleBlogCreation = async (blog) => {
    try {
      dispatch(createBlog(blog));
      toast.success("Blog created successfully!");
      toggleRef.current.toggleVisibility();
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

  return (
    <div>
      <h3>create new</h3>
      <form
        className="blog-form"
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
            placeholder="title"
            id="title"
            value={blog.title}
            name="title"
            onChange={(e) => setBlog({ ...blog, title: e.target.value })}
          />
        </div>
        <div>
          author:
          <input
            type="text"
            placeholder="author"
            id="author"
            value={blog.author}
            name="author"
            onChange={(e) => setBlog({ ...blog, author: e.target.value })}
          />
        </div>
        <div>
          url:
          <input
            type="text"
            placeholder="url"
            id="url"
            value={blog.url}
            name="url"
            onChange={(e) => setBlog({ ...blog, url: e.target.value })}
          />
        </div>
        <div>
          likes:
          <input
            type="number"
            placeholder="likes"
            id="likes"
            value={blog.likes}
            name="likes"
            onChange={(e) => setBlog({ ...blog, likes: e.target.value })}
          />
        </div>
        <button id="create-blog-btn" type="submit">
          create
        </button>
      </form>
    </div>
  );
};

export default BlogForm;
