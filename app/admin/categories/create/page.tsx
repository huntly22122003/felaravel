'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createCategory, getCategories } from '@/services/adminApi';

export default function CreateCategoryPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    parent_id: '',
    sort_order: 0,
    is_home: false,
    is_active: true,
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const data = {
        ...form,
        parent_id: form.parent_id ? parseInt(form.parent_id) : null, // 👈 Quan trọng
        sort_order: parseInt(form.sort_order as any) || 0,
      };
      await createCategory(data);
      router.push('/admin/categories');
    } catch (err: any) {
      setError(err.message || 'Lỗi tạo danh mục');
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 600 }}>
      <h1>Thêm danh mục</h1>
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Tên danh mục</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
            required
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Danh mục cha</label>
          <select
            value={form.parent_id}
            onChange={(e) => setForm({ ...form, parent_id: e.target.value })}
            style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
          >
            <option value="">Không có</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Thứ tự</label>
          <input
            type="number"
            value={form.sort_order}
            onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
            style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>
            <input
              type="checkbox"
              checked={form.is_home}
              onChange={(e) => setForm({ ...form, is_home: e.target.checked })}
            />
            Hiển thị trên trang chủ
          </label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
            />
            Kích hoạt
          </label>
        </div>
        <button type="submit" style={{ background: '#4CAF50', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          Lưu
        </button>
      </form>
    </div>
  );
}