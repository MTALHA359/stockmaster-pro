'use client';

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import ManagerSidebar from "../components/ManagerSidebar";

export default function CreateSalePage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

  const addToCart = (product) => {
    const exists = cart.find(item => item._id === product._id);
    if (exists) {
      setCart(cart.map(item =>
        item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }

    // Subtract from stock immediately
    setProducts(products.map(p =>
      p._id === product._id ? { ...p, stock: p.stock - 1 } : p
    ));
  };

  const changeQuantity = (id, delta) => {
    setCart(cart =>
      cart.map(item =>
        item._id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const generateBill = () => {
    const total = cart.reduce((sum, item) => sum + item.salePrice * item.quantity, 0);
    return `Total Bill: Rs ${total}`;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);
      setProducts(json.map((p, i) => ({
        _id: i.toString(),
        name: p.name,
        salePrice: Number(p.salePrice),
        stock: Number(p.stock),
        category: p.category || 'Uncategorized',
      })));
    };
    reader.readAsArrayBuffer(file);
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex">
      <ManagerSidebar />
      <main className="ml-64 w-full min-h-screen bg-gray-50 p-6">
        <h1 className="text-2xl font-bold mb-4">🛒 Create Sale</h1>

        <div className="mb-6 flex items-center gap-4">
          <input
            type="text"
            placeholder="🔍 Search product"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="border p-2 rounded w-1/2"
          />
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileUpload}
            className="border p-2 rounded"
          />
        </div>

        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">📦 Products</h2>
              <ul className="space-y-2 max-h-[500px] overflow-y-auto">
                {filteredProducts.map(p => (
                  <li key={p._id} className="flex justify-between items-center bg-white p-2 border rounded">
                    <span>{p.name} - Rs {p.salePrice} - Stock: {p.stock}</span>
                    <button
                      onClick={() => addToCart(p)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                      disabled={p.stock <= 0}
                    >
                      Add
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">🛒 Cart</h2>
              <ul className="space-y-2">
                {cart.map((item, idx) => (
                  <li key={idx} className="flex justify-between items-center bg-white p-2 border rounded">
                    <span>{item.name} x {item.quantity}</span>
                    <div className="flex items-center space-x-2">
                      <button onClick={() => changeQuantity(item._id, -1)} className="px-2 bg-gray-300 rounded">-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => changeQuantity(item._id, 1)} className="px-2 bg-gray-300 rounded">+</button>
                    </div>
                    <span className="font-semibold">Rs {item.salePrice * item.quantity}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 font-semibold text-right text-lg">
                {generateBill()}
              </div>
              <div className="mt-4 text-right">
                <button
                  onClick={() => window.print()}
                  className="bg-green-600 text-white px-4 py-2 rounded shadow"
                >
                  🖨️ Print Bill
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
