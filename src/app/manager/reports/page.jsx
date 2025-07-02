'use client';

import { useEffect, useState } from 'react';

export default function ReportPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await fetch('/api/sales');
        const data = await res.json();
        setSales(data.reverse());
      } catch (err) {
        console.error('Failed to fetch sales:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">📄 Sales Report</h1>
        <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 print:hidden"
        >
          🖨️ Print Report
        </button>
      </div>

      {loading ? (
        <p>Loading sales data...</p>
      ) : (
        <div className="overflow-auto rounded-lg shadow">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-200 text-gray-600 text-sm">
              <tr>
                <th className="px-4 py-2">Invoice ID</th>
                <th className="px-4 py-2">Customer</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Items</th>
                <th className="px-4 py-2">Total Items</th>
                <th className="px-4 py-2">Total Amount</th>
                <th className="px-4 py-2">Payment</th>
                <th className="px-4 py-2">Sold By</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-800">
              {sales.map((sale, idx) => {
                const totalItems = sale.items.reduce((sum, i) => sum + i.quantity, 0);
                const totalAmount = sale.items.reduce((sum, i) => sum + i.quantity * i.salePrice, 0);

                return (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 font-semibold text-blue-700">{sale.invoiceId || `INV-${idx + 1}`}</td>
                    <td className="px-4 py-2">{sale.customer || 'Walk-in'}</td>
                    <td className="px-4 py-2">{new Date(sale.date).toLocaleDateString()}</td>
                    <td className="px-4 py-2">
                      <ul className="list-disc list-inside">
                        {sale.items.map((item, i) => (
                          <li key={i}>
                            {item.name} × {item.quantity} = Rs {item.quantity * item.salePrice}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 py-2 text-center">{totalItems}</td>
                    <td className="px-4 py-2 font-semibold text-green-600">Rs {totalAmount}</td>
                    <td className="px-4 py-2">{sale.paymentMethod || 'Cash'}</td>
                    <td className="px-4 py-2">{sale.staff || 'Admin'}</td>
                  </tr>
                );
              })}
              {sales.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-500">
                    No sales recorded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
