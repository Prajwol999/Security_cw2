export const getBackendImageUrl = (CimagePath) => {
    if(!CimagePath) return null
    const apiUrl = import.meta.env.VITE_BACKEND_URL || 
        "http://localhost:5050"
    
    return apiUrl + "/"  + CimagePath
}