"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useCreateUser } from "../../../hooks/admin/useAdminUser";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { X, User, Activity, FileText, Phone, Lock, UserPlus, Loader2, Upload, ImageIcon } from "lucide-react";
import { useState } from "react";

export default function AddUserModal({ isOpen, onClose }) {
  const { mutate, isLoading } = useCreateUser();
  const queryClient = useQueryClient();
  const [imagePreview, setImagePreview] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      disease: "",
      description: "",
      contact: "",
      password: "",
      image: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      disease: Yup.string().required("Disease is required"),
      description: Yup.string(),
      contact: Yup.string().required("Contact is required"),
      password: Yup.string().min(6).required("Password is required"),
      image: Yup.mixed().nullable(),
    }),
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("disease", values.disease);
      formData.append("description", values.description);
      formData.append("contact", values.contact);
      formData.append("password", values.password);

      if (values.image) {
        formData.append("image", values.image);
      }

      mutate(formData, {
        onSuccess: (data) => {
          console.log("Created User:", data);
          toast.success("User added successfully");
          formik.resetForm();
          setImagePreview(null);
          queryClient.invalidateQueries(["users"]);
          onClose();
        },
        onError: (err) => {
          console.error("Error adding user:", err);
          toast.error(err.message || "Failed to add user");
        },
      });
    },
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      formik.setFieldValue("image", file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    formik.setFieldValue("image", null);
    setImagePreview(null);
  };

  if (!isOpen) return null;

  const fieldConfig = [
    { name: "name", icon: User, label: "Full Name", placeholder: "Enter user's full name" },
    { name: "disease", icon: Activity, label: "Disease/Condition", placeholder: "Enter medical condition" },
    { name: "description", icon: FileText, label: "Description", placeholder: "Additional details (optional)" },
    { name: "contact", icon: Phone, label: "Contact Information", placeholder: "Phone number or email" },
    { name: "password", icon: Lock, label: "Password", placeholder: "Create a secure password", type: "password" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl min-h-[600px] max-h-[95vh] flex flex-col animate-in fade-in-0 zoom-in-95 duration-300">
        <div className="bg-gradient-to-r from-blood-600 to-blood-700 px-8 py-6 text-white relative overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 bg-white opacity-10 transform -skew-y-1"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-xl">
                <UserPlus className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Add New user</h2>
                <p className="text-blood-100 text-sm">Enter user information below</p>
              </div>
            </div>
            <button
              onClick={() => {
                formik.resetForm();
                setImagePreview(null);
                onClose();
              }}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-xl transition-all duration-200"
              disabled={isLoading}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-4">user Photo</label>
                <div className="space-y-4">
                  <div className="relative">
                    {imagePreview ? (
                      <div className="relative group">
                        <img
                          src={imagePreview}
                          alt="user preview"
                          className="w-full h-48 object-cover rounded-xl border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50">
                        <div className="text-center">
                          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">No image selected</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex items-center justify-center w-full px-4 py-3 border-2 border-blood-300 border-dashed rounded-xl cursor-pointer hover:bg-blood-50 transition-colors duration-200"
                    >
                      <Upload className="h-5 w-5 text-blood-500 mr-2" />
                      <span className="text-blood-600 font-medium">
                        {imagePreview ? "Change Photo" : "Upload Photo"}
                      </span>
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 text-center">Supported: JPG, PNG, GIF (Max 5MB)</p>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                {fieldConfig.map((field) => {
                  const IconComponent = field.icon;
                  const hasError = formik.touched[field.name] && formik.errors[field.name];

                  return (
                    <div key={field.name} className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor={field.name}>
                        {field.label}
                        {field.name !== "description" && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <IconComponent className={`h-5 w-5 ${hasError ? "text-red-400" : "text-gray-400"}`} />
                        </div>
                        {field.name === "description" ? (
                          <textarea
                            id={field.name}
                            name={field.name}
                            rows={3}
                            placeholder={field.placeholder}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values[field.name]}
                            className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl transition-all duration-200 resize-none ${
                              hasError
                                ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                                : "border-gray-200 focus:border-blood-500 focus:ring-blue-200"
                            } focus:ring-4 focus:ring-opacity-20 focus:outline-none`}
                          />
                        ) : (
                          <input
                            id={field.name}
                            name={field.name}
                            type={field.type || "text"}
                            placeholder={field.placeholder}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values[field.name]}
                            className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl transition-all duration-200 ${
                              hasError
                                ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                                : "border-gray-200 focus:border-blood-500 focus:ring-blue-200"
                            } focus:ring-4 focus:ring-opacity-20 focus:outline-none`}
                          />
                        )}
                      </div>
                      {hasError && (
                        <div className="flex items-center space-x-2 text-red-600 text-sm mt-2 animate-in slide-in-from-top-1 duration-200">
                          <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                          <span>{formik.errors[field.name]}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </form>
        </div>

        <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 flex justify-end space-x-4 flex-shrink-0">
          <button
            type="button"
            onClick={() => {
              formik.resetForm();
              setImagePreview(null);
              onClose();
            }}
            className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-200"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={formik.handleSubmit}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-blood-600 to-blood-700 text-white font-semibold hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg hover:shadow-xl"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Adding user...</span>
              </>
            ) : (
              <>
                <UserPlus className="h-5 w-5" />
                <span>Add user</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

