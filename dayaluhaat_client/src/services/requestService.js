import {
  addOneRequestApi,
  getMyRequestsApi,
  deleteRequestApi,
  getAllRequestsApi,
  updateRequestStatusApi,
} from "../api/requestApi";

export const addOneRequestService = async (data) => {
  try {
    const response = await addOneRequestApi(data);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to submit request" };
  }
};

export const getMyRequestsService = async () => {
  try {
    const response = await getMyRequestsApi();
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to fetch requests" };
  }
};

export const deleteRequestService = async (id) => {
  try {
    const response = await deleteRequestApi(id);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to delete request" };
  }
};

export const getAllRequestsService = async (params) => {
  try {
    const response = await getAllRequestsApi(params);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to fetch admin requests" };
  }
};

export const updateRequestStatusService = async ({ id, data }) => {
    
  try {
    const response = await updateRequestStatusApi(id, data);
    
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to update request status" };
  }
};
