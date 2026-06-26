'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { logoutAdmin } from '@/services/adminApi';
import './admin-layout.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('admin_sidebar_open');
      if (saved !== null) {
        return saved === 'true';
      }
    }
    return true;
  });
  const router = useRouter();
  const pathname = usePathname();

  // Menu items với màu sắc riêng
  const menuItems = [
    { path: '/admin/dashboard', icon: '📊', label: 'Dashboard', color: '#2d5a3a' },
    { path: '/admin/products', icon: '🌿', label: 'Sản phẩm', color: '#2E7D32' },
    { path: '/admin/categories', icon: '📂', label: 'Danh mục', color: '#E65100' },
    { path: '/admin/orders', icon: '🛒', label: 'Đơn hàng', color: '#C62828' },
    { path: '/admin/banners', icon: '🎨', label: 'Banner', color: '#C2185B' },
    { path: '/admin/users', icon: '👥', label: 'Người dùng', color: '#1565C0' },
    { path: '/admin/posts', icon: '📰', label: 'Tin tức', color: '#6A1B9A' },
    { path: '/admin/galleries', icon: '🖼️', label: 'Thư viện', color: '#00695C' },
    { path: '/admin/contacts', icon: '💬', label: 'Liên hệ', color: '#1565C0' },
    { path: '/admin/faqs', icon: '❓', label: 'FAQ', color: '#BF360C' },
  ];

  useEffect(() => {
    if (pathname === '/admin/login') {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.replace('/admin/login');
      return;
    }

    const userStr = localStorage.getItem('admin_user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error('Parse user error:', e);
        localStorage.removeItem('admin_user');
        router.replace('/admin/login');
        return;
      }
    }
    setLoading(false);
  }, [pathname, router]);

  useEffect(() => {
    localStorage.setItem('admin_sidebar_open', String(sidebarOpen));
  }, [sidebarOpen]);

  const handleLogout = async () => {
    if (!confirm('Bạn có chắc muốn đăng xuất?')) return;
    try {
      await logoutAdmin();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      localStorage.removeItem('admin_sidebar_open');
      localStorage.removeItem('dashboard_stats');
      sessionStorage.clear();
      
      document.cookie = 'admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'admin_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      router.replace('/admin/login');
    }
  };

  const isActive = (path: string) => {
    if (path === '/admin/dashboard') {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  // Don't render sidebar on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (loading) return (
    <div className="admin-loading-container">
      <div className="admin-loading-spinner"></div>
      <p>Đang tải...</p>
    </div>
  );

  return (
    <div className="admin-layout-container">
      {/* Sidebar mới */}
      <div className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar-open' : 'admin-sidebar-closed'}`}>
        {/* Header */}
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-logo">
            <div className="admin-sidebar-logo-icon">🌿</div>
            {sidebarOpen && (
              <div className="admin-sidebar-logo-text">
                <span className="logo-main">Cây Cảnh</span>
                <span className="logo-sub">Admin</span>
              </div>
            )}
          </div>
          <button 
            className="admin-sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {sidebarOpen ? (
                <path d="M15 18l-6-6 6-6"/>
              ) : (
                <path d="M9 18l6-6-6-6"/>
              )}
            </svg>
          </button>
        </div>

        {/* User Info */}
        <div className="admin-sidebar-user">
          <div className="admin-sidebar-avatar">
            <span>👤</span>
            {sidebarOpen && (
              <span className="avatar-status"></span>
            )}
          </div>
          {sidebarOpen && (
            <div className="admin-sidebar-user-info">
              <p className="admin-sidebar-username">{user?.name || user?.username || 'Admin'}</p>
              <p className="admin-sidebar-role">Quản trị viên</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="admin-sidebar-nav">
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`admin-sidebar-link ${active ? 'admin-sidebar-link-active' : ''}`}
                style={active ? { '--active-color': item.color } as React.CSSProperties : {}}
              >
                <span className="admin-sidebar-link-icon">{item.icon}</span>
                {sidebarOpen && (
                  <span className="admin-sidebar-link-label">{item.label}</span>
                )}
                {sidebarOpen && active && (
                  <span className="admin-sidebar-link-indicator"></span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="admin-sidebar-footer">
          <button onClick={handleLogout} className="admin-sidebar-logout">
            <span className="logout-icon">🚪</span>
            {sidebarOpen && <span>Đăng xuất</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`admin-main-content ${sidebarOpen ? 'admin-main-content-open' : 'admin-main-content-closed'}`}>
        {children}
      </div>
    </div>
  );
}