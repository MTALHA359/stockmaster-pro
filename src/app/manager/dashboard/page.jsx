// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { redirect } from "next/navigation";

// export default async function ManagerDashboard() {
//   const session = await getServerSession(authOptions);
//   if (!session || session.user.role !== "manager") {
//     redirect("/login");
//   }

//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-bold">Manager Dashboard</h1>
//       <p>Welcome, <strong>{session.user.email}</strong> (Role: {session.user.role})</p>
//     </div>
//   );
// }
// app/admin/dashboard/page.jsx
// 'use client';

// import { useEffect, useState } from 'react';
// import dynamic from 'next/dynamic';

// const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

// export default function AdminDashboardPage() {
//   const [totalSales, setTotalSales] = useState(0);
//   const [totalPurchases, setTotalPurchases] = useState(0);
//   const [products, setProducts] = useState(0);
//   const [users, setUsers] = useState(0);
//   const [chartData, setChartData] = useState({
//     options: {
//       chart: {
//         id: 'sales-purchases'
//       },
//       xaxis: {
//         categories: ['Sales', 'Purchases']
//       },
//       colors: ['#4ade80', '#60a5fa']
//     },
//     series: []
//   });

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const resSales = await fetch('/api/sales');
//         const salesData = await resSales.json();
//         const resPurchases = await fetch('/api/purchases');
//         const purchaseData = await resPurchases.json();
//         const resProducts = await fetch('/api/products');
//         const productsData = await resProducts.json();
//         const resUsers = await fetch('/api/users');
//         const usersData = await resUsers.json();

//         const totalSalesAmount = salesData.reduce((sum, s) => sum + s.total, 0);

//         setTotalSales(totalSalesAmount);
//         setTotalPurchases(purchaseData.length);
//         setProducts(productsData.length);
//         setUsers(usersData.length);

//         setChartData(prev => ({
//           ...prev,
//           series: [
//             {
//               name: 'Amount',
//               data: [totalSalesAmount, purchaseData.length]
//             }
//           ]
//         }));
//       } catch (error) {
//         console.error('Error fetching admin stats:', error);
//       }
//     };

//     fetchStats();
//   }, []);

//   return (
//     <div className="flex">
   
//       <main className="ml-64 w-full min-h-screen p-8 bg-gradient-to-br from-white via-gray-50 to-gray-100">
//         <h1 className="text-4xl font-extrabold text-gray-800 mb-6">📊 Admin Dashboard</h1>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-all border-t-4 border-green-400">
//             <h2 className="text-gray-500 text-sm">Total Sales</h2>
//             <p className="text-3xl font-bold text-green-600">Rs {totalSales}</p>
//           </div>
//           <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-all border-t-4 border-blue-400">
//             <h2 className="text-gray-500 text-sm">Purchases</h2>
//             <p className="text-3xl font-bold">{totalPurchases}</p>
//           </div>
//           <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-all border-t-4 border-yellow-400">
//             <h2 className="text-gray-500 text-sm">Products</h2>
//             <p className="text-3xl font-bold">{products}</p>
//           </div>
//           <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-all border-t-4 border-red-400">
//             <h2 className="text-gray-500 text-sm">Users</h2>
//             <p className="text-3xl font-bold">{users}</p>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow border">
//           <h2 className="text-xl font-semibold mb-4 text-gray-700">📈 Sales vs Purchases</h2>
//           {chartData.series.length > 0 && (
//             <Chart options={chartData.options} series={chartData.series} type="bar" height={350} />
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }
'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function AdminDashboardPage() {
  const [totalSales, setTotalSales] = useState(0);
  const [products, setProducts] = useState(0);
  const [users, setUsers] = useState(0);
  const [chartData, setChartData] = useState({
    options: {
      chart: {
        id: 'sales-chart',
      },
      xaxis: {
        categories: ['Sales'],
      },
      colors: ['#4ade80'],
    },
    series: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const resSales = await fetch('/api/sales');
        const salesData = await resSales.json();
        const resProducts = await fetch('/api/products');
        const productsData = await resProducts.json();
        const resUsers = await fetch('/api/users');
        const usersData = await resUsers.json();

        const totalSalesAmount = salesData.reduce((sum, s) => sum + s.total, 0);

        setTotalSales(totalSalesAmount);
        setProducts(productsData.length);
        setUsers(usersData.length);

        setChartData(prev => ({
          ...prev,
          series: [
            {
              name: 'Total Sales',
              data: [totalSalesAmount],
            },
          ],
        }));
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex">
      <main className="ml-64 w-full min-h-screen p-8 bg-gradient-to-br from-white via-gray-50 to-gray-100">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6">📊 Admin Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-all border-t-4 border-green-400">
            <h2 className="text-gray-500 text-sm">Total Sales</h2>
            <p className="text-3xl font-bold text-green-600">Rs {totalSales}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-all border-t-4 border-yellow-400">
            <h2 className="text-gray-500 text-sm">Products</h2>
            <p className="text-3xl font-bold">{products}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-all border-t-4 border-red-400">
            <h2 className="text-gray-500 text-sm">Users</h2>
            <p className="text-3xl font-bold">{users}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">📈 Sales Chart</h2>
          {chartData.series.length > 0 && (
            <Chart options={chartData.options} series={chartData.series} type="bar" height={350} />
          )}
        </div>
      </main>
    </div>
  );
}
