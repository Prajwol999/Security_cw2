import React from 'react';
   import {
     X,
     User,
     Phone,
     Mail,
     FileText,
     Activity,
     Calendar,
     MapPin,
     Camera,
     Shield,
     Heart,
     AlertCircle,
     ImageIcon,
     DollarSign,
     Clock,
     CheckCircle,
     XCircle,
   } from 'lucide-react';
   import { getBackendImageUrl } from '../../../utils/backend-image';

   const UserDetailModal = ({ isOpen, onClose, user }) => {
     if (!isOpen || !user) return null;

     const userImageUrl = user.filepath ? getBackendImageUrl(user.filepath) : null;

     const getStatusIcon = (status) => {
       switch (status) {
         case 'pending':
           return <Clock className="w-5 h-5 text-amber-500" />;
         case 'approved':
           return <CheckCircle className="w-5 h-5 text-emerald-500" />;
         case 'declined':
           return <XCircle className="w-5 h-5 text-red-500" />;
         default:
           return <Clock className="w-5 h-5 text-gray-500" />;
       }
     };

     const getStatusColor = (status) => {
       switch (status) {
         case 'pending':
           return 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-800 border-amber-200';
         case 'approved':
           return 'bg-gradient-to-r from-emerald-50 to-blood-50 text-emerald-800 border-emerald-200';
         case 'declined':
           return 'bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border-red-200';
         default:
           return 'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-800 border-gray-200';
       }
     };

     return (
       <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
         <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-100 relative">
           {/* Background decoration */}
           <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blood-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
           <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-blood-400/20 to-cyan-400/20 rounded-full blur-2xl"></div>

           {/* Header */}
           <div className="relative z-10 bg-gradient-to-r from-blood-600 to-blood-700 px-8 py-6">
             <div className="flex items-center justify-between">
               <div className="flex items-center space-x-4">
                 <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm">
                   <User className="w-8 h-8 text-white" />
                 </div>
                 <div>
                   <h2 className="text-2xl font-bold text-white">Patient Details</h2>
                   <p className="text-blood-100">Complete medical profile and request information</p>
                 </div>
               </div>
               <button
                 onClick={onClose}
                 className="p-2 hover:bg-white/20 rounded-xl transition-colors"
               >
                 <X className="w-6 h-6 text-white" />
               </button>
             </div>
           </div>

           {/* Content */}
           <div className="relative z-10 p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               {/* Left Column - Profile Image & Basic Info */}
               <div className="lg:col-span-1">
                 <div className="bg-gradient-to-br from-gray-50 to-blood-50 rounded-2xl p-6 border border-gray-200">
                   {/* Profile Image */}
                   <div className="text-center mb-6">
                     {userImageUrl ? (
                       <div className="relative inline-block">
                         <img
                           src={userImageUrl}
                           alt={user.name}
                           className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-lg mx-auto"
                           onError={(e) => {
                             e.target.style.display = 'none';
                             e.target.nextSibling.style.display = 'flex';
                           }}
                         />
                         <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center mx-auto hidden">
                           <ImageIcon className="h-12 w-12 text-gray-400" />
                         </div>
                         <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blood-500 rounded-full border-3 border-white flex items-center justify-center">
                           <Camera className="w-4 h-4 text-white" />
                         </div>
                       </div>
                     ) : (
                       <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center mx-auto">
                         <User className="h-16 w-16 text-gray-400" />
                       </div>
                     )}
                   </div>

                   {/* Basic Info */}
                   <div className="space-y-4">
                     <div className="text-center">
                       <h3 className="text-xl font-bold text-gray-900 mb-1">{user.name}</h3>
                       <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blood-100 text-blood-800">
                         Patient ID: {user._id.slice(-6)}
                       </span>
                     </div>

                     <div className="space-y-3">
                       <div className="flex items-center space-x-3 p-3 bg-white rounded-xl border border-gray-100">
                         <Phone className="h-5 w-5 text-blood-500" />
                         <div>
                           <p className="text-sm font-medium text-gray-700">Contact</p>
                           <p className="text-sm text-gray-600">{user.contact || 'Not provided'}</p>
                         </div>
                       </div>

                       <div className="flex items-center space-x-3 p-3 bg-white rounded-xl border border-gray-100">
                         <Mail className="h-5 w-5 text-blood-500" />
                         <div>
                           <p className="text-sm font-medium text-gray-700">Email</p>
                           <p className="text-sm text-gray-600">{user.email || 'Not provided'}</p>
                         </div>
                       </div>

                       {user.address && (
                         <div className="flex items-center space-x-3 p-3 bg-white rounded-xl border border-gray-100">
                           <MapPin className="h-5 w-5 text-red-500" />
                           <div>
                             <p className="text-sm font-medium text-gray-700">Address</p>
                             <p className="text-sm text-gray-600">{user.address}</p>
                           </div>
                         </div>
                       )}

                       {user.createdAt && (
                         <div className="flex items-center space-x-3 p-3 bg-white rounded-xl border border-gray-100">
                           <Calendar className="h-5 w-5 text-purple-500" />
                           <div>
                             <p className="text-sm font-medium text-gray-700">Registered</p>
                             <p className="text-sm text-gray-600">
                               {new Date(user.createdAt).toLocaleDateString('en-US', {
                                 year: 'numeric',
                                 month: 'long',
                                 day: 'numeric'
                               })}
                             </p>
                           </div>
                         </div>
                       )}
                     </div>
                   </div>
                 </div>
               </div>

               {/* Right Column - Detailed Information */}
               <div className="lg:col-span-2 space-y-6">
                 {/* Medical Information */}
                 <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-2xl p-6 border border-red-100">
                   <div className="flex items-center space-x-3 mb-4">
                     <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                       <Heart className="w-6 h-6 text-red-600" />
                     </div>
                     <div>
                       <h4 className="text-lg font-bold text-red-800">Medical Condition</h4>
                       <p className="text-sm text-red-600">Primary health concern</p>
                     </div>
                   </div>
                   <div className="bg-white/50 rounded-xl p-4 border border-red-200">
                     <div className="flex items-start space-x-3">
                       <Activity className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                       <div>
                         <p className="font-semibold text-red-800 mb-2">{user.disease || 'Not specified'}</p>
                         {user.diseaseDescription && (
                           <p className="text-sm text-red-700 leading-relaxed">{user.diseaseDescription}</p>
                         )}
                       </div>
                     </div>
                   </div>
                 </div>

                 {/* Description */}
                 {user.description && (
                   <div className="bg-gradient-to-r from-blood-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                     <div className="flex items-center space-x-3 mb-4">
                       <div className="w-12 h-12 bg-blood-100 rounded-xl flex items-center justify-center">
                         <FileText className="w-6 h-6 text-blood-600" />
                       </div>
                       <div>
                         <h4 className="text-lg font-bold text-blood-800">Patient Description</h4>
                         <p className="text-sm text-blood-600">Additional information provided</p>
                       </div>
                     </div>
                     <div className="bg-white/50 rounded-xl p-4 border border-blue-200">
                       <p className="text-sm text-blood-800 leading-relaxed">{user.description}</p>
                     </div>
                   </div>
                 )}

                 {/* Request Information */}
                 <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-100">
                   <div className="flex items-center space-x-3 mb-4">
                     <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                       <FileText className="w-6 h-6 text-teal-600" />
                     </div>
                     <div>
                       <h4 className="text-lg font-bold text-teal-800">Request Information</h4>
                       <p className="text-sm text-teal-600">Details of submitted requests</p>
                     </div>
                   </div>
                   {(!user.requests || user.requests.length === 0) ? (
                     <div className="bg-white/50 rounded-xl p-4 border border-teal-200 text-center text-gray-600">
                       No requests available for this user.
                     </div>
                   ) : (
                     <div className="space-y-4">
                       {user.requests.map((request, index) => {
                         const isAmountModified =
                           request.status === 'approved' &&
                           request.originalAmount != null &&
                           request.originalAmount !== request.neededAmount;

                         return (
                           <div key={request._id} className="bg-white/50 rounded-xl p-4 border border-teal-200">
                             <div className="flex items-start justify-between mb-4">
                               <div className="flex items-start space-x-3">
                                 <div className="relative">
                                   {getStatusIcon(request.status)}
                                   <div className="absolute -inset-1 bg-gradient-to-r from-blood-600 to-purple-600 rounded-full opacity-20 blur-sm"></div>
                                 </div>
                                 <div>
                                   <p className="font-semibold text-teal-800 mb-2">{request.description || 'No description'}</p>
                                   <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                                     <div className="flex items-center space-x-2 bg-gray-50 rounded-full px-3 py-1">
                                       <Calendar className="w-4 h-4" />
                                       <span>{new Date(request.createdAt).toLocaleDateString() || 'N/A'}</span>
                                     </div>
                                     {isAmountModified ? (
                                       <div className="flex items-center space-x-3 bg-gradient-to-r from-blood-50 to-blood-100 rounded-full px-3 py-1">
                                         <DollarSign className="w-4 h-4 text-gray-500" />
                                         <span className="text-red-500 line-through text-sm">
                                           ${Number.parseFloat(request.originalAmount).toLocaleString() || '0'}
                                         </span>
                                         <span className="font-bold text-blood-600">
                                           ${Number.parseFloat(request.neededAmount).toLocaleString() || '0'}
                                         </span>
                                       </div>
                                     ) : (
                                       <div className="flex items-center space-x-2 bg-blood-50 rounded-full px-3 py-1">
                                         <DollarSign className="w-4 h-4" />
                                         <span className="font-semibold">
                                           ${Number.parseFloat(request.neededAmount).toLocaleString() || '0'}
                                         </span>
                                       </div>
                                     )}
                                     <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(request.status)}`}>
                                       {request.status ? request.status.charAt(0).toUpperCase() + request.status.slice(1) : 'Unknown'}
                                     </span>
                                   </div>
                                 </div>
                               </div>
                             </div>

                             {/* Request Details */}
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                               <div className="bg-gray-50 rounded-xl p-3">
                                 <p className="text-sm font-semibold text-gray-700 mb-1">Medical Condition</p>
                                 <p className="text-sm text-gray-600">{request.condition || 'Not specified'}</p>
                               </div>
                               <div className="bg-gray-50 rounded-xl p-3">
                                 <p className="text-sm font-semibold text-gray-700 mb-1">Citizenship Status</p>
                                 <p className="text-sm text-gray-600 capitalize">{request.citizen?.replace('_', ' ') || 'Not specified'}</p>
                               </div>
                             </div>

                             {request.inDepthStory && (
                               <div className="bg-gray-50 rounded-xl p-3 mb-4">
                                 <p className="text-sm font-semibold text-gray-700 mb-1">Patient Story</p>
                                 <p className="text-sm text-gray-600">{request.inDepthStory}</p>
                               </div>
                             )}

                             {/* Attached Document/Image */}
                             {(request.filename || request.filepath) && (
                               <div className="flex items-center space-x-3 bg-blood-50 rounded-xl p-3 mb-4">
                                 <div className="w-8 h-8 bg-blood-100 rounded-xl flex items-center justify-center">
                                   <ImageIcon className="w-5 h-5 text-blood-600" />
                                 </div>
                                 <div>
                                   <p className="text-sm font-medium text-blood-800">Attached File</p>
                                   <p className="text-sm text-blood-600">{request.filename || 'Unnamed file'}</p>
                                   {request.filepath && (
                                     <a
                                       href={getBackendImageUrl(request.filepath)}
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       className="text-sm text-blood-500 hover:underline"
                                     >
                                       View File
                                     </a>
                                   )}
                                 </div>
                               </div>
                             )}

                             {/* Admin Feedback */}
                             {request.feedback && (
                               <div className="bg-gradient-to-r from-indigo-50 to-blood-50 rounded-xl p-3 border-l-4 border-indigo-400">
                                 <div className="flex items-start space-x-3">
                                   <div className="w-8 h-8 bg-blood-100 rounded-xl flex items-center justify-center">
                                     <Shield className="w-5 h-5 text-blood-600" />
                                   </div>
                                   <div>
                                     <p className="text-sm font-semibold text-indigo-800 mb-1">Admin Feedback</p>
                                     <p className="text-sm text-blood-700">{request.feedback}</p>
                                   </div>
                                 </div>
                               </div>
                             )}
                           </div>
                         );
                       })}
                     </div>
                   )}
                 </div>

                 {/* Additional Information */}
                 <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100">
                   <div className="flex items-center space-x-3 mb-4">
                     <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                       <Shield className="w-6 h-6 text-purple-600" />
                     </div>
                     <div>
                       <h4 className="text-lg font-bold text-purple-800">Account Information</h4>
                       <p className="text-sm text-purple-600">System and profile details</p>
                     </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="bg-white/50 rounded-xl p-4 border border-purple-200">
                       <div className="flex items-center space-x-2 mb-2">
                         <Shield className="h-4 w-4 text-purple-500" />
                         <p className="text-sm font-semibold text-purple-800">Account Status</p>
                       </div>
                       <p className="text-xs text-purple-700">
                         {user.isActive ? 'Active' : 'Inactive'} • {user.role || 'Patient'}
                       </p>
                     </div>
                     <div className="bg-white/50 rounded-xl p-4 border border-purple-200">
                       <div className="flex items-center space-x-2 mb-2">
                         <Calendar className="h-4 w-4 text-purple-500" />
                         <p className="text-sm font-semibold text-purple-800">Last Updated</p>
                       </div>
                       <p className="text-xs text-purple-700">
                         {user.updatedAt 
                           ? new Date(user.updatedAt).toLocaleDateString()
                           : 'Not available'
                         }
                       </p>
                     </div>
                   </div>
                 </div>

                 {/* Emergency Information */}
                 {(user.emergencyContact || user.bloodType || user.allergies) && (
                   <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-100">
                     <div className="flex items-center space-x-3 mb-4">
                       <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                         <AlertCircle className="w-6 h-6 text-yellow-600" />
                       </div>
                       <div>
                         <h4 className="text-lg font-bold text-yellow-800">Emergency Information</h4>
                         <p className="text-sm text-yellow-600">Critical medical details</p>
                       </div>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       {user.emergencyContact && (
                         <div className="bg-white/50 rounded-xl p-4 border border-yellow-200">
                           <p className="text-sm font-semibold text-yellow-800 mb-1">Emergency Contact</p>
                           <p className="text-xs text-yellow-700">{user.emergencyContact}</p>
                         </div>
                       )}
                       {user.bloodType && (
                         <div className="bg-white/50 rounded-xl p-4 border border-yellow-200">
                           <p className="text-sm font-semibold text-yellow-800 mb-1">Blood Type</p>
                           <p className="text-xs text-yellow-700">{user.bloodType}</p>
                         </div>
                       )}
                       {user.allergies && (
                         <div className="bg-white/50 rounded-xl p-4 border border-yellow-200">
                           <p className="text-sm font-semibold text-yellow-800 mb-1">Allergies</p>
                           <p className="text-xs text-yellow-700">{user.allergies}</p>
                         </div>
                       )}
                     </div>
                   </div>
                 )}
               </div>
             </div>

             {/* Footer Actions */}
             <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200 mt-8">
               <button
                 onClick={onClose}
                 className="px-8 py-3 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 font-semibold transition-all duration-300"
               >
                 Close
               </button>
             </div>
           </div>
         </div>
       </div>
     );
   };

   export default UserDetailModal;

