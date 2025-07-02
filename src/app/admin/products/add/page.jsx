
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import AdminSidebar from '../../components/AdminSidebar';
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

export default function AddProductPage() {
  const [form, setForm] = useState({
    name: '',
    sku: '',
    quantity: '',
    price: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState('');
  const [parsedProducts, setParsedProducts] = useState([]);
  const router = useRouter();

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.name || !form.sku || !form.quantity || !form.price) {
      setError('Please fill all fields.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          sku: form.sku,
          quantity: Number(form.quantity),
          price: Number(form.price),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to add product.');
      } else {
        router.push('/admin/products');
      }
    } catch {
      setError('Failed to add product.');
    } finally {
      setLoading(false);
    }
  }

  // Handle file upload (Excel or PDF)
  async function handleFileUpload(e) {
    setFileError('');
    setParsedProducts([]);
    const file = e.target.files[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop().toLowerCase();

    if (fileExt === 'xls' || fileExt === 'xlsx') {
      // Excel parsing
      try {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Expecting Excel columns: name, sku, quantity, price
        const products = jsonData.map((item) => ({
          name: item.name || '',
          sku: item.sku || '',
          quantity: Number(item.quantity) || 0,
          price: Number(item.price) || 0,
        })).filter(p => p.name && p.sku);

        if (products.length === 0) {
          setFileError('No valid product data found in Excel.');
          return;
        }
        setParsedProducts(products);
      } catch (err) {
        setFileError('Error parsing Excel file.');
      }
    } else if (fileExt === 'pdf') {
      // PDF parsing - basic text extraction
      try {
        const data = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data }).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map(item => item.str);
          fullText += strings.join(' ') + '\n';
        }

        // Very basic parsing example:
        // Assume each line has: name sku quantity price (space separated)
        const lines = fullText.split('\n').map(l => l.trim()).filter(Boolean);
        const products = lines.map(line => {
          const parts = line.split(/\s+/);
          if (parts.length < 4) return null;
          return {
            name: parts[0],
            sku: parts[1],
            quantity: Number(parts[2]),
            price: Number(parts[3]),
          };
        }).filter(Boolean);

        if (products.length === 0) {
          setFileError('No valid product data found in PDF.');
          return;
        }
        setParsedProducts(products);
      } catch (err) {
        setFileError('Error parsing PDF file.');
      }
    } else {
      setFileError('Unsupported file type. Please upload Excel (.xls, .xlsx) or PDF.');
    }
  }

  // Upload all parsed products to backend one by one
  async function handleBulkUpload() {
    if (parsedProducts.length === 0) return;
    setLoading(true);
    setError('');

    try {
      for (const product of parsedProducts) {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(product),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to upload one or more products');
        }
      }
      router.push('/admin/products');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 bg-gray-100 max-w-3xl mx-auto">
        <h2 className="text-3xl font-semibold mb-6">Add New Product</h2>

        {/* Manual Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow mb-10"
        >
          {error && <div className="mb-4 text-red-600 font-semibold">{error}</div>}
          <div className="mb-4">
            <label htmlFor="name" className="block font-medium mb-1">Product Name</label>
            <input
              type="text" name="name" id="name" value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="sku" className="block font-medium mb-1">SKU</label>
            <input
              type="text" name="sku" id="sku" value={form.sku}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="quantity" className="block font-medium mb-1">Quantity</label>
            <input
              type="number" name="quantity" id="quantity" value={form.quantity}
              onChange={handleChange} min={0}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="price" className="block font-medium mb-1">Price ($)</label>
            <input
              type="number" step="0.01" name="price" id="price" value={form.price}
              onChange={handleChange} min={0}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Add Product'}
          </button>
        </form>

        {/* File Upload */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">Upload Products via Excel or PDF</h3>
          <input
            type="file"
            accept=".xls,.xlsx,.pdf"
            onChange={handleFileUpload}
            className="mb-4"
          />
          {fileError && <p className="text-red-600 mb-4">{fileError}</p>}

          {parsedProducts.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Preview ({parsedProducts.length} products):</h4>
              <ul className="mb-4 max-h-48 overflow-auto border border-gray-300 rounded p-2">
                {parsedProducts.map((p, i) => (
                  <li key={i} className="text-sm">
                    <strong>{p.name}</strong> | SKU: {p.sku} | Qty: {p.quantity} | Price: ${p.price}
                  </li>
                ))}
              </ul>
              <button
                onClick={handleBulkUpload}
                disabled={loading}
                className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Uploading...' : 'Upload All Products'}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
