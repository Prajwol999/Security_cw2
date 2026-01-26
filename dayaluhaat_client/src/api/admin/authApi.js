import axios from "axios";

const BASE_URL = "http://localhost:5050/api/auth/admin";

/**
 * Admin login API call
 * @param {Object} credentials - { username, password }
 * @returns {Promise}
 */
export const adminLogin = (credentials) => {
  return axios.post(`${BASE_URL}/login`, credentials);
};
