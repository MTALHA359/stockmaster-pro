// 'use client';

// import { useEffect, useState } from 'react';
// import AdminSidebar from '../components/AdminSidebar';
// import Link from 'next/link';

// export default function PurchasesPage() {
//   const [purchases, setPurchases] = useState([]);
//   const [search, setSearch] = useState('');
//   const [filtered, setFiltered] = useState([]);

//   useEffect(() => {
//     async function fetchPurchases() {
//       try {
//         const res = await fetch('/api/purchases');
//         const data = await res.json();
//         setPurchases(data);
//         setFiltered(data);
//       } catch (error) {
//         console.error('Failed to fetch purchases:', error);
//       }
//     }

//     fetchPurchases();
//   }, []);

//   // ✅ Safe search with fallback values
//   useEffect(() => {
//     const q = search.toLowerCase();

//     const result = purchases.filter((p) =>
//       (p?.product || '').toLowerCase().includes(q) ||
//       (p?.shopName || '').toLowerCase().includes(q) ||
//       (p?.address || '').toLowerCase().includes(q) ||
//       (p?.contact || '').toLowerCase().includes(q)
//     );

//     setFiltered(result);
//   }, [search, purchases]);

//   return (
//     <div className="flex min-h-screen">
//       <AdminSidebar />

//       <main className="flex-1 p-6 bg-gray-50">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold">All Purchases</h1>
//           <Link href="/admin/purchases/add">
//             <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
//               Add Purchase
//             </button>
//           </Link>
//         </div>

//         <input
//           type="text"
//           placeholder="Search by product, shop, address or contact"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="w-full max-w-md p-2 mb-6 border rounded shadow-sm"
//         />

//         <div className="overflow-x-auto bg-white rounded shadow">
//           <table className="min-w-full text-sm text-left border border-gray-200">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="border px-4 py-2">Product</th>
//                 <th className="border px-4 py-2">Quantity</th>
//                 <th className="border px-4 py-2">Price</th>
//                 <th className="border px-4 py-2">Shop</th>
//                 <th className="border px-4 py-2">Address</th>
//                 <th className="border px-4 py-2">Contact</th>
//                 <th className="border px-4 py-2">Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filtered.length > 0 ? (
//                 filtered.map((p, i) => (
//                   <tr key={i} className="hover:bg-gray-50">
//                     <td className="border px-4 py-2">{p.product || '—'}</td>
//                     <td className="border px-4 py-2">{p.quantity || 0}</td>
//                     <td className="border px-4 py-2">${p.price || 0}</td>
//                     <td className="border px-4 py-2">{p.shopName || '—'}</td>
//                     <td className="border px-4 py-2">{p.address || '—'}</td>
//                     <td className="border px-4 py-2">{p.contact || '—'}</td>
//                     <td className="border px-4 py-2">{p.date || '—'}</td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="7" className="text-center text-gray-500 py-4">
//                     No purchases found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </main>
//     </div>
//   );
// }



'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import Link from 'next/link';

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState([]);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    async function fetchPurchases() {
      try {
        const res = await fetch('/api/purchases');
        const data = await res.json();
        console.log(data); // Check if data has correct structure
        setPurchases(data);
        setFiltered(data);
      } catch (error) {
        console.error('Failed to fetch purchases:', error);
      }
    }

    fetchPurchases();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    const result = purchases.filter((p) =>
      (p?.product || '').toLowerCase().includes(q) ||
      (p?.shopName || '').toLowerCase().includes(q) ||
      (p?.address || '').toLowerCase().includes(q) ||
      (p?.contact || '').toLowerCase().includes(q)
    );
    setFiltered(result);
  }, [search, purchases]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar wrapper with fixed width */}
      <div className="w-64 bg-white shadow">
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-x-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">All Purchases</h1>
          <Link href="/admin/purchases/add">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Add Purchase
            </button>
          </Link>
        </div>

        <input
          type="text"
          placeholder="Search by product, shop, address or contact"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md p-2 mb-6 border rounded shadow-sm"
        />

        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full text-sm text-left border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Product</th>
                <th className="border px-4 py-2">Quantity</th>
                <th className="border px-4 py-2">Price</th>
                <th className="border px-4 py-2">Shop</th>
                <th className="border px-4 py-2">Address</th>
                <th className="border px-4 py-2">Contact</th>
                <th className="border px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((p, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{p.product || '—'}</td>
                    <td className="border px-4 py-2">{p.quantity || 0}</td>
                    <td className="border px-4 py-2">${p.price || 0}</td>
                    <td className="border px-4 py-2">{p.shopName || '—'}</td>
                    <td className="border px-4 py-2">{p.address || '—'}</td>
                    <td className="border px-4 py-2">{p.contact || '—'}</td>
                    <td className="border px-4 py-2">
                      {p.date ? new Date(p.date).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-gray-500 py-4">
                    No purchases found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
