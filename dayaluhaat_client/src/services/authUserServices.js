import { loginUserApi, registerUserApi, getMeApi,           // ✅ Import new API function
    updateMeApi,        // ✅ Import new API function
    changePasswordApi  } from "../api/authUserAPi";

export const registerUserService = async (formData) => {
  try {
    const response = await registerUserApi(formData);
    return response.data; 
  } catch (err) {
    throw err.response?.data || { message: "Registration for donor failed" };
  }
};

export const loginUserService = async (formData) => {
  try {
    const response = await loginUserApi(formData);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Login failed" };
  }
};
export const getProfileService = async () => {
  try {
    const response = await getMeApi();
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to fetch profile" };
  }
};

export const updateProfileService = async (formData) => {
  try {
    const response = await updateMeApi(formData);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to update profile" };
  }
};

export const changePasswordService = async (passwordData) => {
  try {
    const response = await changePasswordApi(passwordData);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to change password" };
  }
};
