'use client';
import { useState, useEffect, useRef } from 'react';
import ManagerSidebar from '../components/ManagerSidebar'; // Adjust the path as needed

export default function ManagerSalePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [productResults, setProductResults] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]); // { productId, name, price, stock, quantity }
  const debounceTimeout = useRef(null);

  // Search products from API
  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    if (searchTerm.trim() === '') {
      setProductResults([]);
      return;
    }
    debounceTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(searchTerm)}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setProductResults(data);
      } catch (error) {
        console.error(error);
        setProductResults([]);
      }
    }, 300);
    return () => clearTimeout(debounceTimeout.current);
  }, [searchTerm]);

  // Add product to selected items list (if not already added)
  function addProduct(product) {
    if (selectedItems.find(item => item.productId === product._id)) return;
    setSelectedItems([
      ...selectedItems,
      { productId: product._id, name: product.name, price: product.price, stock: product.stock, quantity: 1 }
    ]);
  }

  // Update quantity for a selected product
  function updateQuantity(productId, newQuantity) {
    setSelectedItems(current =>
      current.map(item =>
        item.productId === productId
          ? { ...item, quantity: Math.min(Math.max(newQuantity, 1), item.stock) }
          : item
      )
    );
  }

  // Calculate total price of all selected items
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Submit sale: send to backend and update stocks
  async function handleSubmit() {
    if (selectedItems.length === 0) {
      alert('Select at least one product to sell.');
      return;
    }

    try {
      const res = await fetch('/api/manager/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: selectedItems }),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(`Error: ${data.error}`);
        return;
      }

      alert('Sale successful!');
      setSelectedItems([]);
      setSearchTerm('');
      setProductResults([]);
    } catch (error) {
      alert('Failed to submit sale');
      console.error(error);
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ManagerSidebar />

      <main className="flex-grow p-6">
        <h1 className="text-2xl font-bold mb-4">Manager Sale Page</h1>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search products..."
          className="border p-2 mb-4 w-full max-w-lg"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />

        {/* Product Search Results */}
        <ul className="border mb-4 max-h-40 overflow-auto max-w-lg">
          {productResults.length === 0 && searchTerm && <li className="p-2">No products found.</li>}
          {productResults.map(product => (
            <li
              key={product._id}
              className="p-2 cursor-pointer hover:bg-gray-100 flex justify-between max-w-lg"
              onClick={() => addProduct(product)}
            >
              <span>{product.name}</span>
              <span>Stock: {product.stock}</span>
            </li>
          ))}
        </ul>

        {/* Selected Items Table */}
        {selectedItems.length > 0 && (
          <table className="w-full max-w-lg mb-4 border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Product</th>
                <th className="border border-gray-300 p-2">Price</th>
                <th className="border border-gray-300 p-2">Stock</th>
                <th className="border border-gray-300 p-2">Quantity</th>
                <th className="border border-gray-300 p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {selectedItems.map(item => (
                <tr key={item.productId}>
                  <td className="border border-gray-300 p-2">{item.name}</td>
                  <td className="border border-gray-300 p-2">${item.price.toFixed(2)}</td>
                  <td className="border border-gray-300 p-2">{item.stock}</td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="number"
                      min={1}
                      max={item.stock}
                      value={item.quantity}
                      onChange={e => updateQuantity(item.productId, parseInt(e.target.value) || 1)}
                      className="w-16 border p-1"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="4" className="text-right font-bold p-2">Total:</td>
                <td className="font-bold p-2">${totalPrice.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={selectedItems.length === 0}
        >
          Submit Sale
        </button>
      </main>
    </div>
  );
}
