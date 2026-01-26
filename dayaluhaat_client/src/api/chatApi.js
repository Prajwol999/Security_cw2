// services/chatApi.js

import axios from './api'; // Your configured axios instance

export const fetchChatHistory = async (otherUserId) => {
    try {
        const { data } = await axios.get(`/chat/history/${otherUserId}`);
        return data.messages;
    } catch (error) {
        console.error("chatApi: Error fetching chat history:", error.response?.data || error.message);
        throw error;
    }
};

export const fetchConversations = async () => {
    try {
        const { data } = await axios.get('/chat/conversations');
        return data.conversations;
    } catch (error) {
        console.error("chatApi: Error fetching conversation list:", error.response?.data || error.message);
        throw error;
    }
};

// --- NEW FUNCTION FOR FILE UPLOADS ---
/**
 * Uploads a file to the server for chat attachments.
 * @param {File} file The file object to upload.
 * @returns {Promise<{fileUrl: string, fileName: string, messageType: string}>} The URL, name, and type of the uploaded file.
 */
export const uploadChatFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file); // 'file' must match the key in your multer config

    try {
        // NOTE: The endpoint is '/api/chat/upload' as defined in the backend modifications.
        // Ensure your axios instance base URL is correct (e.g., http://localhost:5050).
        const { data } = await axios.post('/chat/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return data; // This will return { success, message, fileUrl, fileName, messageType }
    } catch (error) {
        console.error("chatApi: Error uploading file:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'File upload failed');
    }
};