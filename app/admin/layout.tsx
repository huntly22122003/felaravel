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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip auth check on login page
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

  const handleLogout = async () => {
    if (!confirm('Bạn có chắc muốn đăng xuất?')) return;
    try {
      await logoutAdmin();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear all storage
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      sessionStorage.clear();
      
      // Clear cookies
      document.cookie = 'admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'admin_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      // Use replace to prevent back button issues
      router.replace('/admin/login');
    }
  };

  const isActive = (path: string) => {
    if (path === '/admin/dashboard') {
      return pathname === path ? 'admin-sidebar-link-active' : '';
    }
    return pathname.startsWith(path) ? 'admin-sidebar-link-active' : '';
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
      {/* Sidebar - Using Link for SPA navigation */}
      <div className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar-open' : 'admin-sidebar-closed'}`}>
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-logo">
            <span className="admin-sidebar-logo-icon">🌿</span>
            {sidebarOpen && <span className="admin-sidebar-logo-text">Admin</span>}
          </div>
          <button 
            className="admin-sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <div className="admin-sidebar-user">
          <div className="admin-sidebar-avatar">👤</div>
          {sidebarOpen && (
            <div className="admin-sidebar-user-info">
              <p className="admin-sidebar-username">{user?.name || user?.username || 'Admin'}</p>
              <p className="admin-sidebar-role">Quản trị viên</p>
            </div>
          )}
        </div>

        <nav className="admin-sidebar-nav">
          <Link href="/admin/dashboard" className={`admin-sidebar-link ${isActive('/admin/dashboard')}`}>
            <span className="admin-sidebar-link-icon">📊</span>
            {sidebarOpen && <span>Dashboard</span>}
          </Link>
          <Link href="/admin/products" className={`admin-sidebar-link ${isActive('/admin/products')}`}>
            <span className="admin-sidebar-link-icon">📦</span>
            {sidebarOpen && <span>Sản phẩm</span>}
          </Link>
          <Link href="/admin/categories" className={`admin-sidebar-link ${isActive('/admin/categories')}`}>
            <span className="admin-sidebar-link-icon">📂</span>
            {sidebarOpen && <span>Danh mục</span>}
          </Link>
          <Link href="/admin/orders" className={`admin-sidebar-link ${isActive('/admin/orders')}`}>
            <span className="admin-sidebar-link-icon">🛒</span>
            {sidebarOpen && <span>Đơn hàng</span>}
          </Link>
          <Link href="/admin/banners" className={`admin-sidebar-link ${isActive('/admin/banners')}`}>
            <span className="admin-sidebar-link-icon">🖼️</span>
            {sidebarOpen && <span>Banner</span>}
          </Link>
          <Link href="/admin/users" className={`admin-sidebar-link ${isActive('/admin/users')}`}>
            <span className="admin-sidebar-link-icon">👥</span>
            {sidebarOpen && <span>Người dùng</span>}
          </Link>
          <Link href="/admin/settings" className={`admin-sidebar-link ${isActive('/admin/settings')}`}>
            <span className="admin-sidebar-link-icon">⚙️</span>
            {sidebarOpen && <span>Cài đặt</span>}
          </Link>
        </nav>

        <div className="admin-sidebar-footer">
          <button onClick={handleLogout} className="admin-sidebar-logout">
            <span className="admin-sidebar-link-icon">🚪</span>
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