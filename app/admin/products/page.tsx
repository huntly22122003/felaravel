'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProducts, deleteProduct } from '@/services/adminApi';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((res) => {
        setProducts(res.data || res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa?')) return;
    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      alert('Xóa thất bại');
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>Quản lý sản phẩm</h1>
        <Link href="/admin/products/create" style={{ background: '#4A865A', color: '#fff', padding: '8px 16px', textDecoration: 'none', borderRadius: '4px' }}>
          + Thêm mới
        </Link>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#dedbce' }}>
            <th style={{ padding: '8px', textAlign: 'left' }}>ID</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>Tên</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>Danh mục</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>Giá</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ padding: '20px', textAlign: 'center' }}>Chưa có sản phẩm</td>
            </tr>
          ) : (
            products.map((p: any) => (
              <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px' }}>{p.id}</td>
                <td style={{ padding: '8px' }}>{p.name}</td>
                <td style={{ padding: '8px' }}>{p.category?.name || 'Chưa có'}</td>
                <td style={{ padding: '8px' }}>{p.price?.toLocaleString() || 0} VND</td>
                <td style={{ padding: '8px' }}>
                  <Link href={`/admin/products/edit/${p.id}`} style={{ color: '#0070f3', textDecoration: 'none' }}>Sửa</Link>
                  {' | '}
                  <button
                    onClick={() => handleDelete(p.id)}
                    style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}