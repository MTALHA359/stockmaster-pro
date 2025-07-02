// src/app/Admin/component/AdminSidebar.jsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Products', href: '/admin/products' },
    { label: 'Purchases', href: '/admin/purchases' },
    { label: 'Sales', href: '/admin/sales' },
    { label: 'Reports', href: '/admin/reports' },
    { label: 'Users', href: '/admin/users' },
    { label: 'Settings', href: '/admin/settings' },
  ];

  return (
    <aside className="fixed h-screen w-64 bg-gray-900 text-white p-4">
      <h2 className="text-2xl font-bold mb-6">🛠 Admin Panel</h2>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-4 py-2 rounded hover:bg-gray-700 transition ${
              pathname === item.href ? 'bg-gray-700 font-semibold' : ''
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
