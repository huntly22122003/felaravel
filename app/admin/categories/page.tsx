'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCategories, deleteCategory } from '@/services/adminApi';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa danh mục này?')) return;
    try {
      await deleteCategory(id);
      setCategories(categories.filter(c => c.id !== id));
    } catch (err) {
      alert('Xóa thất bại');
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Đang tải...</div>;

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Quản lý danh mục</h1>
        <Link href="/admin/categories/create">
          <button style={{ padding: '8px 16px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
            + Thêm danh mục
          </button>
        </Link>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
        <thead>
          <tr style={{ background: '#DEDBCE' }}>
            <th style={{ padding: 8, textAlign: 'left' }}>ID</th>
            <th style={{ padding: 8, textAlign: 'left' }}>Tên</th>
            <th style={{ padding: 8, textAlign: 'left' }}>Slug</th>
            <th style={{ padding: 8, textAlign: 'left' }}>Danh mục cha</th>
            <th style={{ padding: 8, textAlign: 'left' }}>Thứ tự</th>
            <th style={{ padding: 8, textAlign: 'left' }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 ? (
            <tr><td colSpan={6} style={{ padding: 20, textAlign: 'center' }}>Chưa có danh mục</td></tr>
          ) : (
            categories.map((cat: any) => (
              <tr key={cat.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: 8 }}>{cat.id}</td>
                <td style={{ padding: 8 }}>{cat.name}</td>
                <td style={{ padding: 8 }}>{cat.slug}</td>
                <td style={{ padding: 8 }}>{cat.parent?.name || '-'}</td>
                <td style={{ padding: 8 }}>{cat.sort_order}</td>
                <td style={{ padding: 8 }}>
                  <Link href={`/admin/categories/edit/${cat.id}`} style={{ marginRight: 8, color: '#2196F3' }}>Sửa</Link>
                  <button onClick={() => handleDelete(cat.id)} style={{ background: 'none', border: 'none', color: '#f44336', cursor: 'pointer' }}>Xóa</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}