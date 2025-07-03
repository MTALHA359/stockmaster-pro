// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import AdminSidebar from '../../components/AdminSidebar';
// export default function AddPurchasePage() {
//   const [formData, setFormData] = useState({
//     product: '',
//     quantity: '',
//     price: '',
//     address: '',
//     contact: '',
//     shopName: '',
//   });

//   const [file, setFile] = useState(null);
//   const router = useRouter();

//   const handleManualSubmit = async (e) => {
//     e.preventDefault();

//     await fetch('/api/purchases', {
//       method: 'POST',
//       body: JSON.stringify({
//         ...formData,
//         date: new Date().toISOString().split('T')[0],
//       }),
//       headers: { 'Content-Type': 'application/json' },
//     });

//     router.push('/admin/purchases');
//   };

//   const handleFileUpload = async (e) => {
//     e.preventDefault();
//     const form = new FormData();
//     form.append('file', file);

//     await fetch('/api/purchases/upload', {
//       method: 'POST',
//       body: form,
//     });

//     router.push('/admin/purchases');
//   };

//   return (
//     <div className="flex min-h-screen">
//       <AdminSidebar />

//       <main className="flex-1 p-6 bg-gray-50 max-w-3xl mx-auto">
//         <h2 className="text-2xl font-bold mb-6">Add Purchase</h2>

//         {/* Manual Entry Form */}
//         <form onSubmit={handleManualSubmit} className="space-y-4 mb-10 bg-white p-6 rounded shadow">
//           <h3 className="text-lg font-semibold mb-2">Manual Entry</h3>

//           <input
//             type="text"
//             placeholder="Product Name"
//             value={formData.product}
//             onChange={(e) => setFormData({ ...formData, product: e.target.value })}
//             className="w-full border p-2 rounded"
//             required
//           />

//           <input
//             type="number"
//             placeholder="Quantity"
//             value={formData.quantity}
//             onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
//             className="w-full border p-2 rounded"
//             required
//           />

//           <input
//             type="number"
//             placeholder="Purchased Price"
//             value={formData.price}
//             onChange={(e) => setFormData({ ...formData, price: e.target.value })}
//             className="w-full border p-2 rounded"
//             required
//           />

//           <input
//             type="text"
//             placeholder="Shop Name"
//             value={formData.shopName}
//             onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
//             className="w-full border p-2 rounded"
//             required
//           />

//           <input
//             type="text"
//             placeholder="Address"
//             value={formData.address}
//             onChange={(e) => setFormData({ ...formData, address: e.target.value })}
//             className="w-full border p-2 rounded"
//             required
//           />

//           <input
//             type="tel"
//             placeholder="Contact No"
//             value={formData.contact}
//             onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
//             className="w-full border p-2 rounded"
//             required
//           />

//           <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
//             Submit Purchase
//           </button>
//         </form>

//         {/* Excel/PDF Upload */}
//         <form onSubmit={handleFileUpload} className="space-y-4 bg-white p-6 rounded shadow">
//           <h3 className="text-lg font-semibold mb-2">Upload Excel or PDF</h3>
//           <input
//             type="file"
//             accept=".xlsx,.xls,.pdf"
//             onChange={(e) => setFile(e.target.files[0])}
//             className="w-full border p-2 rounded"
//             required
//           />
//           <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
//             Upload File
//           </button>
//         </form>
//       </main>
//     </div>
//   );
// }

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';
import AdminSidebar from '../../components/AdminSidebar';
export default function AddPurchasePage() {
  const [formData, setFormData] = useState({
    product: '',
    quantity: '',
    price: '',
    shopName: '',
    address: '',
    contact: '',
  });
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  // Manual form change
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  // Manual form submit
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!formData.product || !formData.quantity || !formData.price) {
      setError('Product, quantity, and price are required.');
      return;
    }

    try {
      const res = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to save purchase.');
        return;
      }
      router.push('/admin/purchases');
    } catch {
      setError('Something went wrong.');
    }
  }

  // Handle file upload (Excel or PDF)
  async function handleFileUpload(e) {
    setError('');
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      if (file.type === 'application/pdf') {
        // Upload PDF to server for parsing
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/purchases/upload-pdf', {
          method: 'POST',
          body: formData,
        });
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || 'Failed to process PDF.');
          setUploading(false);
          return;
        }
        router.push('/admin/purchases');
      } else if (
        file.type ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.name.endsWith('.xlsx') ||
        file.name.endsWith('.xls')
      ) {
        // Parse Excel client-side
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Validate and map data to expected keys (adjust these keys to your Excel columns)
        const purchases = jsonData.map((row) => ({
          product: row['Product'] || '',
          quantity: Number(row['Quantity'] || 0),
          price: Number(row['Price'] || 0),
          shopName: row['Shop'] || '',
          address: row['Address'] || '',
          contact: row['Contact'] || '',
        }));

        // Send purchases array to API
        const res = await fetch('/api/purchases/bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ purchases }),
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.error || 'Failed to save purchases.');
          setUploading(false);
          return;
        }

        router.push('/admin/purchases');
      } else {
        setError('Only PDF or Excel files are supported.');
      }
    } catch (err) {
      setError('Error processing file.');
      console.error(err);
    }
    setUploading(false);
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-6 bg-gray-50 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Add Purchase</h1>

        {error && (
          <div className="mb-4 p-2 bg-red-200 text-red-800 rounded">{error}</div>
        )}

        {/* Manual form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white p-6 rounded shadow mb-10"
        >
          <div>
            <label className="block mb-1 font-semibold">Product Name *</label>
            <input
              type="text"
              name="product"
              value={formData.product}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
              placeholder="Product name"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Quantity *</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              min="1"
              className="w-full border p-2 rounded"
              placeholder="Quantity"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Price *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full border p-2 rounded"
              placeholder="Purchase price"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Shop Name</label>
            <input
              type="text"
              name="shopName"
              value={formData.shopName}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Shop name"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Address"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Contact Number</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Contact number"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={uploading}
          >
            Save Purchase
          </button>
        </form>

        {/* File Upload */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Upload Excel or PDF</h2>
          <input
            type="file"
            accept=".xlsx,.xls,application/pdf"
            onChange={handleFileUpload}
            disabled={uploading}
          />
          {uploading && <p className="mt-2 text-blue-600">Uploading and processing...</p>}
        </div>
      </main>
    </div>
  );
}
