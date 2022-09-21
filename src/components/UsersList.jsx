import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const UsersList = ({ loggedInUser }) => {
  const users = useSelector((state) => state.users);

  if (users.length === 0) {
    return (
      <div>
        <h2>Users</h2>
        <p>You must be authenticated to view users</p>
      </div>
    );
  }

  return (
    <div className="sm:p-8 flex flex-col max-w-md mx-auto">
      <div className="flex flex-col items-stretch">
        <h2 className="text-3xl mb-6 font-bold mx-auto">All Users</h2>
        <table className="text-center">
          <thead>
            <tr className="text-xl">
              <th>Name</th>
              <th>Username</th>
              <th>Blogs shared</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="text-orange font-semibold">
                  <Link className="hover:text-beige" to={`/users/${user.id}`}>
                    {user.name}
                  </Link>
                  {loggedInUser.id === user.id && (
                    <span className="text-sm font-normal text-brown">
                      {" "}
                      (you)
                    </span>
                  )}
                </td>
                <td className="font-medium">{user.username}</td>
                <td>{user.blogs.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersList;
