import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { commentOnBlog } from "../reducers/blogReducer";

const Comments = ({ blog }) => {
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();

  const handleComment = (id, comment) => {
    if (comment.length < 3) {
      toast.error("Comment must be at least 3 characters");
      return;
    }

    if (comment.length > 100) {
      toast.error("Comment cannot be longer than 100 characters");
      return;
    }

    dispatch(commentOnBlog({ id, comment }));

    setComment("");
    toast.success("Commented on blog post!");
  };

  return (
    <div>
      <h3 className="font-semibold text-lg text-beige mb-1 underline">
        Comments
      </h3>
      <ul className="text-cream space-y-2">
        {blog?.comments?.map((comment, index) => {
          return <li key={index}>{comment}</li>;
        })}
      </ul>
      <form
        className="flex flex-col space-y-2 my-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleComment(blog.id, comment);
        }}
      >
        <input value={comment} onChange={(e) => setComment(e.target.value)} />
        <button
          className="bg-beige py-2 hover:scale-[1.03] active:scale-95"
          type="submit"
        >
          comment
        </button>
      </form>
    </div>
  );
};

export default Comments;
