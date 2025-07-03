'use client';
import { useEffect, useState } from 'react';
import StaffSidebar from '../components/StaffSidebar';
import { useRouter } from 'next/navigation';

export default function StaffSalesPage() {
  const [sales, setSales] = useState([]);
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [amount, setAmount] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchSales();
  }, []);

  async function fetchSales() {
    const res = await fetch('/api/staff/sales');
    const data = await res.json();
    setSales(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch('/api/staff/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product, quantity, amount }),
    });

    if (res.ok) {
      setProduct('');
      setQuantity('');
      setAmount('');
      fetchSales();
    }
  }

  const filteredSales = sales.filter((sale) =>
    sale.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <StaffSidebar>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Sales (Staff)</h1>

        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Product"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border p-2 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Sale
          </button>
        </form>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Product</th>
                <th className="px-4 py-2">Quantity</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale) => (
                <tr key={sale._id} className="border-t">
                  <td className="px-4 py-2">{sale.product}</td>
                  <td className="px-4 py-2">{sale.quantity}</td>
                  <td className="px-4 py-2">Rs {sale.amount}</td>
                  <td className="px-4 py-2">{new Date(sale.date).toLocaleString()}</td>
                </tr>
              ))}
              {filteredSales.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center p-4 text-gray-500">
                    No sales found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </StaffSidebar>
  );
}
