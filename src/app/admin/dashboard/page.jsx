'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import AdminSidebar from '../components/AdminSidebar';

// Dynamically import Chart to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function AdminDashboardPage() {
  const [totalSales, setTotalSales] = useState(0);
  const [totalPurchases, setTotalPurchases] = useState(0);
  const [products, setProducts] = useState(0);
  const [users, setUsers] = useState(0);
  const [chartData, setChartData] = useState({
    options: {
      chart: { id: 'sales-chart' },
      xaxis: { categories: ['Sales', 'Purchases', 'Products', 'Users'] },
    },
    series: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const resSales = await fetch('/api/sales');
        const salesData = await resSales.json();

        const resPurchases = await fetch('/api/purchases');
        const purchaseData = await resPurchases.json();

        const resProducts = await fetch('/api/products');
        const productsData = await resProducts.json();

        const resUsers = await fetch('/api/users');
        const usersData = await resUsers.json();

        const salesTotal = salesData.reduce((sum, s) => sum + s.total, 0);

        setTotalSales(salesTotal);
        setTotalPurchases(purchaseData.length);
        setProducts(productsData.length);
        setUsers(usersData.length);

        setChartData({
          ...chartData,
          series: [
            {
              name: 'Stats',
              data: [salesTotal, purchaseData.length, productsData.length, usersData.length],
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="ml-64 w-full min-h-screen bg-gray-50 p-6">
        <h1 className="text-3xl font-bold mb-6">📊 Admin Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-4 rounded shadow border">
            <h2 className="text-sm text-gray-500">Total Sales</h2>
            <p className="text-2xl font-bold text-green-600">Rs {totalSales}</p>
          </div>
          <div className="bg-white p-4 rounded shadow border">
            <h2 className="text-sm text-gray-500">Purchases</h2>
            <p className="text-2xl font-bold">{totalPurchases}</p>
          </div>
          <div className="bg-white p-4 rounded shadow border">
            <h2 className="text-sm text-gray-500">Products</h2>
            <p className="text-2xl font-bold">{products}</p>
          </div>
          <div className="bg-white p-4 rounded shadow border">
            <h2 className="text-sm text-gray-500">Users</h2>
            <p className="text-2xl font-bold">{users}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow border">
          <h2 className="text-lg font-semibold mb-4">📈 Sales Overview</h2>
          {chartData.series.length > 0 && (
            <Chart
              options={chartData.options}
              series={chartData.series}
              type="bar"
              height={350}
            />
          )}
        </div>
      </main>
    </div>
  );
}
