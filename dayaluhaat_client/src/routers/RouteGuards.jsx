import { Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../auth/AuthProvider';

/**
 * GuestRoute - Prevents authenticated users from accessing auth pages
 * Redirects logged-in users to their appropriate dashboard
 */
export function GuestRoute({ children }) {
    const { isAuthenticated, loading, user } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blood-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (isAuthenticated) {
        // Redirect to appropriate dashboard based on user role
        const redirectTo = user?.role === 'admin' ? '/admin' : '/user/dashboard';
        return <Navigate to={redirectTo} replace />;
    }

    return children;
}

/**
 * ProtectedRoute - Requires authentication
 * Redirects unauthenticated users to login page
 */
export function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blood-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Save attempted URL for redirect after login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}

/**
 * RoleBasedRoute - Requires specific role (e.g., admin)
 * Redirects users without the required role to their dashboard
 */
export function RoleBasedRoute({ children, requiredRole }) {
    const { isAuthenticated, loading, user } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blood-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Not logged in - redirect to login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (user?.role !== requiredRole) {
        // Wrong role - redirect to appropriate dashboard
        const redirectTo = user?.role === 'admin' ? '/admin' : '/user/dashboard';
        return <Navigate to={redirectTo} replace />;
    }

    return children;
}
