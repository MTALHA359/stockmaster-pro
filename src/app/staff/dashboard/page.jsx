// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { redirect } from "next/navigation";

// export default async function StaffDashboard() {
//   const session = await getServerSession(authOptions);
//   if (!session || session.user.role !== "staff") {
//     redirect("/login");
//   }

//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-bold">Staff Dashboard</h1>
//       <p>Welcome, <strong>{session.user.email}</strong> (Role: {session.user.role})</p>
//     </div>
//   );
// }
'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function StaffDashboard() {
  const [sales, setSales] = useState(0);
  const [products, setProducts] = useState(0);
  const [chartData, setChartData] = useState({
    options: {
      chart: { id: 'sales-chart' },
      xaxis: { categories: ['Sales'] },
      colors: ['#4ade80']
    },
    series: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const salesRes = await fetch('/api/sales');
        const salesData = await salesRes.json();
        const productRes = await fetch('/api/products');
        const productData = await productRes.json();

        const totalSalesAmount = salesData.reduce((sum, s) => sum + s.total, 0);
        setSales(totalSalesAmount);
        setProducts(productData.length);

        setChartData(prev => ({
          ...prev,
          series: [{ name: 'Sales', data: [totalSalesAmount] }]
        }));
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">👨‍💼 Staff Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <h2 className="text-gray-600 text-sm">Total Sales</h2>
          <p className="text-2xl font-semibold text-green-600">Rs {sales}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
          <h2 className="text-gray-600 text-sm">Total Products</h2>
          <p className="text-2xl font-semibold">{products}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <h2 className="text-gray-600 text-sm">Orders</h2>
          <p className="text-2xl font-semibold">--</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">📈 Sales Overview</h2>
        {chartData.series.length > 0 && (
          <Chart options={chartData.options} series={chartData.series} type="bar" height={350} />
        )}
      </div>
    </div>
  );
}
