import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { commentOnBlog } from "../reducers/blogReducer";

const Comments = ({ blog }) => {
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();

  const handleComment = (id, comment) => {
    if (comment.length < 1) {
      toast.error("Comment cannot be empty");
      return;
    }
    dispatch(commentOnBlog({ id, comment }));
    setComment("");
    toast.success("Commented on blog post!");
  };

  return (
    <div>
      <h3>comments</h3>
      <ul>
        {blog?.comments?.map((comment, index) => {
          return <li key={index}>{comment}</li>;
        })}
      </ul>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleComment(blog.id, comment);
        }}
      >
        <input value={comment} onChange={(e) => setComment(e.target.value)} />
        <button type="submit">comment 🙊</button>
      </form>
    </div>
  );
};

export default Comments;
