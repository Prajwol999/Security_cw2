"use client"

import { useState } from "react"
import { X, Upload, FileText, UserIcon, FileBadge, Sparkles, Heart } from "lucide-react"
import { useAddRequest } from "../../../hooks/useRequest"
import { toast } from "react-hot-toast"
import { validateFile } from "../../../utils/fileValidation"

const FileUploadInput = ({ title, file, onFileChange, id, icon, acceptedTypes, required = true }) => (
  <div className="group">
    <label htmlFor={id} className="block text-sm font-semibold text-gray-800 mb-3">
      {title} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-blood-400 hover:bg-blood-50/30 transition-all duration-300 cursor-pointer group-hover:scale-[1.02]">
      <input
        type="file"
        onChange={onFileChange}
        accept={acceptedTypes}
        className="hidden"
        id={id}
        required={required}
      />
      <label htmlFor={id} className="cursor-pointer w-full">
        <div className="flex flex-col items-center space-y-4">
          {file ? (
            <>
              <div className="relative">
                {icon.selected}
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-blood-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="text-center">
                <span className="text-sm font-semibold text-blood-700 block mb-1">{file.name}</span>
                <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Click to change file</span>
              </div>
            </>
          ) : (
            <>
              <div className="relative">
                {icon.default}
                <div className="absolute inset-0 bg-blood-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="text-center">
                <span className="text-sm font-semibold text-gray-700 block mb-1">Click to upload</span>
                <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {acceptedTypes.replace(/,/g, ", ")}
                </span>
              </div>
            </>
          )}
        </div>
      </label>
    </div>
  </div>
)

export default function AddRequest({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    description: "",
    neededAmount: "",
    condition: "moderate",
    inDepthStory: "",
    citizen: "",
  })

  const [userImage, setUserImage] = useState(null)
  const [citizenshipImage, setCitizenshipImage] = useState(null)
  const [supportingDoc, setSupportingDoc] = useState(null)
  const addRequestMutation = useAddRequest()

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0]

    if (!file) return;

    // Validate file with security checks
    const validation = validateFile(file, 'document');
    if (!validation.valid) {
      toast.error(validation.error);
      e.target.value = ''; // Clear the input
      return;
    }

    // File is valid, proceed
    if (fileType === "userImage") setUserImage(file)
    else if (fileType === "citizenshipImage") setCitizenshipImage(file)
    else if (fileType === "supportingDoc") setSupportingDoc(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!userImage || !citizenshipImage || !supportingDoc) {
      toast.error("Please upload all three required documents.")
      return
    }

    const requiredFields = ["description", "neededAmount", "condition", "inDepthStory", "citizen"]
    for (const field of requiredFields) {
      if (!formData[field] || String(formData[field]).trim() === "") {
        const fieldName = field.replace(/([A-Z])/g, " $1").toLowerCase()
        toast.error(`Please fill in the ${fieldName} field.`)
        return
      }
    }

    const submitData = new FormData()
    Object.keys(formData).forEach((key) => {
      submitData.append(key, formData[key])
    })

    submitData.append("userImage", userImage)
    submitData.append("citizenshipImage", citizenshipImage)
    submitData.append("file", supportingDoc)

    try {
      await addRequestMutation.mutateAsync(submitData)
      setFormData({ description: "", neededAmount: "", condition: "moderate", inDepthStory: "", citizen: "" })
      setUserImage(null)
      setCitizenshipImage(null)
      setSupportingDoc(null)
      onClose()
    } catch (error) {
      console.error("Form submission error:", error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blood-600 via-blood-600 to-purple-600 p-8 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl translate-y-12 -translate-x-12"></div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">Submit New Request</h2>
                <p className="text-blood-100 text-lg">Help us understand your medical assistance needs</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-white/20 rounded-2xl transition-all duration-300 hover:scale-110 border border-white/20"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8 max-h-[calc(95vh-200px)] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-gradient-to-r from-gray-50 to-blood-50 rounded-2xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-3">
                <div className="w-8 h-8 bg-blood-500 rounded-xl flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <span>Basic Information</span>
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Request Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blood-100 focus:border-blood-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                    placeholder="Briefly describe your medical assistance request..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                      Amount Needed ($) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                        $
                      </span>
                      <input
                        type="number"
                        name="neededAmount"
                        value={formData.neededAmount}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.01"
                        className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blood-100 focus:border-blood-500 transition-all duration-300 bg-white/80 backdrop-blur-sm font-semibold"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                      Medical Condition <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="condition"
                      value={formData.condition}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blood-100 focus:border-blood-500 transition-all duration-300 bg-white/80 backdrop-blur-sm font-semibold"
                    >
                      <option value="moderate">Moderate</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Citizenship Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="citizen"
                    value={formData.citizen}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blood-100 focus:border-blood-500 transition-all duration-300 bg-white/80 backdrop-blur-sm font-semibold"
                  >
                    <option value="">Select status...</option>
                    <option value="citizen">Citizen</option>
                    <option value="permanent_resident">Permanent Resident</option>
                    <option value="temporary_resident">Temporary Resident</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Detailed Story <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="inDepthStory"
                    value={formData.inDepthStory}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blood-100 focus:border-blood-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                    placeholder="Please provide a detailed explanation of your situation, medical needs, and how this assistance will help you..."
                  />
                </div>
              </div>
            </div>

            {/* File Uploads */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-500 rounded-xl flex items-center justify-center">
                  <Upload className="w-4 h-4 text-white" />
                </div>
                <span>Required Documents</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FileUploadInput
                  title="Your Photo"
                  file={userImage}
                  onFileChange={(e) => handleFileChange(e, "userImage")}
                  id="user-image-upload"
                  icon={{
                    default: <UserIcon className="h-12 w-12 text-gray-400" />,
                    selected: <UserIcon className="h-12 w-12 text-blood-500" />,
                  }}
                  acceptedTypes=".jpg,.jpeg,.png"
                />

                <FileUploadInput
                  title="Citizenship Proof"
                  file={citizenshipImage}
                  onFileChange={(e) => handleFileChange(e, "citizenshipImage")}
                  id="citizenship-image-upload"
                  icon={{
                    default: <FileBadge className="h-12 w-12 text-gray-400" />,
                    selected: <FileBadge className="h-12 w-12 text-blood-500" />,
                  }}
                  acceptedTypes=".jpg,.jpeg,.png,.pdf"
                />

                <FileUploadInput
                  title="Medical Document"
                  file={supportingDoc}
                  onFileChange={(e) => handleFileChange(e, "supportingDoc")}
                  id="supporting-doc-upload"
                  icon={{
                    default: <FileText className="h-12 w-12 text-gray-400" />,
                    selected: <FileText className="h-12 w-12 text-blood-500" />,
                  }}
                  acceptedTypes=".pdf,.jpg,.jpeg,.png"
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-4 pt-6">
              <button
                type="submit"
                disabled={addRequestMutation.isPending}
                className="flex-1 bg-gradient-to-r from-blood-600 to-blood-600 text-white py-4 px-6 rounded-2xl hover:from-blue-700 hover:to-blood-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center space-x-3"
              >
                {addRequestMutation.isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-5 h-5" />
                    <span>Submit Request</span>
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}


