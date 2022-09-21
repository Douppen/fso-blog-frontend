import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useMatch } from "react-router-dom";
import { likeBlog, removeBlog } from "../reducers/blogReducer";
import Comments from "./Comments";
import fetchUsers from "../reducers/userReducer";

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
      dispatch(fetchUsers());
      setHasBeenRemoved(true);
    }
  };

  if (hasBeenRemoved) {
    return <Navigate to="/" />;
  }

  return (
    <div className="blog shadow-lg rounded-2xl p-4 m-6 bg-darkpurple text-beige">
      <h3 className="text-beige font-medium text-2xl mb-4">
        <strong>{matchedBlog.title}</strong>{" "}
        <em className="text-cream">(shared by {matchedBlog.user.name})</em>
      </h3>
      <div>
        {matchedBlog.url && (
          <p className="font-medium">
            URL:{" "}
            <a
              target="_blank"
              className="italic dont-break-out hover:text-cream"
              href={matchedBlog.url}
              rel="noreferrer"
            >
              {matchedBlog.url}
            </a>
          </p>
        )}

        {matchedBlog.author && (
          <p className="text-orange"> Written by {matchedBlog.author}</p>
        )}
        <div className="mb-2 mt-4 flex items-center space-x-3">
          <p className="text-cream">{matchedBlog.likes} likes</p>
          <button
            className="rounded hover:scale-110 active:scale-90 duration-150 transition-all"
            onClick={() => handleLike(matchedBlog)}
          >
            like
          </button>
        </div>
        <Comments blog={matchedBlog} />
        {user.username === matchedBlog.user.username && (
          <button onClick={() => handleRemove(matchedBlog)}>delete</button>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
