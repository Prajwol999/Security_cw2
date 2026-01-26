import axios from "./api";

export const registerUserApi=(data)=>axios.post("/auth/register", data);
export const loginUserApi=(data)=>axios.post("/auth/login", data);


export const getMeApi = () => axios.get("/users/me");
export const updateMeApi = (data) => axios.put("/users/me", data);
export const changePasswordApi = (data) => axios.put("/users/changepassword", data);