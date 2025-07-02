'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart2, ShoppingCart, FileText, LogOut, LayoutDashboard } from 'lucide-react';

const links = [
  { href: '/manager/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
  { href: '/manager/sales', icon: <ShoppingCart size={20} />, label: 'Sales' },
  { href: '/manager/purchases', icon: <FileText size={20} />, label: 'Purchases' },
  { href: '/manager/reports', icon: <BarChart2 size={20} />, label: 'Reports' },
  { href: '/logout', icon: <LogOut size={20} />, label: 'Logout' },
];

export default function ManagerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-gray-800 text-white shadow-lg z-50">
      <div className="p-6 text-xl font-bold border-b border-gray-700">🧑‍💼 Manager Panel</div>
      <nav className="mt-6">
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`flex items-center gap-3 px-6 py-3 hover:bg-gray-700 transition ${
                  pathname === link.href ? 'bg-gray-700 font-semibold' : ''
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
