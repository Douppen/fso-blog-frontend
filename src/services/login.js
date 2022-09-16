import axios from "axios";
const baseUrl = "/api/login";

/**
 *
 * @param {*} credentials
 * @returns response data
 */
const login = async (credentials) => {
  const res = await axios.post(baseUrl, credentials);
  return res.data;
};

export default { login };
