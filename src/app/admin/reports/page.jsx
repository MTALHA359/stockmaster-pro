// 'use client';

// import { useState, useEffect, useMemo } from 'react';
// import AdminSidebar from '../components/AdminSidebar';
// import {
//   LineChart,
//   Line,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   Tooltip,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   Legend,
//   ResponsiveContainer,
// } from 'recharts';
// import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiShoppingCart } from 'react-icons/fi';

// const COLORS = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6'];

// function exportToCSV(data, filename = 'report.csv') {
//   if (!data.length) return;
//   const headers = Object.keys(data[0]);
//   const csvRows = [headers.join(',')];

//   for (const row of data) {
//     const values = headers.map(h => {
//       const val = row[h] == null ? '' : row[h];
//       return `"${val.toString().replace(/"/g, '""')}"`;
//     });
//     csvRows.push(values.join(','));
//   }

//   const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
//   const url = URL.createObjectURL(blob);
//   const a = document.createElement('a');
//   a.href = url;
//   a.download = filename;
//   a.click();
//   URL.revokeObjectURL(url);
// }

// function formatDate(date) {
//   return new Date(date).toISOString().slice(0, 10);
// }

// // Helper to get preset date ranges
// function getPresetDates(option) {
//   const now = new Date();
//   const start = new Date();
//   switch (option) {
//     case 'today':
//       return { startDate: formatDate(now), endDate: formatDate(now) };
//     case 'last7':
//       start.setDate(now.getDate() - 6);
//       return { startDate: formatDate(start), endDate: formatDate(now) };
//     case 'thisMonth':
//       start.setDate(1);
//       return { startDate: formatDate(start), endDate: formatDate(now) };
//     default:
//       return { startDate: '', endDate: '' };
//   }
// }

// export default function AdminReportPage() {
//   const [sales, setSales] = useState([]);
//   const [purchases, setPurchases] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [darkMode, setDarkMode] = useState(false);

//   // Date filters
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');

//   // Table search
//   const [salesSearch, setSalesSearch] = useState('');
//   const [purchasesSearch, setPurchasesSearch] = useState('');

//   // Fetch data once
//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const [salesRes, purchasesRes] = await Promise.all([
//           fetch('/api/sales'),
//           fetch('/api/purchases'),
//         ]);
//         const salesData = await salesRes.json();
//         const purchasesData = await purchasesRes.json();

//         if (!salesRes.ok) throw new Error(salesData.error || 'Failed to load sales');
//         if (!purchasesRes.ok) throw new Error(purchasesData.error || 'Failed to load purchases');

//         setSales(salesData.sales || []);
//         setPurchases(purchasesData.purchases || []);
//         setError('');
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchData();
//   }, []);

//   // Filter by date
//   const filteredSales = sales.filter(sale => {
//     const saleDate = new Date(sale.date);
//     if (startDate && saleDate < new Date(startDate)) return false;
//     if (endDate && saleDate > new Date(endDate + 'T23:59:59')) return false;
//     if (salesSearch) {
//       const q = salesSearch.toLowerCase();
//       if (
//         !(
//           (sale.product && sale.product.toLowerCase().includes(q)) ||
//           (sale.shopName && sale.shopName.toLowerCase().includes(q))
//         )
//       )
//         return false;
//     }
//     return true;
//   });

//   const filteredPurchases = purchases.filter(pur => {
//     const purDate = new Date(pur.date);
//     if (startDate && purDate < new Date(startDate)) return false;
//     if (endDate && purDate > new Date(endDate + 'T23:59:59')) return false;
//     if (purchasesSearch) {
//       const q = purchasesSearch.toLowerCase();
//       if (
//         !(
//           (pur.product && pur.product.toLowerCase().includes(q)) ||
//           (pur.shopName && pur.shopName.toLowerCase().includes(q))
//         )
//       )
//         return false;
//     }
//     return true;
//   });

//   // KPIs
//   const totalSalesRevenue = filteredSales.reduce((acc, s) => acc + s.price * s.quantity, 0);
//   const totalPurchasesCost = filteredPurchases.reduce((acc, p) => acc + p.price * p.quantity, 0);
//   const profit = totalSalesRevenue - totalPurchasesCost;

//   // Top 5 products by quantity sold
//   const productMap = {};
//   filteredSales.forEach(({ product, quantity }) => {
//     if (!productMap[product]) productMap[product] = 0;
//     productMap[product] += quantity;
//   });
//   const topProducts = Object.entries(productMap)
//     .map(([product, totalQuantity]) => ({ product, totalQuantity }))
//     .sort((a, b) => b.totalQuantity - a.totalQuantity)
//     .slice(0, 5);

//   // Group sales and purchases by date for charts
//   function groupByDate(arr) {
//     const map = {};
//     arr.forEach(({ date, quantity, price }) => {
//       const day = formatDate(date);
//       if (!map[day]) map[day] = { date: day, quantity: 0, revenue: 0 };
//       map[day].quantity += quantity;
//       map[day].revenue += price * quantity;
//     });
//     return Object.values(map).sort((a, b) => new Date(a.date) - new Date(b.date));
//   }
//   const salesTrend = groupByDate(filteredSales);
//   const purchaseTrend = groupByDate(filteredPurchases);

//   // Merge sales and purchases dates
//   const allDates = Array.from(
//     new Set([...salesTrend.map(s => s.date), ...purchaseTrend.map(p => p.date)])
//   ).sort();

//   const mergedTrend = allDates.map(date => {
//     const s = salesTrend.find(i => i.date === date);
//     const p = purchaseTrend.find(i => i.date === date);
//     return {
//       date,
//       salesRevenue: s ? s.revenue : 0,
//       purchaseCost: p ? p.revenue : 0,
//     };
//   });

//   // Dark mode class toggle
//   useEffect(() => {
//     if (darkMode) document.documentElement.classList.add('dark');
//     else document.documentElement.classList.remove('dark');
//   }, [darkMode]);

//   if (loading)
//     return (
//       <div className="flex items-center justify-center h-screen text-gray-700 dark:text-gray-300">
//         Loading Report...
//       </div>
//     );

//   if (error)
//     return (
//       <div className="p-6 text-red-600 dark:text-red-400 font-semibold">{error}</div>
//     );

//   return (
//     <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
//       <AdminSidebar />

//       <main className="flex-1 p-6 max-w-full overflow-auto">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-4xl font-extrabold tracking-tight">Admin Report</h1>
//           <button
//             onClick={() => setDarkMode(!darkMode)}
//             className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600 transition"
//             aria-label="Toggle Dark Mode"
//           >
//             {darkMode ? 'Light Mode' : 'Dark Mode'}
//           </button>
//         </div>

//         {/* Date Filters + Quick Buttons */}
//         <section className="mb-6 flex flex-wrap gap-4 items-center">
//           <label className="flex flex-col">
//             Start Date
//             <input
//               type="date"
//               value={startDate}
//               onChange={e => setStartDate(e.target.value)}
//               className="mt-1 p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
//             />
//           </label>
//           <label className="flex flex-col">
//             End Date
//             <input
//               type="date"
//               value={endDate}
//               onChange={e => setEndDate(e.target.value)}
//               className="mt-1 p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
//             />
//           </label>

//           <div className="space-x-2">
//             <button
//               className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
//               onClick={() => {
//                 const { startDate, endDate } = getPresetDates('today');
//                 setStartDate(startDate);
//                 setEndDate(endDate);
//               }}
//             >
//               Today
//             </button>
//             <button
//               className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
//               onClick={() => {
//                 const { startDate, endDate } = getPresetDates('last7');
//                 setStartDate(startDate);
//                 setEndDate(endDate);
//               }}
//             >
//               Last 7 Days
//             </button>
//             <button
//               className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
//               onClick={() => {
//                 const { startDate, endDate } = getPresetDates('thisMonth');
//                 setStartDate(startDate);
//                 setEndDate(endDate);
//               }}
//             >
//               This Month
//             </button>
//             <button
//               className="px-4 py-2 rounded bg-gray-400 hover:bg-gray-500 text-gray-900"
//               onClick={() => {
//                 setStartDate('');
//                 setEndDate('');
//               }}
//             >
//               Reset
//             </button>
//           </div>
//         </section>

//         {/* KPI Cards */}
//         <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
//           <div className="bg-white dark:bg-gray-800 rounded shadow p-6 flex items-center space-x-4">
//             <FiShoppingCart className="text-blue-600 w-10 h-10" />
//             <div>
//               <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
//                 Total Sales
//               </p>
//               <p className="text-2xl font-bold">${totalSalesRevenue.toFixed(2)}</p>
//             </div>
//           </div>
//           <div className="bg-white dark:bg-gray-800 rounded shadow p-6 flex items-center space-x-4">
//             <FiDollarSign className="text-green-600 w-10 h-10" />
//             <div>
//               <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
//                 Total Purchases
//               </p>
//               <p className="text-2xl font-bold">${totalPurchasesCost.toFixed(2)}</p>
//             </div>
//           </div>
//           <div
//             className={`rounded shadow p-6 flex items-center space-x-4 ${
//               profit >= 0 ? 'bg-green-50 dark:bg-green-900' : 'bg-red-50 dark:bg-red-900'
//             }`}
//           >
//             {profit >= 0 ? (
//               <FiTrendingUp className="text-green-600 w-10 h-10" />
//             ) : (
//               <FiTrendingDown className="text-red-600 w-10 h-10" />
//             )}
//             <div>
//               <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
//                 Profit / Loss
//               </p>
//               <p
//                 className={`text-2xl font-bold ${
//                   profit >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
//                 }`}
//               >
//                 ${profit.toFixed(2)}
//               </p>
//             </div>
//           </div>
//           <div className="bg-white dark:bg-gray-800 rounded shadow p-6 flex items-center space-x-4">
//             <FiShoppingCart className="text-purple-600 w-10 h-10" />
//             <div>
//               <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
//                 Sales Count
//               </p>
//               <p className="text-2xl font-bold">{filteredSales.length}</p>
//             </div>
//           </div>
//         </section>

//         {/* Sales & Purchases Line Chart */}
//         <section className="mb-12 bg-white dark:bg-gray-800 rounded shadow p-6">
//           <h2 className="text-2xl font-semibold mb-4">Sales vs Purchases Trend</h2>
//           <ResponsiveContainer width="100%" height={350}>
//             <LineChart
//               data={mergedTrend}
//               margin={{ top: 10, right: 40, left: 0, bottom: 0 }}
//             >
//               <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
//               <XAxis dataKey="date" stroke={darkMode ? '#d1d5db' : '#4b5563'} />
//               <YAxis stroke={darkMode ? '#d1d5db' : '#4b5563'} />
//               <Tooltip
//                 contentStyle={{
//                   backgroundColor: darkMode ? '#1f2937' : '#fff',
//                   borderColor: darkMode ? '#374151' : '#d1d5db',
//                 }}
//               />
//               <Legend />
//               <Line
//                 type="monotone"
//                 dataKey="salesRevenue"
//                 stroke="#3b82f6"
//                 name="Sales Revenue"
//                 strokeWidth={2}
//                 dot={{ r: 3 }}
//               />
//               <Line
//                 type="monotone"
//                 dataKey="purchaseCost"
//                 stroke="#ef4444"
//                 name="Purchases Cost"
//                 strokeWidth={2}
//                 dot={{ r: 3 }}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </section>

//         {/* Top Selling Products Bar Chart */}
//         <section className="mb-12 bg-white dark:bg-gray-800 rounded shadow p-6 max-w-4xl mx-auto">
//           <h2 className="text-2xl font-semibold mb-4">Top Selling Products</h2>
//           {topProducts.length ? (
//             <ResponsiveContainer width="100%" height={350}>
//               <BarChart
//                 data={topProducts}
//                 layout="vertical"
//                 margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
//                 <XAxis type="number" stroke={darkMode ? '#d1d5db' : '#4b5563'} />
//                 <YAxis
//                   dataKey="product"
//                   type="category"
//                   stroke={darkMode ? '#d1d5db' : '#4b5563'}
//                   width={150}
//                 />
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: darkMode ? '#1f2937' : '#fff',
//                     borderColor: darkMode ? '#374151' : '#d1d5db',
//                   }}
//                 />
//                 <Bar dataKey="totalQuantity" fill="#3b82f6" />
//               </BarChart>
//             </ResponsiveContainer>
//           ) : (
//             <p>No sales data to display.</p>
//           )}
//         </section>

//         {/* Searchable & Sortable Sales Table */}
//         <section className="mb-12 bg-white dark:bg-gray-800 rounded shadow p-6">
//           <h2 className="text-2xl font-semibold mb-4">Sales Records</h2>
//           <input
//             type="text"
//             placeholder="Search by product or shop name..."
//             value={salesSearch}
//             onChange={e => setSalesSearch(e.target.value)}
//             className="mb-4 w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
//           />
//           <div className="overflow-x-auto">
//             <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-700">
//               <thead className="bg-gray-100 dark:bg-gray-700">
//                 <tr>
//                   <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">Product</th>
//                   <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">Quantity</th>
//                   <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">Price</th>
//                   <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">Date</th>
//                   <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">Shop</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredSales.length ? (
//                   filteredSales.map(s => (
//                     <tr
//                       key={s._id}
//                       className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
//                     >
//                       <td className="border border-gray-300 dark:border-gray-600 p-2">{s.product}</td>
//                       <td className="border border-gray-300 dark:border-gray-600 p-2">{s.quantity}</td>
//                       <td className="border border-gray-300 dark:border-gray-600 p-2">${s.price}</td>
//                       <td className="border border-gray-300 dark:border-gray-600 p-2">
//                         {new Date(s.date).toLocaleDateString()}
//                       </td>
//                       <td className="border border-gray-300 dark:border-gray-600 p-2">{s.shopName}</td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="5" className="text-center p-4 text-gray-500">
//                       No sales records found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//           <button
//             className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//             onClick={() => exportToCSV(filteredSales, 'sales_report.csv')}
//           >
//             Export Sales CSV
//           </button>
//         </section>

//         {/* Purchases Table */}
//         <section className="mb-12 bg-white dark:bg-gray-800 rounded shadow p-6 max-w-full">
//           <h2 className="text-2xl font-semibold mb-4">Purchase Records</h2>
//           <input
//             type="text"
//             placeholder="Search by product or shop name..."
//             value={purchasesSearch}
//             onChange={e => setPurchasesSearch(e.target.value)}
//             className="mb-4 w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
//           />
//           <div className="overflow-x-auto">
//             <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-700">
//               <thead className="bg-gray-100 dark:bg-gray-700">
//                 <tr>
//                   <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">Product</th>
//                   <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">Quantity</th>
//                   <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">Price</th>
//                   <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">Date</th>
//                   <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">Shop</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredPurchases.length ? (
//                   filteredPurchases.map(p => (
//                     <tr
//                       key={p._id}
//                       className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
//                     >
//                       <td className="border border-gray-300 dark:border-gray-600 p-2">{p.product}</td>
//                       <td className="border border-gray-300 dark:border-gray-600 p-2">{p.quantity}</td>
//                       <td className="border border-gray-300 dark:border-gray-600 p-2">${p.price}</td>
//                       <td className="border border-gray-300 dark:border-gray-600 p-2">
//                         {new Date(p.date).toLocaleDateString()}
//                       </td>
//                       <td className="border border-gray-300 dark:border-gray-600 p-2">{p.shopName}</td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="5" className="text-center p-4 text-gray-500">
//                       No purchase records found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//           <button
//             className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//             onClick={() => exportToCSV(filteredPurchases, 'purchases_report.csv')}
//           >
//             Export Purchases CSV
//           </button>
//         </section>
//       </main>
//     </div>
//   );
// }



'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiShoppingCart } from 'react-icons/fi';

const COLORS = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6'];

function formatDate(date) {
  return new Date(date).toISOString().slice(0, 10);
}

function getPresetDates(option) {
  const now = new Date();
  const start = new Date();
  switch (option) {
    case 'today':
      return { startDate: formatDate(now), endDate: formatDate(now) };
    case 'last7':
      start.setDate(now.getDate() - 6);
      return { startDate: formatDate(start), endDate: formatDate(now) };
    case 'thisMonth':
      start.setDate(1);
      return { startDate: formatDate(start), endDate: formatDate(now) };
    default:
      return { startDate: '', endDate: '' };
  }
}

export default function AdminReportPage() {
  const [sales, setSales] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [salesSearch, setSalesSearch] = useState('');
  const [purchasesSearch, setPurchasesSearch] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [salesRes, purchasesRes] = await Promise.all([
          fetch('/api/sales'),
          fetch('/api/purchases'),
        ]);
        const salesData = await salesRes.json();
        const purchasesData = await purchasesRes.json();

        if (!salesRes.ok) throw new Error(salesData.error || 'Failed to load sales');
        if (!purchasesRes.ok) throw new Error(purchasesData.error || 'Failed to load purchases');

        setSales(salesData.sales || []);
        setPurchases(purchasesData.purchases || []);
        setError('');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredSales = sales.filter(sale => {
    const saleDate = new Date(sale.date);
    if (startDate && saleDate < new Date(startDate)) return false;
    if (endDate && saleDate > new Date(endDate + 'T23:59:59')) return false;
    if (salesSearch) {
      const q = salesSearch.toLowerCase();
      if (
        !(
          (sale.product && sale.product.toLowerCase().includes(q)) ||
          (sale.shopName && sale.shopName.toLowerCase().includes(q))
        )
      )
        return false;
    }
    return true;
  });

  const filteredPurchases = purchases.filter(pur => {
    const purDate = new Date(pur.date);
    if (startDate && purDate < new Date(startDate)) return false;
    if (endDate && purDate > new Date(endDate + 'T23:59:59')) return false;
    if (purchasesSearch) {
      const q = purchasesSearch.toLowerCase();
      if (
        !(
          (pur.product && pur.product.toLowerCase().includes(q)) ||
          (pur.shopName && pur.shopName.toLowerCase().includes(q))
        )
      )
        return false;
    }
    return true;
  });

  const totalSalesRevenue = filteredSales.reduce((acc, s) => acc + s.price * s.quantity, 0);
  const totalPurchasesCost = filteredPurchases.reduce((acc, p) => acc + p.price * p.quantity, 0);
  const profit = totalSalesRevenue - totalPurchasesCost;

  const productMap = {};
  filteredSales.forEach(({ product, quantity }) => {
    if (!productMap[product]) productMap[product] = 0;
    productMap[product] += quantity;
  });
  const topProducts = Object.entries(productMap)
    .map(([product, totalQuantity]) => ({ product, totalQuantity }))
    .sort((a, b) => b.totalQuantity - a.totalQuantity)
    .slice(0, 5);

  function groupByDate(arr) {
    const map = {};
    arr.forEach(({ date, quantity, price }) => {
      const day = formatDate(date);
      if (!map[day]) map[day] = { date: day, quantity: 0, revenue: 0 };
      map[day].quantity += quantity;
      map[day].revenue += price * quantity;
    });
    return Object.values(map).sort((a, b) => new Date(a.date) - new Date(b.date));
  }
  const salesTrend = groupByDate(filteredSales);
  const purchaseTrend = groupByDate(filteredPurchases);

  const allDates = Array.from(
    new Set([...salesTrend.map(s => s.date), ...purchaseTrend.map(p => p.date)])
  ).sort();

  const mergedTrend = allDates.map(date => {
    const s = salesTrend.find(i => i.date === date);
    const p = purchaseTrend.find(i => i.date === date);
    return {
      date,
      salesRevenue: s ? s.revenue : 0,
      purchaseCost: p ? p.revenue : 0,
    };
  });

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-700 dark:text-gray-300">
        Loading Report...
      </div>
    );

  if (error)
    return (
      <div className="p-6 text-red-600 dark:text-red-400 font-semibold">{error}</div>
    );

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar fixed width */}
      <aside className="w-64 fixed h-full border-r border-gray-300 dark:border-gray-700">
        <AdminSidebar />
      </aside>

      {/* Main content: flex-1 and overflow-x-auto, with margin left for sidebar */}
      <main className="flex-1 ml-64 p-6 overflow-x-auto max-w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-extrabold tracking-tight">Admin Report</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600 transition"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>

        {/* Date Filters + Quick Buttons */}
        <section className="mb-6 flex flex-wrap gap-4 items-center">
          <label className="flex flex-col">
            Start Date
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="mt-1 p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
            />
          </label>
          <label className="flex flex-col">
            End Date
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="mt-1 p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
            />
          </label>

          <div className="space-x-2">
            <button
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => {
                const { startDate, endDate } = getPresetDates('today');
                setStartDate(startDate);
                setEndDate(endDate);
              }}
            >
              Today
            </button>
            <button
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => {
                const { startDate, endDate } = getPresetDates('last7');
                setStartDate(startDate);
                setEndDate(endDate);
              }}
            >
              Last 7 Days
            </button>
            <button
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => {
                const { startDate, endDate } = getPresetDates('thisMonth');
                setStartDate(startDate);
                setEndDate(endDate);
              }}
            >
              This Month
            </button>
            <button
              className="px-4 py-2 rounded bg-gray-400 hover:bg-gray-500 text-gray-900"
              onClick={() => {
                setStartDate('');
                setEndDate('');
              }}
            >
              Reset
            </button>
          </div>
        </section>

        {/* KPI Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white dark:bg-gray-800 rounded shadow p-6 flex items-center space-x-4">
            <FiShoppingCart className="text-blue-600 w-10 h-10" />
            <div>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
                Total Sales
              </p>
              <p className="text-2xl font-bold">${totalSalesRevenue.toFixed(2)}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded shadow p-6 flex items-center space-x-4">
            <FiDollarSign className="text-green-600 w-10 h-10" />
            <div>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
                Total Purchases
              </p>
              <p className="text-2xl font-bold">${totalPurchasesCost.toFixed(2)}</p>
            </div>
          </div>
          <div
            className={`rounded shadow p-6 flex items-center space-x-4 ${
              profit >= 0 ? 'bg-green-50 dark:bg-green-900' : 'bg-red-50 dark:bg-red-900'
            }`}
          >
            {profit >= 0 ? (
              <FiTrendingUp className="text-green-600 w-10 h-10" />
            ) : (
              <FiTrendingDown className="text-red-600 w-10 h-10" />
            )}
            <div>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
                Profit / Loss
              </p>
              <p
                className={`text-2xl font-bold ${
                  profit >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                }`}
              >
                ${profit.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded shadow p-6 flex items-center space-x-4">
            <FiShoppingCart className="text-purple-600 w-10 h-10" />
            <div>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
                Sales Count
              </p>
              <p className="text-2xl font-bold">{filteredSales.length}</p>
            </div>
          </div>
        </section>

        {/* Sales vs Purchases Line Chart */}
        <section className="mb-12 bg-white dark:bg-gray-800 rounded shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Sales vs Purchases Trend</h2>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={mergedTrend} margin={{ top: 10, right: 40, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="date" stroke={darkMode ? '#d1d5db' : '#4b5563'} />
              <YAxis stroke={darkMode ? '#d1d5db' : '#4b5563'} />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? '#1f2937' : '#fff',
                  borderColor: darkMode ? '#374151' : '#d1d5db',
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="salesRevenue" stroke="#3b82f6" name="Sales Revenue" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="purchaseCost" stroke="#ef4444" name="Purchases Cost" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </section>

        {/* Top Selling Products Bar Chart */}
        <section className="mb-12 bg-white dark:bg-gray-800 rounded shadow p-6 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Top Selling Products</h2>
          {topProducts.length ? (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={topProducts} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                <XAxis type="number" stroke={darkMode ? '#d1d5db' : '#4b5563'} />
                <YAxis dataKey="product" type="category" stroke={darkMode ? '#d1d5db' : '#4b5563'} width={150} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#1f2937' : '#fff',
                    borderColor: darkMode ? '#374151' : '#d1d5db',
                  }}
                />
                <Bar dataKey="totalQuantity" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No sales data to display.</p>
          )}
        </section>
      </main>
    </div>
  );
}
