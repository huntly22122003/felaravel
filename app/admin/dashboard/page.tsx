'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { logoutAdmin } from '@/services/adminApi';

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

  const handleLogout = async () => {
    if (!confirm('Bạn có chắc muốn đăng xuất?')) return;
    try {
      await logoutAdmin();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      document.cookie = 'admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      router.push('/admin/login');
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Đang tải...</div>;

  return (
    <div style={{ padding: '20px' }}>
      {/* Header với logout */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Dashboard Admin</h1>
        <button
          onClick={handleLogout}
          style={{
            background: '#f44336',
            color: '#fff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Đăng xuất
        </button>
      </div>

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
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <h3>Banner</h3>
          <p>Quản lý banner quảng cáo</p>
          <a href="/admin/banners">Đi đến</a>
        </div>
      </div>
    </div>
  );
}