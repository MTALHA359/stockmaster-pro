// 'use client';
// import { useEffect, useState } from 'react';
// import StaffSidebar from '../components/StaffSidebar';
// import { useRouter } from 'next/navigation';

// export default function StaffSalesPage() {
//   const [sales, setSales] = useState([]);
//   const [product, setProduct] = useState('');
//   const [quantity, setQuantity] = useState('');
//   const [amount, setAmount] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const router = useRouter();

//   useEffect(() => {
//     fetchSales();
//   }, []);

//   async function fetchSales() {
//     const res = await fetch('/api/staff/sales');
//     const data = await res.json();
//     setSales(data);
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();

//     const res = await fetch('/api/staff/sales', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ product, quantity, amount }),
//     });

//     if (res.ok) {
//       setProduct('');
//       setQuantity('');
//       setAmount('');
//       fetchSales();
//     }
//   }

//   const filteredSales = sales.filter((sale) =>
//     sale.product.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <StaffSidebar>
//       <div className="p-6 max-w-4xl mx-auto">
//         <h1 className="text-2xl font-bold mb-4">Sales (Staff)</h1>

//         <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
//           <div className="grid grid-cols-3 gap-4">
//             <input
//               type="text"
//               placeholder="Product"
//               value={product}
//               onChange={(e) => setProduct(e.target.value)}
//               className="border p-2 rounded"
//               required
//             />
//             <input
//               type="number"
//               placeholder="Quantity"
//               value={quantity}
//               onChange={(e) => setQuantity(e.target.value)}
//               className="border p-2 rounded"
//               required
//             />
//             <input
//               type="number"
//               placeholder="Amount"
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//               className="border p-2 rounded"
//               required
//             />
//           </div>
//           <button
//             type="submit"
//             className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//           >
//             Add Sale
//           </button>
//         </form>

//         <div className="mb-4">
//           <input
//             type="text"
//             placeholder="Search by product..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full border p-2 rounded"
//           />
//         </div>

//         <div className="bg-white rounded shadow overflow-x-auto">
//           <table className="min-w-full text-sm text-left">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="px-4 py-2">Product</th>
//                 <th className="px-4 py-2">Quantity</th>
//                 <th className="px-4 py-2">Amount</th>
//                 <th className="px-4 py-2">Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredSales.map((sale) => (
//                 <tr key={sale._id} className="border-t">
//                   <td className="px-4 py-2">{sale.product}</td>
//                   <td className="px-4 py-2">{sale.quantity}</td>
//                   <td className="px-4 py-2">Rs {sale.amount}</td>
//                   <td className="px-4 py-2">{new Date(sale.date).toLocaleString()}</td>
//                 </tr>
//               ))}
//               {filteredSales.length === 0 && (
//                 <tr>
//                   <td colSpan="4" className="text-center p-4 text-gray-500">
//                     No sales found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </StaffSidebar>
//   );
// }

'use client';

import { useEffect, useState } from 'react';

export default function StaffSalesPage() {
  const [sales, setSales] = useState([]);
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);

  const [totalSalesCount, setTotalSalesCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [topProducts, setTopProducts] = useState([]);

  // ✅ Fetch sales data
  const fetchSales = async () => {
    try {
      const res = await fetch('/api/staff/sales');
      if (!res.ok) throw new Error('Failed to fetch sales');
      const data = await res.json();
      setSales(data.sales || []);

      // 📊 Calculate stats
      setTotalSalesCount(data.sales.length);
      setTotalRevenue(
        data.sales.reduce((sum, s) => sum + (s.quantity * s.price), 0)
      );

      // 📊 Top products
      const productMap = {};
      data.sales.forEach(s => {
        productMap[s.productName] = (productMap[s.productName] || 0) + s.quantity;
      });
      const sorted = Object.entries(productMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
      setTopProducts(sorted);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  // ✅ Submit sale
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/staff/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName,
          quantity: Number(quantity),
          price: Number(price),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || 'Failed to add sale');
      } else {
        setProductName('');
        setQuantity(1);
        setPrice('');
        fetchSales(); // Refresh data
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">📊 Staff Sales Dashboard</h1>

      {/* Add Sale Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-4 border rounded-lg shadow"
      >
        <h2 className="font-semibold">➕ Add New Sale</h2>
        <input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
          className="border p-2 rounded w-full"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
          min="1"
          className="border p-2 rounded w-full"
        />
        <input
          type="number"
          placeholder="Price per unit"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          min="0"
          className="border p-2 rounded w-full"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Add Sale'}
        </button>
      </form>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-green-100 rounded shadow">
          <h3 className="font-semibold">Total Sales</h3>
          <p>{totalSalesCount}</p>
        </div>
        <div className="p-4 bg-yellow-100 rounded shadow">
          <h3 className="font-semibold">Total Revenue</h3>
          <p>${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-purple-100 rounded shadow">
          <h3 className="font-semibold">Top Products</h3>
          <ul className="list-disc ml-4">
            {topProducts.map(([name, qty], idx) => (
              <li key={idx}>
                {name} ({qty})
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Sales History */}
      <div>
        <h2 className="text-xl font-semibold mb-2">📜 Sales History</h2>
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Product</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((s) => (
              <tr key={s._id}>
                <td className="border p-2">{s.productName}</td>
                <td className="border p-2">{s.quantity}</td>
                <td className="border p-2">${s.price.toFixed(2)}</td>
                <td className="border p-2">${(s.quantity * s.price).toFixed(2)}</td>
                <td className="border p-2">
                  {new Date(s.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
            {sales.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  No sales yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
