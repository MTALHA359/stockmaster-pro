
// 'use client';

// import { useEffect, useState } from 'react';
// import AdminSidebar from '../components/AdminSidebar';

// export default function SalesPage() {
//   const [sales, setSales] = useState([]);
//   const [topProducts, setTopProducts] = useState([]);
//   const [totalSalesCount, setTotalSalesCount] = useState(0);
//   const [totalRevenue, setTotalRevenue] = useState(0);
//   const [totalQuantitySold, setTotalQuantitySold] = useState(0);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchSales() {
//       try {
//         const res = await fetch('/api/sales');
//         const data = await res.json();

//         if (!res.ok) {
//           throw new Error(data.error || 'Failed to fetch sales');
//         }

//         setSales(data.sales);
//         setTopProducts(data.topProducts);
//         setTotalSalesCount(data.totalSalesCount);
//         setTotalRevenue(data.totalRevenue);
//         setTotalQuantitySold(data.totalQuantitySold);
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchSales();
//   }, []);

//   if (loading) return <div className="p-6">Loading...</div>;

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Sidebar with reserved width */}
//       <div className="w-64 bg-white shadow">
//         <AdminSidebar />
//       </div>

//       {/* Main Content */}
//       <main className="flex-1 p-6 overflow-x-auto">
//         <h1 className="text-3xl font-bold mb-6">Sales Dashboard</h1>

//         {/* Summary Cards */}
//         <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-white p-4 rounded shadow">
//             <h2 className="text-lg font-semibold mb-2">Total Sales</h2>
//             <p className="text-2xl">{totalSalesCount}</p>
//           </div>

//           <div className="bg-white p-4 rounded shadow">
//             <h2 className="text-lg font-semibold mb-2">Total Revenue</h2>
//             <p className="text-2xl">${totalRevenue.toFixed(2)}</p>
//           </div>

//           <div className="bg-white p-4 rounded shadow">
//             <h2 className="text-lg font-semibold mb-2">Total Quantity Sold</h2>
//             <p className="text-2xl">{totalQuantitySold}</p>
//           </div>
//         </section>

//         {/* Top Selling Products */}
//         <section className="mb-8">
//           <h2 className="text-2xl font-semibold mb-4">Top Selling Products</h2>
//           <ul className="bg-white rounded shadow divide-y divide-gray-200 max-w-md">
//             {topProducts.length > 0 ? (
//               topProducts.map(({ product, totalQuantity }, idx) => (
//                 <li key={idx} className="p-4 flex justify-between items-center">
//                   <span>{product}</span>
//                   <span className="font-semibold">{totalQuantity}</span>
//                 </li>
//               ))
//             ) : (
//               <li className="p-4 text-center text-gray-500">No data found.</li>
//             )}
//           </ul>
//         </section>

//         {/* Sales Table */}
//         <section>
//           <h2 className="text-2xl font-semibold mb-4">All Sales</h2>

//           <div className="overflow-x-auto bg-white rounded shadow">
//             <table className="min-w-full text-left text-sm border border-gray-200">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="border px-4 py-2">Product</th>
//                   <th className="border px-4 py-2">Quantity</th>
//                   <th className="border px-4 py-2">Price</th>
//                   <th className="border px-4 py-2">Date</th>
//                   <th className="border px-4 py-2">Shop</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {sales.length > 0 ? (
//                   sales.map(({ _id, product, quantity, price, date, shopName }) => (
//                     <tr key={_id} className="hover:bg-gray-50">
//                       <td className="border px-4 py-2">{product}</td>
//                       <td className="border px-4 py-2">{quantity}</td>
//                       <td className="border px-4 py-2">${price.toFixed(2)}</td>
//                       <td className="border px-4 py-2">
//                         {date ? new Date(date).toLocaleDateString() : '—'}
//                       </td>
//                       <td className="border px-4 py-2">{shopName || '—'}</td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="5" className="text-center py-4 text-gray-500">
//                       No sales data found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [totalSalesCount, setTotalSalesCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalQuantitySold, setTotalQuantitySold] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function fetchSales() {
    try {
      const res = await fetch('/api/sales');
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to fetch sales');
        return;
      }

      setSales(data.sales);
      setTopProducts(data.topProducts);
      setTotalSalesCount(data.totalSalesCount);
      setTotalRevenue(data.totalRevenue);
      setTotalQuantitySold(data.totalQuantitySold);
      setError('');
    } catch (err) {
      setError('Failed to fetch sales');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSales();

    const interval = setInterval(() => {
      fetchSales();
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar wrapper with fixed width */}
      <div className="w-64 bg-white shadow">
        <AdminSidebar />
      </div>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-x-auto">
        <h1 className="text-3xl font-bold mb-6">Sales Dashboard</h1>

        {error && (
          <div className="mb-4 p-2 bg-red-200 text-red-800 rounded">{error}</div>
        )}

        {/* Stats Summary */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Total Sales</h2>
            <p className="text-2xl">{totalSalesCount}</p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Total Revenue</h2>
            <p className="text-2xl">${totalRevenue.toFixed(2)}</p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Total Quantity Sold</h2>
            <p className="text-2xl">{totalQuantitySold}</p>
          </div>
        </section>

        {/* Top Products */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Top Selling Products</h2>
          <ul className="bg-white rounded shadow divide-y divide-gray-200 max-w-md">
            {topProducts.length > 0 ? (
              topProducts.map(({ product, totalQuantity }, idx) => (
                <li key={idx} className="p-4 flex justify-between items-center">
                  <span>{product}</span>
                  <span className="font-semibold">{totalQuantity}</span>
                </li>
              ))
            ) : (
              <li className="p-4 text-center text-gray-500">No data found.</li>
            )}
          </ul>
        </section>

        {/* Sales Table */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">All Sales</h2>

          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full text-left text-sm border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2">Product</th>
                  <th className="border px-4 py-2">Quantity</th>
                  <th className="border px-4 py-2">Price</th>
                  <th className="border px-4 py-2">Date</th>
                  <th className="border px-4 py-2">Shop</th>
                </tr>
              </thead>
              <tbody>
                {sales.length > 0 ? (
                  sales.map(({ _id, product, quantity, price, date, shopName }) => (
                    <tr key={_id} className="hover:bg-gray-50">
                      <td className="border px-4 py-2">{product}</td>
                      <td className="border px-4 py-2">{quantity}</td>
                      <td className="border px-4 py-2">${price.toFixed(2)}</td>
                      <td className="border px-4 py-2">
                        {date ? new Date(date).toLocaleDateString() : '—'}
                      </td>
                      <td className="border px-4 py-2">{shopName || '—'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-500">
                      No sales data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
