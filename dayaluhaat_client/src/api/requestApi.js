import axios from "./api";


export const addOneRequestApi = (data) =>
  axios.post("/request", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });


export const getMyRequestsApi = () => axios.get("/request/my-requests");


export const deleteRequestApi = (id) => axios.delete(`/request/${id}`);

export const getAllRequestsApi = (params) =>
  axios.get("/request/admin", { params });


export const updateRequestStatusApi = (id, data) =>
  axios.patch(`/request/admin/${id}/status`, data);
