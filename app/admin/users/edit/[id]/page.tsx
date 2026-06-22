'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getUser, updateUser } from '@/services/adminApi';

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);

  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '', // 👈 thêm password vào state
    is_admin: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getUser(id)
      .then(data => {
        setForm({
          name: data.name || '',
          username: data.username || '',
          email: data.email || '',
          password: '', // 👈 để trống, không lấy từ API
          is_admin: data.is_admin || false,
        });
      })
      .catch(() => setError('Lỗi tải user'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      // Tạo object data để gửi lên
      const data: any = {
        name: form.name,
        username: form.username,
        email: form.email,
        is_admin: form.is_admin,
      };
      // Nếu có nhập password mới thì thêm vào
      if (form.password) {
        data.password = form.password;
      }
      await updateUser(id, data);
      router.push('/admin/users');
    } catch (err: any) {
      setError(err.message || 'Lỗi cập nhật user');
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div style={{ padding: 20, maxWidth: 500 }}>
      <h1>Sửa user</h1>
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
          <label style={{ display: 'block', fontWeight: 'bold' }}>Mật khẩu (để trống nếu không đổi)</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
            placeholder="Để trống nếu không đổi"
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
          Cập nhật
        </button>
      </form>
    </div>
  );
}