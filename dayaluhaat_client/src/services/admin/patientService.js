// import { createOnePatientApi, deleteOnePatientApi, getAllPatientApi, getOnePatientApi, updateOnePatientApi } from "../../api/admin/patientApi"

// export const getAllPatientService = async (params) => {
//   try {
//     const response = await getAllPatientApi(params)
//     return response.data
//   } catch (err) {
//     console.error(err)
//     throw err.response?.data || { message: "Failed to fetch patients" }
//   }
// }

// export const createOnePatientService = async (data) => {
//     try{
//         const response = await createOnePatientApi(data)
//         return response.data
//     }catch(err){
      
//         throw err.response?.data || { message: 'Failed to create'}
//     }
// }




// export const getPatientByIdService = async (id) => {
//   try {
//     const response = await getOnePatientApi(id)
//     return response.data
//   } catch (err) {
//     console.error(err)
//     throw err.response?.data || { message: "Failed to fetch patient details" }
//   }
// }


// export const deletePatientService = async (id) => {
//   try {
//     const response = await deleteOnePatientApi(id)
//     return response.data
//   } catch (err) {
//     throw err.response?.data || { message: "Failed to delete patient" }
//   }
// }

// export const updateOnePatientService = async (id, data) => {
//   try {
//     const response = await updateOnePatientApi(id, data)
//     return response.data
//   } catch (err) {
//     console.error(err)
//     throw err.response?.data || { message: "Failed to update patient" }
//   }
// }

