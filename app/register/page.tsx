// D:\TongLaravel\frontend\app\register\page.tsx
'use client';

import { useState } from 'react';
import { register } from '@/services/api';

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullname: '',
    email: '',
    username: '',
    password: '',
    phone: '',
    address: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await register(form);
      setMessage('Đăng ký thành công: ' + JSON.stringify(res));
    } catch (err: any) {
      setMessage('Lỗi: ' + err.message);
    }
  };

  return (
    <div className="max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-4">Đăng ký</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="fullname" placeholder="Họ tên" onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="username" placeholder="Tên đăng nhập" onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="password" type="password" placeholder="Mật khẩu" onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="phone" placeholder="Điện thoại" onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="address" placeholder="Địa chỉ" onChange={handleChange} className="w-full border p-2 rounded" />
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">
          Đăng ký
        </button>
      </form>
      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  );
}