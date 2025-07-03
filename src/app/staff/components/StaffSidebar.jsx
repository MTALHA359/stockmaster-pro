// 'use client';

// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { LogOut, LayoutDashboard, ShoppingCart } from 'lucide-react';

// const navItems = [
//   { name: 'Dashboard', href: '/staff/dashboard', icon: <LayoutDashboard size={20} /> },
//   { name: 'Sales', href: '/staff/sales', icon: <ShoppingCart size={20} /> },
// ];

// export default function StaffSidebar() {
//   const pathname = usePathname();

//   return (
//     <aside className="fixed left-0 top-0 h-screen w-64 bg-white shadow border-r z-50">
//       <div className="p-6 border-b">
//         <h1 className="text-xl font-bold text-gray-800">Staff Panel</h1>
//       </div>
//       <nav className="flex flex-col p-4 gap-4">
//         {navItems.map((item) => (
//           <Link
//             key={item.name}
//             href={item.href}
//             className={`flex items-center gap-3 px-4 py-2 rounded text-sm font-medium ${
//               pathname === item.href
//                 ? 'bg-blue-100 text-blue-700'
//                 : 'text-gray-600 hover:bg-gray-100'
//             }`}
//           >
//             {item.icon}
//             {item.name}
//           </Link>
//         ))}
//         <button
//           onClick={() => {
//             // You can integrate NextAuth logout or any logic
//             window.location.href = '/api/auth/signout';
//           }}
//           className="flex items-center gap-3 px-4 py-2 mt-auto text-sm text-red-500 hover:bg-red-50 rounded"
//         >
//           <LogOut size={20} />
//           Logout
//         </button>
//       </nav>
//     </aside>
//   );
// }


'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function StaffSidebar({ children }) {
  const pathname = usePathname();

  const linkClass = (path) =>
    `block px-4 py-2 rounded hover:bg-gray-100 ${
      pathname === path ? 'bg-blue-100 text-blue-600 font-semibold' : ''
    }`;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-6">
        <h2 className="text-2xl font-bold mb-8">Staff Panel</h2>
        <nav className="space-y-2">
          <Link href="/staff/dashboard" className={linkClass('/staff/dashboard')}>
            🧭 Dashboard
          </Link>
          <Link href="/staff/sales" className={linkClass('/staff/sales')}>
            🛒 Sales
          </Link>
          <Link href="/logout" className="block px-4 py-2 rounded text-red-500 hover:bg-red-50">
            🚪 Logout
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
