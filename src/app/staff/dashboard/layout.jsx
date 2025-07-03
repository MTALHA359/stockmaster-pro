'use client';

import StaffSidebar from '../components/StaffSidebar';

export default function StaffLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <StaffSidebar />
      <main className="ml-64 w-full p-6">{children}</main>
    </div>
  );
}
