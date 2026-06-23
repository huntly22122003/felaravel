'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { logoutAdmin } from '@/services/adminApi';

// Interface cho thống kê (có thể gọi API sau)
interface Stats {
  users: number;
  products: number;
  categories: number;
  banners: number;
  posts: number;
  galleries: number;
  orders: number;
  contacts: number;
  introductions: number;
  productPosts: number;
  feedbacks: number;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    users: 0,
    products: 0,
    categories: 0,
    banners: 0,
    posts: 0,
    galleries: 0,
    orders: 0,
    contacts: 0,
    introductions: 0,
    productPosts: 0,
    feedbacks: 0,
  });
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

    // Giả lập lấy thống kê (bạn sẽ thay bằng API thật)
    const fetchStats = async () => {
      try {
        // Gọi API lấy số lượng từng bảng
        // const res = await getAdminStats();
        // setStats(res.data);
        // Tạm thời để số ngẫu nhiên cho demo
        setStats({
          users: 24,
          products: 156,
          categories: 12,
          banners: 8,
          posts: 45,
          galleries: 32,
          orders: 78,
          contacts: 19,
          introductions: 1,   // thường chỉ có 1 trang giới thiệu
          productPosts: 23,   // sản phẩm đang đăng tin
          feedbacks: 7,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    fetchStats();

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

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>⏳ Đang tải...</div>;

  // Danh sách các module (đầy đủ)
  const modules = [
    { key: 'users', label: 'Người dùng', icon: '👤', path: '/admin/users', color: '#4CAF50' },
    { key: 'products', label: 'Sản phẩm', icon: '📦', path: '/admin/products', color: '#2196F3' },
    { key: 'categories', label: 'Danh mục', icon: '📂', path: '/admin/categories', color: '#FF9800' },
    { key: 'banners', label: 'Banner quảng cáo', icon: '🖼️', path: '/admin/banners', color: '#E91E63' },
    { key: 'posts', label: 'Tin tức', icon: '📰', path: '/admin/posts', color: '#9C27B0' },
    { key: 'galleries', label: 'Thư viện ảnh', icon: '🖼️', path: '/admin/galleries', color: '#00BCD4' },
    { key: 'orders', label: 'Đơn hàng', icon: '🛒', path: '/admin/orders', color: '#F44336' },
    { key: 'contacts', label: 'Liên hệ (KH)', icon: '📞', path: '/admin/contacts', color: '#3F51B5' },
    { key: 'introductions', label: 'Lời giới thiệu', icon: '📝', path: '/admin/introductions', color: '#607D8B' },
    { key: 'productPosts', label: 'SP đang đăng tin', icon: '📢', path: '/admin/product-posts', color: '#8BC34A' },
    { key: 'feedbacks', label: 'QL liên hệ (phản hồi)', icon: '💬', path: '/admin/feedbacks', color: '#FF5722' },
  ];

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'white',
        padding: '16px 24px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '24px',
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px' }}>📊 Dashboard</h1>
          <p style={{ margin: '4px 0 0', color: '#666' }}>
            Xin chào, <strong>{user?.name || user?.username || 'Admin'}</strong>!
          </p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: '#f44336',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
          }}
        >
          🚪 Đăng xuất
        </button>
      </div>

      {/* Grid các module */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '20px',
      }}>
        {modules.map((mod) => (
          <a
            key={mod.key}
            href={mod.path}
            style={{
              display: 'block',
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              textDecoration: 'none',
              color: '#333',
              transition: 'transform 0.2s, box-shadow 0.2s',
              borderLeft: `6px solid ${mod.color}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '28px' }}>{mod.icon}</span>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                  {stats[mod.key as keyof Stats] ?? 0}
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>{mod.label}</div>
              </div>
            </div>
            <div style={{ marginTop: '12px', fontSize: '13px', color: '#999' }}>
              Xem chi tiết →
            </div>
          </a>
        ))}
      </div>

      {/* Footer thông tin thêm (tuỳ chọn) */}
      <div style={{ marginTop: '32px', textAlign: 'center', color: '#aaa', fontSize: '13px' }}>
        © {new Date().getFullYear()} - Quản trị hệ thống
      </div>
    </div>
  );
}