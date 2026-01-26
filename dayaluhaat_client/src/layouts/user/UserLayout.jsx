// src/layouts/user/UserLayout.jsx

import { Outlet } from "react-router-dom";
import UserSidebar from "./UserSidebar"; // Assuming it's in the same directory

export default function UserLayout() {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* The persistent sidebar */}
      <UserSidebar />

      {/* The main content area where child routes will be rendered */}
      <main className="flex-1 p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}

