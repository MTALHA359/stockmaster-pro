// 'use client';

// import { useEffect, useState } from 'react';
// import AdminSidebar from '../components/AdminSidebar';
// import Link from 'next/link';

// export default function ProductsPage() {
//   const [products, setProducts] = useState([]);
//   const [search, setSearch] = useState('');
//   const [filtered, setFiltered] = useState([]);

//   useEffect(() => {
//     async function fetchProducts() {
//       try {
//         const res = await fetch('/api/products');
//         const data = await res.json();
//         setProducts(data);
//         setFiltered(data);
//       } catch (err) {
//         console.error('Failed to fetch products:', err);
//       }
//     }

//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     const q = search.toLowerCase();
//     const result = products.filter((p) =>
//       (p?.name || '').toLowerCase().includes(q)
//     );
//     setFiltered(result);
//   }, [search, products]);

//   return (
//     <div className="flex min-h-screen">
//       <AdminSidebar />

//       <main className="flex-1 p-6 bg-gray-50">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold">All Products</h1>
//           <Link href="/admin/products/add">
//             <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
//               Add Product
//             </button>
//           </Link>
//         </div>

//         <input
//           type="text"
//           placeholder="Search product name"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="w-full max-w-md p-2 mb-6 border rounded shadow-sm"
//         />

//         <div className="overflow-x-auto bg-white rounded shadow">
//           <table className="min-w-full text-sm text-left border border-gray-200">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="border px-4 py-2">Name</th>
//                 <th className="border px-4 py-2">Price</th>
//                 <th className="border px-4 py-2">Stock</th>
//                 <th className="border px-4 py-2">Category</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filtered.length > 0 ? (
//                 filtered.map((product, i) => (
//                   <tr key={i} className="hover:bg-gray-50">
//                     <td className="border px-4 py-2">{product.name}</td>
//                     <td className="border px-4 py-2">${product.price}</td>
//                     <td className="border px-4 py-2">{product.stock}</td>
//                     <td className="border px-4 py-2">{product.category || '—'}</td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="4" className="text-center text-gray-500 py-4">
//                     No products found.
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

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
        setFiltered(data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      }
    }

    fetchProducts();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    const result = products.filter((p) =>
      (p?.name || '').toLowerCase().includes(q)
    );
    setFiltered(result);
  }, [search, products]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar reserved width */}
      <div className="w-64 bg-white shadow">
        <AdminSidebar />
      </div>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-x-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">All Products</h1>
          <Link href="/admin/products/add">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Add Product
            </button>
          </Link>
        </div>

        <input
          type="text"
          placeholder="Search product name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md p-2 mb-6 border rounded shadow-sm"
        />

        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full text-sm text-left border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Price</th>
                <th className="border px-4 py-2">Stock</th>
                <th className="border px-4 py-2">Category</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((product, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{product.name || '—'}</td>
                    <td className="border px-4 py-2">${product.price || '0'}</td>
                    <td className="border px-4 py-2">{product.stock || '—'}</td>
                    <td className="border px-4 py-2">{product.category || '—'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-gray-500 py-4">
                    No products found.
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
