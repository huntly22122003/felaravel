'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUser } from '@/services/adminApi';

export default function CreateUserPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    is_admin: false,
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await createUser(form);
      router.push('/admin/users');
    } catch (err: any) {
      setError(err.message || 'Lỗi tạo user');
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 500 }}>
      <h1>Thêm user mới</h1>
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Họ tên</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
            required
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Username</label>
          <input
            type="text"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
            required
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
            required
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Mật khẩu</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
            required
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>
            <input
              type="checkbox"
              checked={form.is_admin}
              onChange={(e) => setForm({ ...form, is_admin: e.target.checked })}
            />
            Quyền admin
          </label>
        </div>
        <button type="submit" style={{ background: '#4CAF50', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          Lưu
        </button>
      </form>
    </div>
  );
}