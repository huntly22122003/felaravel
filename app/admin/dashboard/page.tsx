'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    const userStr = localStorage.getItem('admin_user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
    setLoading(false);
  }, [router]);

  if (loading) return <div style={{ padding: '20px' }}>Đang tải...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard Admin</h1>
      <p>Xin chào, {user?.name || user?.username || 'Admin'}!</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '20px' }}>
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <h3>Sản phẩm</h3>
          <p>Quản lý sản phẩm</p>
          <a href="/admin/products">Đi đến</a>
        </div>
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <h3>Danh mục</h3>
          <p>Quản lý danh mục</p>
          <a href="/admin/categories">Đi đến</a>
        </div>
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <h3>Đơn hàng</h3>
          <p>Quản lý đơn hàng</p>
          <a href="/admin/orders">Đi đến</a>
        </div>
      </div>
    </div>
  );
}