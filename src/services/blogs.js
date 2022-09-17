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

  const like = async (blog) => {
    let newBlog = {
      ...blog,
      likes: blog.likes + 1,
    };

    newBlog.user = newBlog.user.id;

    const response = await axios.put(`${baseUrl}/${blog.id}`, newBlog, config);
    return response.data;
  };

  const remove = async (id) => {
    await axios.delete(`${baseUrl}/${id}`, config);
  };

  return { getAll, create, update, like, remove };
};

export default blogService;
