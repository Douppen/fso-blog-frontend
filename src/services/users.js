import axios from "axios";
const baseUrl = "/api/users";

const userService = () => {
  const token = JSON.parse(localStorage.getItem("blogAppUser"))?.token;

  const config = {
    headers: { Authorization: `bearer ${token}` },
  };

  const getAll = () => {
    return axios.get(baseUrl, config).then((response) => response.data);
  };

  const create = ({ username, name, password }) => {
    return axios
      .post(baseUrl, { username, name, password })
      .then((response) => response.data);
  };

  const remove = (id) => {
    return axios
      .delete(`${baseUrl}/${id}`, config)
      .then((response) => response.data);
  };

  return { getAll, create, remove };
};

export default userService;
