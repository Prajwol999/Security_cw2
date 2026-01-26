import axios from "../api";

export const getAllUserApi = (params) => axios.get("/admin/user", { params })
export const getOneUserApi = (id) => axios.get("/admin/user/" + id)
export const createOneUserApi = (data) => axios.post("/admin/user/add-user", data, { headers: { "Content-Type": "multipart/form-data" } })
export const updateOneUserApi = (id, data) => axios.put("/admin/user/" + id, data, { headers: { "Content-Type": "multipart/form-data" } })
export const deleteOneUserApi = (id) => axios.delete("/admin/user/" + id)
export const getAllLogsApi = () => axios.get("/auth/logs")
