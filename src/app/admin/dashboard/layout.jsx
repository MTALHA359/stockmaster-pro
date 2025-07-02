// src/app/dashboard/layout.jsx
'use client';

import AdminSidebar from "../components/AdminSidebar";


export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar/>
      <main className="ml-64 w-full p-6">
        {children}
      </main>
    </div>
  );
}
