import toast from "react-hot-toast";
import { Link, Navigate } from "react-router-dom";

const Navbar = ({ user, removeUser }) => {
  const handleLogout = () => {
    removeUser();
    toast.success("Successfully logged out!");
    return <Navigate to="/login" />;
  };

  return (
    <nav className="sm:px-8 pt-2 pb-2">
      <div>
        <ul className="flex justify-evenly font-medium sm:max-w-2xl mx-auto text-lg sm:text-2xl items-center sm:p-4 bg-amber text-navy">
          <li className="hover:scale-105 transition-all hover:text-orange hover:font-bold">
            <Link to="/">Blogs</Link>
          </li>
          <li className="hover:scale-105 transition-all hover:text-orange hover:font-bold">
            <Link to="/create">Create</Link>
          </li>
          <li className="hover:scale-105 transition-all hover:text-orange hover:font-bold">
            <Link to="/users">Users</Link>
          </li>
          {user && (
            <li className="flex flex-col justify-center items-center">
              <p className="text-sm text-orange hover:text-beige">
                <Link to={`/users/${user.id}`}>{user.username}</Link>
              </p>
              <button
                className="bg-cream hover:scale-105 transition-all hover:text-orange hover:font-bold"
                onClick={() => handleLogout()}
              >
                log out
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
