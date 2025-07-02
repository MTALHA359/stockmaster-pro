// // src/app/dashboard/layout.jsx
// 'use client';

// import ManagerSidebar from "../components/ManagerSidebar";


// export default function DashboardLayout({ children }) {
//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <ManagerSidebar/>
//       <main className="ml-64 w-full p-6">
//         {children}
//       </main>
//     </div>
//   );
// }
'use client';

import ManagerSidebar from "../components/ManagerSidebar";
import { Toaster } from 'react-hot-toast';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <ManagerSidebar />
      <main className="ml-64 w-full p-6">
        <Toaster position="top-right" reverseOrder={false} />
        {children}
      </main>
    </div>
  );
}
