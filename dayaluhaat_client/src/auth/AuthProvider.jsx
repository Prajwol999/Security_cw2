import React, { createContext, useState, useEffect, useCallback } from "react";

export const AuthContext = createContext(null);

const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = useCallback((userData, receivedToken) => {
        console.log("AUTH_CONTEXT: [Login Call] - Storing session in localStorage.");

        // Store in localStorage
        localStorage.setItem("token", receivedToken);
        localStorage.setItem("user", JSON.stringify(userData));

        // Update state
        setToken(receivedToken);
        setUser(userData);
    }, []);

    const logout = useCallback(() => {
        console.log("AUTH_CONTEXT: [Logout Call] - Clearing session from localStorage.");

        // Clear localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Clear state
        setToken(null);
        setUser(null);
    }, []);

    // This effect runs ONLY ONCE when the app first mounts.
    useEffect(() => {
        console.log("AUTH_CONTEXT: [useEffect Initializer] - Checking session in localStorage ONCE.");
        setLoading(true);
        try {
            const storedToken = localStorage.getItem("token");
            const storedUser = localStorage.getItem("user");

            if (storedToken && storedUser && storedUser !== "null") {
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
            }
        } catch (error) {
            console.error("AUTH_CONTEXT: Error parsing stored user. Logging out.", error);
            logout(); // Call logout to ensure a clean state if storage is corrupt
        } finally {
            setLoading(false);
        }
    // The empty dependency array [] is CRITICAL. It ensures this runs only once.
    }, []);

    const contextValue = { user, token, loading, login, logout, isAuthenticated: !!token };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;

