'use client';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const summaryData = [
  { id: 1, title: 'Total Sales', value: '$150,230', icon: '💰', bg: 'bg-green-500' },
  { id: 2, title: 'Total Products', value: '320', icon: '📦', bg: 'bg-blue-500' },
  { id: 3, title: 'Profit', value: '$75,900', icon: '📈', bg: 'bg-purple-500' },
  { id: 4, title: 'Expenses', value: '$35,000', icon: '💸', bg: 'bg-red-500' },
];

const salesData = [
  { month: 'Jan', sales: 4000, profit: 2400, expenses: 2400 },
  { month: 'Feb', sales: 3000, profit: 1398, expenses: 2210 },
  { month: 'Mar', sales: 2000, profit: 9800, expenses: 2290 },
  { month: 'Apr', sales: 2780, profit: 3908, expenses: 2000 },
  { month: 'May', sales: 1890, profit: 4800, expenses: 2181 },
  { month: 'Jun', sales: 2390, profit: 3800, expenses: 2500 },
  { month: 'Jul', sales: 3490, profit: 4300, expenses: 2100 },
];

export default function DashboardContent() {
  return (
    <div className="flex-1 p-8 bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-800">Dashboard</h2>
        <div className="flex items-center space-x-4">
          <div className="text-gray-700">Hello, Admin</div>
          <img
            src="https://i.pravatar.cc/40"
            alt="User Avatar"
            className="w-10 h-10 rounded-full"
          />
        </div>
      </header>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        {summaryData.map(({ id, title, value, icon, bg }) => (
          <div key={id} className={`flex items-center p-4 rounded-lg shadow ${bg} text-white`}>
            <div className="text-4xl mr-4">{icon}</div>
            <div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-2xl font-bold">{value}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Sales Chart */}
      <section className="bg-white p-6 rounded-lg shadow mb-10">
        <h3 className="text-xl font-semibold mb-4">Sales & Profit Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="sales" stroke="#4F46E5" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="profit" stroke="#10B981" />
            <Line type="monotone" dataKey="expenses" stroke="#EF4444" />
          </LineChart>
        </ResponsiveContainer>
      </section>

      {/* Recent Transactions Table */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-2 px-4">Date</th>
              <th className="py-2 px-4">Product</th>
              <th className="py-2 px-4">Amount</th>
              <th className="py-2 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200 hover:bg-gray-50">
              <td className="py-2 px-4">2025-06-30</td>
              <td className="py-2 px-4">Wireless Mouse</td>
              <td className="py-2 px-4">$25.00</td>
              <td className="py-2 px-4 text-green-600 font-semibold">Completed</td>
            </tr>
            <tr className="border-b border-gray-200 hover:bg-gray-50">
              <td className="py-2 px-4">2025-06-29</td>
              <td className="py-2 px-4">USB-C Hub</td>
              <td className="py-2 px-4">$45.00</td>
              <td className="py-2 px-4 text-yellow-600 font-semibold">Pending</td>
            </tr>
            <tr className="border-b border-gray-200 hover:bg-gray-50">
              <td className="py-2 px-4">2025-06-28</td>
              <td className="py-2 px-4">Mechanical Keyboard</td>
              <td className="py-2 px-4">$120.00</td>
              <td className="py-2 px-4 text-red-600 font-semibold">Cancelled</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
