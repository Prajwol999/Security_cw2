import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthProvider';
import Homepage from '../pages/Homepage';

/**
 * HomeRoute - Smart homepage that redirects authenticated users to their dashboard
 */
export function HomeRoute() {
    const { isAuthenticated, loading, user } = useContext(AuthContext);

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

    // Show public homepage for non-authenticated users
    return <Homepage />;
}
