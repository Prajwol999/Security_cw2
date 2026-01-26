import { useContext } from 'react';
import { AuthContext } from '../auth/AuthProvider'; // Adjust path if AuthProvider is elsewhere

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthContextProvider');
    }
    return context;
};