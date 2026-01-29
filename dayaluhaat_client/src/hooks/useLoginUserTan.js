import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { AuthContext } from "../auth/AuthProvider";
import { adminLogin } from "../api/admin/authApi";
import { loginUserService } from "../services/authUserServices";

/**
 * A combined login function that attempts admin login first, then user login.
 * This will be the `mutationFn` for our TanStack Query hook.
 * @param {{ email, password }} credentials - The user's login credentials.
 * @returns {Promise<object>} - The successful response data, augmented with a 'role'.
 */
const loginAttempt = async (credentials) => {
  try {
    // 1. Attempt Admin Login
    // Admin login expects { username, password }
    const adminRes = await adminLogin({
      username: credentials.email,
      password: credentials.password
    });
    return { ...adminRes.data, role: 'admin' };
  } catch (adminError) {
    console.log("Admin login failed, trying user login.");
    // 2. If admin fails, attempt User Login
    try {
      // Pass full credentials (including email, password, and g-recaptcha-response)
      const userRes = await loginUserService(credentials);

      return { ...userRes, role: userRes.user?.role || 'user' };
    } catch (userError) {
      throw userError.response?.data || userError;
    }
  }
};

/**
 * Custom hook to handle the entire login flow (admin and user).
 * Manages API calls, state (loading, error), toasts, and navigation.
 */
export const useLogin = () => {
  const { login: authContextLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginAttempt,
    onSuccess: (data) => {
      // 2FA Interception
      if (data.require2FA) {
        toast.success("Verification code sent to email!");
        return; // Stop here, let the component handle the rest
      }

      // This runs only after a successful login (either admin or user)
      toast.success(data.message || "Login successful!");

      // Now `data` will correctly contain user and token for both roles.
      console.log("Data on successful login:", data);
      authContextLogin(data.user, data.token);

      // Navigate to the correct dashboard based on the role
      if (data.role === 'admin') {
        navigate("/admin/");
      } else {
        navigate("/user/dashboard");
      }
    },
    onError: (error) => {
      // This runs only if both login attempts have failed
      toast.error(error.message || "Login failed. Please check credentials.");
    },
  });
};