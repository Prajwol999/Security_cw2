// src/AppRouter.jsx

import { Route, Routes, Navigate } from "react-router-dom";
import { GuestRoute, ProtectedRoute, RoleBasedRoute } from "./RouteGuards";
import ResetPasswordPage from '../pages/ResetPasswordPage.jsx';
import ForgotPasswordPage from '../pages/ForgotPasswordPage.jsx';
import { HomeRoute } from './HomeRoute.jsx';

// Import Layouts
import UserLayout from "../layouts/user/UserLayout";
import AdminMainLayout from "../layouts/admin/adminMainLayout";

// Import Pages & Components
import { LoginPage } from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import DonationPage from "../pages/DonationPage";
import DonationSuccessPage from "../pages/DonationSuccessPage";
import DonationFailurePage from "../pages/DonationFailurePage";
import NotificationsPage from "../pages/user/NotificationsPage";

// User Components
import UserDashboard from "../components/user/UserDashboard";
import MyRequest from "../components/user/MyRequest";
import UserMessage from "../components/user/UserMessage";
import MentalHealth from "../components/user/MentalHealth";
import SettingsPage from "../components/user/SettingsPage";
import NotFoundPage from "../components/notFoundPage";

// Admin Pages
import AdminDashboardManagement from "../pages/admin/AdminDashboardManagement";
import UserManagement from "../pages/admin/UserManagement";
import RequestManagement from "../pages/admin/RequestManagement";
import MessageAdmin from "../pages/admin/MessageAdmin";
import DonationsManagement from "../pages/admin/DonationsManagement";

const AppRouter = () => (
  <Routes>
    {/* --- Homepage (Smart redirect for authenticated users) --- */}
    <Route path="/" element={<HomeRoute />} />

    {/* --- Auth Routes (Guest Only - redirects if already logged in) --- */}
    <Route
      path="/login"
      element={
        <GuestRoute>
          <LoginPage />
        </GuestRoute>
      }
    />
    <Route
      path="/signup"
      element={
        <GuestRoute>
          <SignupPage />
        </GuestRoute>
      }
    />
    <Route
      path="/forgot-password"
      element={
        <GuestRoute>
          <ForgotPasswordPage />
        </GuestRoute>
      }
    />
    <Route
      path="/reset-password/:token"
      element={
        <GuestRoute>
          <ResetPasswordPage />
        </GuestRoute>
      }
    />

    {/* --- Donation Routes (Public) --- */}
    <Route path="/donate/:campaignId" element={<DonationPage />} />
    <Route path="/donation/success" element={<DonationSuccessPage />} />
    <Route path="/donation/failure" element={<DonationFailurePage />} />

    {/* --- User Routes (Protected - requires authentication) --- */}
    <Route
      path="/user"
      element={
        <ProtectedRoute>
          <UserLayout />
        </ProtectedRoute>
      }
    >
      <Route path="dashboard" element={<UserDashboard />} />
      <Route path="requests" element={<MyRequest />} />
      <Route path="notifications" element={<NotificationsPage />} />
      <Route path="message" element={<UserMessage />} />
      <Route path="mental-health" element={<MentalHealth />} />
      <Route path="settings" element={<SettingsPage />} />
    </Route>

    {/* --- Admin Routes (Role-Based - requires admin role) --- */}
    <Route
      path="/admin"
      element={
        <RoleBasedRoute requiredRole="admin">
          <AdminMainLayout />
        </RoleBasedRoute>
      }
    >
      <Route index element={<AdminDashboardManagement />} />
      <Route path="user" element={<UserManagement />} />
      <Route path="request" element={<RequestManagement />} />
      <Route path="message" element={<MessageAdmin />} />
      <Route path="donations" element={<DonationsManagement />} />
    </Route>

    {/* --- Fallback Route for 404 --- */}
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default AppRouter;
