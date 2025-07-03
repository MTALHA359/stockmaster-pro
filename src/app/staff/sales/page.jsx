'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import StaffSidebar from '../components/StaffSidebar';

export default function SalesPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data);
  };

  const handleAddToCart = (product) => {
    const exists = cart.find(item => item._id === product._id);
    if (exists) {
      const updatedCart = cart.map(item =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const handleQuantityChange = (id, delta) => {
    setCart(prev =>
      prev.map(item =>
        item._id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.quantity * item.salePrice,
    0
  );

  const handleSale = async () => {
    try {
      const formattedCart = cart.map(item => ({
        sku: item.sku,
        name: item.name,
        price: item.salePrice,
        quantity: item.quantity
      }));

      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: formattedCart, total: totalAmount })
      });

      if (!res.ok) throw new Error('Sale failed');

      setCart([]);
      toast.success('Sale completed & stock updated!');
      fetchProducts(); // Refresh stock
    } catch (err) {
      toast.error(err.message || 'Error processing sale');
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById('bill');
    const newWindow = window.open('', '', 'width=800,height=600');
    newWindow.document.write('<html><head><title>Invoice</title></head><body>');
    newWindow.document.write(printContent.innerHTML);
    newWindow.document.write('</body></html>');
    newWindow.print();
    newWindow.close();
  };

  return (
    <div className="flex">
      <StaffSidebar />
      <main className="ml-64 p-6 w-full bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">💼 Sales</h1>

        <input
          type="text"
          placeholder="Search product by name or barcode..."
          className="w-full mb-4 px-4 py-2 border rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-semibold mb-2">Available Products</h2>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {products
                .filter(
                  (p) =>
                    p.name.toLowerCase().includes(search.toLowerCase()) ||
                    (p.barcode && p.barcode.includes(search))
                )
                .map((p) => (
                  <div
                    key={p._id}
                    className="bg-white p-3 border rounded flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-sm text-gray-500">
                        Rs {p.salePrice} | Stock: {p.stock}
                      </p>
                    </div>
                    <button
                      onClick={() => handleAddToCart(p)}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Add
                    </button>
                  </div>
                ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Cart</h2>
            <div className="bg-white p-4 rounded border shadow">
              {cart.length === 0 ? (
                <p>No items in cart.</p>
              ) : (
                <div>
                  {cart.map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between items-center mb-3"
                    >
                      <div>
                        {item.name} x {item.quantity}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          className="px-2 py-1 bg-gray-300 rounded"
                          onClick={() => handleQuantityChange(item._id, -1)}
                        >
                          -
                        </button>
                        <button
                          className="px-2 py-1 bg-gray-300 rounded"
                          onClick={() => handleQuantityChange(item._id, 1)}
                        >
                          +
                        </button>
                        <span>Rs {item.salePrice * item.quantity}</span>
                      </div>
                    </div>
                  ))}
                  <hr className="my-4" />
                  <p className="text-right font-semibold">
                    Total: Rs {totalAmount}
                  </p>
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={handleSale}
                      className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                      Confirm Sale
                    </button>
                    <button
                      onClick={handlePrint}
                      className="bg-gray-800 text-white px-4 py-2 rounded"
                    >
                      Print Bill
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div id="bill" className="hidden print:block mt-8">
              <h2 className="text-xl font-bold">📟 Sales Invoice</h2>
              <ul className="mt-4 text-sm">
                {cart.map((item) => (
                  <li key={item._id}>
                    {item.name} x {item.quantity} = Rs {item.salePrice * item.quantity}
                  </li>
                ))}
              </ul>
              <p className="mt-4 font-semibold">Total: Rs {totalAmount}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
