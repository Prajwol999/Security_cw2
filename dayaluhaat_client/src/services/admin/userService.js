import {
  getAllUserApi,
  getOneUserApi,
  createOneUserApi,
  updateOneUserApi,
  deleteOneUserApi,
} from "../../api/admin/userApi";

// Get all users with optional search/pagination
export const getAllUserService = async (params) => {
  try {
    const response = await getAllUserApi(params);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to fetch users" };
  }
};

// Create a new user
export const createOneUserService = async (data) => {
  try {
    const response = await createOneUserApi(data);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to create user" };
  }
};

// Get user by ID
export const getUserByIdService = async (id) => {
  try {
    const response = await getOneUserApi(id);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err.response?.data || { message: "Failed to fetch user details" };
  }
};

// Delete user by ID
export const deleteUserService = async (id) => {
  try {
    const response = await deleteOneUserApi(id);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err.response?.data || { message: "Failed to delete user" };
  }
};

// Update user by ID
export const updateOneUserService = async (id, data) => {
  try {
    const response = await updateOneUserApi(id, data);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err.response?.data || { message: "Failed to update user" };
  }
};
