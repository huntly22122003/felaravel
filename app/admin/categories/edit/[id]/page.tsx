'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getCategory, updateCategory, getCategories } from '@/services/adminApi';

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);

  const [form, setForm] = useState({
    name: '',
    parent_id: '',
    sort_order: 0,
    is_home: false,
    is_active: true,
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getCategory(id), getCategories()])
      .then(([cat, cats]) => {
        setForm({
          name: cat.name || '',
          parent_id: cat.parent_id || '',
          sort_order: cat.sort_order || 0,
          is_home: cat.is_home || false,
          is_active: cat.is_active !== undefined ? cat.is_active : true,
        });
        setCategories(cats || []);
      })
      .catch(() => setError('Lỗi tải danh mục'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const data = {
        ...form,
        parent_id: form.parent_id ? parseInt(form.parent_id) : null,
        sort_order: parseInt(form.sort_order as any) || 0,
      };
      await updateCategory(id, data);
      router.push('/admin/categories');
    } catch (err: any) {
      setError(err.message || 'Lỗi cập nhật danh mục');
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div style={{ padding: 20, maxWidth: 600 }}>
      <h1>Sửa danh mục</h1>
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
            {categories.filter(c => c.id !== id).map((cat) => (
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
          Cập nhật
        </button>
      </form>
    </div>
  );
}