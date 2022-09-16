import axios from "axios";
const baseUrl = "/api/blogs";

const blogService = () => {
  const token = JSON.parse(localStorage.getItem("blogAppUser")).token;

  const config = {
    headers: { Authorization: `bearer ${token}` },
  };

  const getAll = () => {
    return axios.get(baseUrl, config).then((response) => response.data);
  };

  const create = (blog) => {
    return axios.post(baseUrl, blog, config).then((response) => response.data);
  };

  const update = (id, newBlog) => {
    return axios
      .put(`${baseUrl}/${id}`, newBlog, config)
      .then((response) => response.data);
  };

  return { getAll, create, update };
};

export default blogService;
