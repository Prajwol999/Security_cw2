import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Camera, Upload } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { validateFile } from '../../utils/fileValidation';

import { User, Mail, Phone, Lock, Heart, FileText, Droplet, CheckCircle, ArrowLeft, ArrowRight, Sparkles, Eye, EyeOff } from 'lucide-react';
import PasswordStrengthMeter from '../auth/PasswordStrengthMeter'; // Import Strength Meter
const ToggleSwitch = ({ enabled, setEnabled }) => (
    <button
        onClick={() => setEnabled(!enabled)}
        className={`${enabled ? 'bg-black' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
    >
        <span className={`${enabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
    </button>
);

export default function SettingsPage() {
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        contact: '',
        disease: '',
        description: '',
    });
    const [password, setPassword] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [profilePicture, setProfilePicture] = useState(null);
    const [profilePicturePreview, setProfilePicturePreview] = useState(null);
    const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // ✅ FIX: Changed the base URL to match your index.js setup
    const API_URL = 'http://localhost:5050/api/auth';

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage({ type: 'error', text: 'Not authenticated.' });
                return;
            }
            try {
                // This will now correctly call '/api/auth/me'
                const res = await axios.get(`${API_URL}/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProfile(res.data.data);
                setIsTwoFactorEnabled(res.data.data.isTwoFactorEnabled);
            } catch (error) {
                console.error('Failed to fetch user data', error);
                setMessage({ type: 'error', text: 'Failed to load profile.' });
            }
        };
        fetchUserData();
    }, []);

    const handleProfileChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPassword({ ...password, [e.target.name]: e.target.value });
    };

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        // Validate file with security checks
        const validation = validateFile(file, 'profile');
        if (!validation.valid) {
            toast.error(validation.error);
            e.target.value = ''; // Clear input
            return;
        }

        // File is valid, set preview
        setProfilePicture(file);
        setProfilePicturePreview(URL.createObjectURL(file));
        toast.success('Profile picture selected successfully!');
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            const formData = new FormData();
            formData.append('name', profile.name);
            formData.append('email', profile.email);
            formData.append('contact', profile.contact);
            formData.append('disease', profile.disease);
            formData.append('description', profile.description);

            if (profilePicture) {
                formData.append('profilePicture', profilePicture);
            }

            const res = await axios.put(`${API_URL}/me`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
            });
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            toast.success('Profile updated successfully!');
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile.' });
            toast.error(error.response?.data?.message || 'Failed to update profile.');
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (password.newPassword !== password.confirmNewPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match.' });
            return;
        }
        const token = localStorage.getItem('token');
        try {
            // This will now correctly call '/api/auth/changepassword'
            const res = await axios.put(`${API_URL}/changepassword`, {
                currentPassword: password.currentPassword,
                newPassword: password.newPassword,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessage({ type: 'success', text: 'Password changed successfully!' });
            setPassword({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to change password.' });
        }
    };

    const handleToggle2FA = async (enabled) => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.put(`${API_URL}/toggle-2fa`, { enable: enabled }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsTwoFactorEnabled(enabled);
            toast.success(res.data.message);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update 2FA settings");
            setIsTwoFactorEnabled(!enabled); // Revert UI on error
        }
    };

    return (
        <div className="bg-gray-50 p-8 font-sans">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>
            {message.text && (
                <div className={`p-4 mb-4 rounded-md text-white ${message.type === 'success' ? 'bg-blood-500' : 'bg-red-500'}`}>
                    {message.text}
                </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Edit Profile Form */}
                <form onSubmit={handleProfileSubmit} className="space-y-4 p-6 bg-white border border-gray-200 rounded-lg">
                    <h2 className="text-lg font-semibold text-gray-700">Edit Profile</h2>

                    {/* Profile Picture Upload */}
                    <div className="flex flex-col items-center space-y-4 pb-6 border-b border-gray-200">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
                                {profilePicturePreview ? (
                                    <img
                                        src={profilePicturePreview}
                                        alt="Profile Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : profile.photoUrl ? (
                                    <img
                                        src={`http://localhost:5050${profile.photoUrl}`}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blood-100 to-blood-200">
                                        <Camera className="w-12 h-12 text-blood-400" />
                                    </div>
                                )}
                            </div>
                            <label
                                htmlFor="profile-picture-upload"
                                className="absolute bottom-0 right-0 w-10 h-10 bg-blood-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blood-600 transition-colors shadow-lg border-2 border-white"
                            >
                                <Upload className="w-5 h-5 text-white" />
                            </label>
                            <input
                                type="file"
                                id="profile-picture-upload"
                                accept=".png,.jpg,.jpeg"
                                onChange={handleProfilePictureChange}
                                className="hidden"
                            />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium text-gray-700">Profile Picture</p>
                            <p className="text-xs text-gray-500">PNG, JPG or JPEG (Max 5MB)</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600">Name</label>
                        <input type="text" name="name" value={profile.name} onChange={handleProfileChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Email</label>
                        <input type="email" name="email" value={profile.email} disabled className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-100" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Phone Number</label>
                        <input type="text" name="contact" value={profile.contact} onChange={handleProfileChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Disease</label>
                        <input type="text" name="disease" value={profile.disease} onChange={handleProfileChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Description</label>
                        <textarea name="description" value={profile.description} onChange={handleProfileChange} rows="3" className="mt-1 block w-full border border-gray-300 rounded-md p-2"></textarea>
                    </div>
                    <button type="submit" className="px-4 py-2 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-75">
                        Save Changes
                    </button>
                </form>

                {/* Security Settings Column */}
                <div className="space-y-8">
                    {/* Change Password Form */}
                    <form onSubmit={handlePasswordSubmit} className="space-y-4 p-6 bg-white border border-gray-200 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-700">Change Password</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Current Password</label>
                            <div className="relative">
                                <input
                                    type={showCurrentPassword ? "text" : "password"}
                                    name="currentPassword"
                                    value={password.currentPassword}
                                    onChange={handlePasswordChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 mt-1"
                                >
                                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">New Password</label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    name="newPassword"
                                    value={password.newPassword}
                                    onChange={handlePasswordChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 mt-1"
                                >
                                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {/* Password Strength Meter */}
                            {password.newPassword && (
                                <div className="mt-2">
                                    <PasswordStrengthMeter password={password.newPassword} />
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Confirm New Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmNewPassword"
                                    value={password.confirmNewPassword}
                                    onChange={handlePasswordChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 mt-1"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                        <button type="submit" className="px-4 py-2 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-75">
                            Update Password
                        </button>
                    </form>

                    {/* Two-Factor Authentication */}
                    <div className="p-6 bg-white border border-gray-200 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">Two-Factor Authentication</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <p className="text-gray-600">Enable Two-factor authentication (Email OTP)</p>
                                <ToggleSwitch
                                    enabled={isTwoFactorEnabled}
                                    setEnabled={handleToggle2FA}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-gray-600">Add another e-mail for verification</p>
                                <button className="text-sm font-semibold text-gray-600 border border-gray-300 px-3 py-1 rounded-md hover:bg-gray-100">Setup</button>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-gray-600">Add your phone number for SMS Recovery</p>
                                <button className="text-sm font-semibold text-gray-600 border border-gray-300 px-3 py-1 rounded-md hover:bg-gray-100">Setup</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

