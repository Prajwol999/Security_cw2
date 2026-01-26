/**
 * Custom Toast Configuration
 * Provides styled toast notifications matching the blood donation theme
 */

import toast from 'react-hot-toast';

// Custom toast styles matching the blood donation theme
export const toastConfig = {
    // Success toast
    success: (message) => {
        return toast.success(message, {
            duration: 4000,
            position: 'top-right',
            style: {
                background: '#FEE2E2',
                color: '#7F1D1D',
                padding: '16px 20px',
                borderRadius: '12px',
                border: '2px solid #E31E24',
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: '0 10px 25px rgba(227, 30, 36, 0.15)',
            },
            icon: '✅',
            iconTheme: {
                primary: '#E31E24',
                secondary: '#FFFFFF',
            },
        });
    },

    // Error toast
    error: (message) => {
        return toast.error(message, {
            duration: 5000,
            position: 'top-right',
            style: {
                background: '#FEE2E2',
                color: '#7F1D1D',
                padding: '16px 20px',
                borderRadius: '12px',
                border: '2px solid #DC2626',
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: '0 10px 25px rgba(220, 38, 38, 0.15)',
            },
            icon: '❌',
            iconTheme: {
                primary: '#DC2626',
                secondary: '#FFFFFF',
            },
        });
    },

    // Warning toast
    warning: (message) => {
        return toast(message, {
            duration: 4000,
            position: 'top-right',
            style: {
                background: '#FEF3C7',
                color: '#78350F',
                padding: '16px 20px',
                borderRadius: '12px',
                border: '2px solid #F59E0B',
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: '0 10px 25px rgba(245, 158, 11, 0.15)',
            },
            icon: '⚠️',
        });
    },

    // Info toast
    info: (message) => {
        return toast(message, {
            duration: 4000,
            position: 'top-right',
            style: {
                background: '#DBEAFE',
                color: '#1E3A8A',
                padding: '16px 20px',
                borderRadius: '12px',
                border: '2px solid #3B82F6',
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: '0 10px 25px rgba(59, 130, 246, 0.15)',
            },
            icon: 'ℹ️',
        });
    },

    // Loading toast
    loading: (message) => {
        return toast.loading(message, {
            position: 'top-right',
            style: {
                background: '#F3F4F6',
                color: '#1F2937',
                padding: '16px 20px',
                borderRadius: '12px',
                border: '2px solid #9CA3AF',
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: '0 10px 25px rgba(156, 163, 175, 0.15)',
            },
        });
    },

    // Promise toast (for async operations)
    promise: (promise, messages) => {
        return toast.promise(
            promise,
            {
                loading: messages.loading || 'Loading...',
                success: messages.success || 'Success!',
                error: messages.error || 'Error occurred',
            },
            {
                position: 'top-right',
                style: {
                    padding: '16px 20px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '500',
                },
                success: {
                    duration: 4000,
                    style: {
                        background: '#FEE2E2',
                        color: '#7F1D1D',
                        border: '2px solid #E31E24',
                    },
                    iconTheme: {
                        primary: '#E31E24',
                        secondary: '#FFFFFF',
                    },
                },
                error: {
                    duration: 5000,
                    style: {
                        background: '#FEE2E2',
                        color: '#7F1D1D',
                        border: '2px solid #DC2626',
                    },
                },
            }
        );
    },

    // Custom toast with custom styling
    custom: (message, options = {}) => {
        return toast(message, {
            duration: 4000,
            position: 'top-right',
            style: {
                background: '#FFFFFF',
                color: '#1F2937',
                padding: '16px 20px',
                borderRadius: '12px',
                border: '2px solid #E5E7EB',
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                ...options.style,
            },
            ...options,
        });
    },
};

// Export individual toast functions for convenience
export const showSuccess = toastConfig.success;
export const showError = toastConfig.error;
export const showWarning = toastConfig.warning;
export const showInfo = toastConfig.info;
export const showLoading = toastConfig.loading;
export const showPromise = toastConfig.promise;
export const showCustom = toastConfig.custom;

export default toastConfig;
