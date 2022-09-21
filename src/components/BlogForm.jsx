import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { createBlog } from "../reducers/blogReducer";

const BlogForm = ({ toggleRef }) => {
  const [blog, setBlog] = useState({
    title: "",
    author: "",
    url: "",
  });

  const dispatch = useDispatch();

  const handleBlogCreation = async (blog) => {
    if (blog.title.length === 0) {
      toast.error("Please enter a title");
      return;
    }

    try {
      dispatch(createBlog(blog));
      toast.success("Blog created successfully!");
      setBlog({
        title: "",
        author: "",
        url: "",
      });
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
    <div className="flex flex-col items-center rounded-lg p-4 border-4 border-brown">
      <h3 className="text-brown text-xl mb-4 font-semibold">Share a blog</h3>
      <form
        className="flex flex-col space-y-2"
        onSubmit={(e) => {
          e.preventDefault();
          handleBlogCreation(blog).then((status) => {
            if (status === "success") {
              setBlog({ title: "", author: "", url: "" });
            }
          });
        }}
      >
        <div>
          <p>title</p>
          <input
            className="border-2 border-brown m-2 rounded-lg"
            type="text"
            id="title"
            value={blog.title}
            name="title"
            onChange={(e) => setBlog({ ...blog, title: e.target.value })}
          />
        </div>
        <div>
          <p>author</p>
          <input
            type="text"
            className="border-2 border-brown m-2 rounded-lg"
            id="author"
            value={blog.author}
            name="author"
            onChange={(e) => setBlog({ ...blog, author: e.target.value })}
          />
        </div>
        <div>
          <p>url</p>
          <input
            type="text"
            className="border-2 border-brown m-2 rounded-lg"
            id="url"
            value={blog.url}
            name="url"
            onChange={(e) => setBlog({ ...blog, url: e.target.value })}
          />
        </div>
        <button className="bg-beige mt-4" id="create-blog-btn" type="submit">
          share
        </button>
      </form>
    </div>
  );
};

export default BlogForm;
