import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createOneUserService, deleteUserService, getAllUserService, getUserByIdService, updateOneUserService } from "../../services/admin/userService"
import { useState } from "react"
import toast from "react-hot-toast"

export const useAdminUser=()=>{
  const [pageNumber, setPageNumber] = useState(1) // 
    const [pageSize, setPageSize] = useState(10) // 
    const [search, setSearch ] = useState("") //
    const query= useQuery(
        {
            queryKey:["admin_user",, pageNumber, pageSize, search],
            queryFn:()=>{
                return getAllUserService(
                    {
                        page: pageNumber,
                        limit: pageSize,
                        search: search
                    }
                )
            },
            keepPreviousData:true
        }
        
    )
    const users = query.data?.data || []
    const pagination = query.data?.pagination || {
        page:1, totalPages:1, limit: 10
    }
    const canPreviousPage = pagination.page > 1
    const canNextPage = pagination.page < pagination.totalPages
    return{
      ...query,
        users,
        pagination,
        canPreviousPage,
        canNextPage,
        setPageNumber,
        setPageSize,
        setSearch
        

    }
}

export const useCreateUser = () => {
    const queryClient = useQueryClient()
    return useMutation(
        {
            mutationKey:
                ["admin_create_user"],
            mutationFn:
                createOneUserService,
            onSuccess: () => {
                queryClient
                    .invalidateQueries(
                        "admin_user"
                    )
            }
        }
    )
}
export const useGetOneUser = (id) => {
    const query = useQuery(
        {
            queryKey: ["admin_user_detail", id],
            queryFn: () => getUserByIdService(id),
            enabled: !!id, // id is not null or undefined
            retry: false // tries 3 times default
        }
    )
    const user = query.data?.data || {}
    return {
        ...query, user
    }
}

export const useUpdateUser = () => {
    const queryClient = useQueryClient()
    return useMutation(
        {
            mutationFn: ({id, data}) => updateOneUserService(id, data),
            mutationKey: ["admin_user_update"],
            onSuccess: () => {
                toast.success("Updated")
                queryClient.invalidateQueries(
                    ["admin_user", "admin_user_detail"]
                )
            },
            onError: (err)=> {
                toast.error(err.message || "Update failed")
            }
        }
    )
}



export const useDeleteOneUser = () => {
    const queryClient = useQueryClient()
    return useMutation(
        {
            mutationFn: deleteUserService,
            mutationKey: ["admin_user_delete"],
            onSuccess: () => {
                toast.success("Deleted")
                queryClient.invalidateQueries(["admin_user"])
            },
            onError: (err)=> {
                console.log(err)
                toast.error(err.message || "Delete Failed")
            }
        }
    )
}