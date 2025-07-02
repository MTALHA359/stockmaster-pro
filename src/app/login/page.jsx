'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();

    if (email && password && role) {
      // Optional: store role in localStorage or cookie
      localStorage.setItem('userRole', role);
      router.push(`/${role}/dashboard`);
    } else {
      alert('Please fill all fields');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 border rounded shadow">
      <h2 className="text-2xl mb-4 font-bold">StockMaster Pro Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="staff">Staff</option>
          <option value="manager">Manager</option>
        </select>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}
