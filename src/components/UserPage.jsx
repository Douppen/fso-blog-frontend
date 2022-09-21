import { useSelector } from "react-redux";
import { Link, useMatch } from "react-router-dom";
import { faker } from "@faker-js/faker";
import userService from "../services/users";
import toast from "react-hot-toast";

const UserPage = ({ user, logOut }) => {
  const match = useMatch("/users/:id");
  const users = useSelector((state) => state.users);
  const matchedUser = match
    ? users.find((user) => user.id === match.params.id)
    : null;

  if (!matchedUser) {
    return (
      <div>
        <h2>Users</h2>
        <p>Loading...</p>
      </div>
    );
  }

  const randomString = faker.word.adverb() + " " + faker.word.adjective();

  const handleDelete = (user) => {
    if (window.confirm(`Sure you want to delete your profile?`)) {
      const myPromise = new Promise((resolve) => {
        setTimeout(() => {
          userService()
            .remove(user.id)
            .then(() => {
              resolve("success");
            });
        }, 2400);
      });
      toast.promise(
        myPromise,
        {
          loading: "Deleting profile...",
          success: "Profile deleted!",
          error: "Error deleting profile",
        },
        {
          style: {
            minWidth: "250px",
          },
          success: {
            duration: 4000,
            icon: "😢",
          },
        }
      );
      myPromise.then(() => {
        logOut();
      });
    }
  };

  return (
    <div className="flex flex-col sm:p-8 max-w-xl mx-auto rounded-xl bg-darkpurple p-6 text-cream">
      {user.id === matchedUser.id && (
        <p className="mb-1 font-normal">This is your profile page</p>
      )}
      <h2 className="font-medium text-beige text-2xl mb-4">
        {matchedUser.name}
        <span className="font-normal"> is </span>
        <em className="font-normal">{randomString}</em>
      </h2>
      <p>
        <strong>Username: </strong>
        {matchedUser.username}
      </p>
      <p className="mb-8">
        <strong>Blogs shared: </strong>
        {matchedUser.blogs.length}
      </p>
      {matchedUser.blogs.length > 0 ? (
        <>
          <h3 className="text-xl font-semibold text-beige">Blogs</h3>
          <ul>
            {matchedUser.blogs.map((blog) => (
              <li
                className="font-medium underlin sm:text-lg list-disc ml-6 hover:text-beige"
                key={blog.id}
              >
                <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="text-center text-beige font-medium">
          {matchedUser.name === user.name
            ? "you have "
            : matchedUser.name + " has "}
          not shared any blogs yet.
        </p>
      )}
      {matchedUser.id === user.id && (
        <button
          onClick={() => handleDelete(user)}
          className="mt-6 hover:scale-[1.03] active:scale-95 hover:bg-orange transition-all"
        >
          delete profile
        </button>
      )}
    </div>
  );
};

export default UserPage;
