import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import {
  addOneRequestService,
  getMyRequestsService,
  deleteRequestService,
  getAllRequestsService,
  updateRequestStatusService,
} from "../services/requestService"

// Patient: Fetch my requests
export const useMyRequests = () => {
  const query = useQuery({
    queryKey: ["my_requests"],
    queryFn: getMyRequestsService,
    retry: false,
  })
  const myRequests = query.data?.data || []
  return { ...query, myRequests }
}

// Patient: Add request - FIXED ERROR HANDLING
export const useAddRequest = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addOneRequestService,
    onSuccess: (data) => {
      toast.success(data?.message || "Request submitted successfully")
      queryClient.invalidateQueries({ queryKey: ["my_requests"] })
    },
    onError: (err) => {
      // BETTER ERROR LOGGING
      console.error("Add request error details:", {
        message: err?.message,
        response: err?.response?.data,
        status: err?.response?.status,
        fullError: err,
      })

      // EXTRACT PROPER ERROR MESSAGE
      let errorMessage = "Failed to submit request"

      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message
      } else if (err?.message) {
        errorMessage = err.message
      } else if (typeof err === "string") {
        errorMessage = err
      }

      toast.error(errorMessage)
    },
  })
}

// Patient: Delete request
export const useDeleteRequest = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteRequestService,
    onSuccess: (data) => {
      toast.success(data?.message || "Request deleted successfully")
      queryClient.invalidateQueries({ queryKey: ["my_requests"] })
    },
    onError: (err) => {
      console.error("Delete request error:", err)
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to delete request"
      toast.error(errorMessage)
    },
  })
}

// Admin: Fetch all requests (with pagination, status, date filter)
export const useAdminRequests = (params) => {
  const query = useQuery({
    queryKey: ["admin_requests", params],
    queryFn: () => getAllRequestsService(params),
    keepPreviousData: true,
    retry: false,
  })
  const requests = query.data?.data || []
  const pagination = query.data?.pagination || { page: 1, totalPages: 1 }
  return { ...query, requests, pagination }
}

// Admin: Update request status
export const useUpdateRequestStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateRequestStatusService,
    onSuccess: (res) => {
      toast.success(res?.message || "Status updated successfully")
      queryClient.invalidateQueries({ queryKey: ["admin_requests"] })
      queryClient.invalidateQueries({ queryKey: ["my_requests"] })
    },
    onError: (err) => {
      console.error("Update status error:", err)
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to update status"
      toast.error(errorMessage)
    },
  })
}
