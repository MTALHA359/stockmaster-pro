'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, LayoutDashboard, ShoppingCart } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/staff/dashboard', icon: <LayoutDashboard size={20} /> },
  { name: 'Sales', href: '/staff/sales', icon: <ShoppingCart size={20} /> },
];

export default function StaffSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white shadow border-r z-50">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-gray-800">Staff Panel</h1>
      </div>
      <nav className="flex flex-col p-4 gap-4">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-2 rounded text-sm font-medium ${
              pathname === item.href
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
        <button
          onClick={() => {
            // You can integrate NextAuth logout or any logic
            window.location.href = '/api/auth/signout';
          }}
          className="flex items-center gap-3 px-4 py-2 mt-auto text-sm text-red-500 hover:bg-red-50 rounded"
        >
          <LogOut size={20} />
          Logout
        </button>
      </nav>
    </aside>
  );
}
