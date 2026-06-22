'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { logoutAdmin } from '@/services/adminApi';
import './admin-dashboard.css';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
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

  if (loading) return (
    <div className="admin-dashboard-loading">
      <div className="admin-loading-spinner"></div>
      <p>Đang tải...</p>
    </div>
  );

  return (
    <div className="admin-dashboard-container">
      {/* Sidebar */}
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
          <a href="/admin/dashboard" className="admin-sidebar-link admin-sidebar-link-active">
            <span className="admin-sidebar-link-icon">📊</span>
            {sidebarOpen && <span>Dashboard</span>}
          </a>
          <a href="/admin/products" className="admin-sidebar-link">
            <span className="admin-sidebar-link-icon">📦</span>
            {sidebarOpen && <span>Sản phẩm</span>}
          </a>
          <a href="/admin/categories" className="admin-sidebar-link">
            <span className="admin-sidebar-link-icon">📂</span>
            {sidebarOpen && <span>Danh mục</span>}
          </a>
          <a href="/admin/orders" className="admin-sidebar-link">
            <span className="admin-sidebar-link-icon">🛒</span>
            {sidebarOpen && <span>Đơn hàng</span>}
          </a>
          <a href="/admin/banners" className="admin-sidebar-link">
            <span className="admin-sidebar-link-icon">🖼️</span>
            {sidebarOpen && <span>Banner</span>}
          </a>
          <a href="/admin/users" className="admin-sidebar-link">
            <span className="admin-sidebar-link-icon">👥</span>
            {sidebarOpen && <span>Người dùng</span>}
          </a>
          <a href="/admin/settings" className="admin-sidebar-link">
            <span className="admin-sidebar-link-icon">⚙️</span>
            {sidebarOpen && <span>Cài đặt</span>}
          </a>
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
        {/* Header */}
        <div className="admin-main-header">
          <h1 className="admin-main-title">Dashboard</h1>
          <div className="admin-main-header-right">
            <span className="admin-header-date">{new Date().toLocaleDateString('vi-VN')}</span>
            <button className="admin-header-notification">🔔</button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-card-icon">💰</div>
            <div className="admin-stat-card-info">
              <p className="admin-stat-card-label">Doanh thu</p>
              <p className="admin-stat-card-value">12,345,678₫</p>
              <p className="admin-stat-card-change admin-stat-card-change-up">↑ 12.5% so với tháng trước</p>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-card-icon">🛒</div>
            <div className="admin-stat-card-info">
              <p className="admin-stat-card-label">Đơn hàng</p>
              <p className="admin-stat-card-value">1,234</p>
              <p className="admin-stat-card-change admin-stat-card-change-up">↑ 8.3% so với tháng trước</p>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-card-icon">👥</div>
            <div className="admin-stat-card-info">
              <p className="admin-stat-card-label">Người dùng</p>
              <p className="admin-stat-card-value">5,678</p>
              <p className="admin-stat-card-change admin-stat-card-change-up">↑ 15.2% so với tháng trước</p>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-card-icon">📦</div>
            <div className="admin-stat-card-info">
              <p className="admin-stat-card-label">Sản phẩm</p>
              <p className="admin-stat-card-value">456</p>
              <p className="admin-stat-card-change admin-stat-card-change-down">↓ 2.1% so với tháng trước</p>
            </div>
          </div>
        </div>

        {/* Charts and Activity */}
        <div className="admin-charts-grid">
          <div className="admin-chart-card">
            <h3 className="admin-chart-title">📊 Thống kê đơn hàng</h3>
            <div className="admin-chart-bars">
              <div className="admin-chart-bar">
                <div className="admin-chart-bar-fill" style={{ height: '70%' }}></div>
                <span className="admin-chart-bar-label">T2</span>
              </div>
              <div className="admin-chart-bar">
                <div className="admin-chart-bar-fill" style={{ height: '50%' }}></div>
                <span className="admin-chart-bar-label">T3</span>
              </div>
              <div className="admin-chart-bar">
                <div className="admin-chart-bar-fill" style={{ height: '85%' }}></div>
                <span className="admin-chart-bar-label">T4</span>
              </div>
              <div className="admin-chart-bar">
                <div className="admin-chart-bar-fill" style={{ height: '65%' }}></div>
                <span className="admin-chart-bar-label">T5</span>
              </div>
              <div className="admin-chart-bar">
                <div className="admin-chart-bar-fill" style={{ height: '90%' }}></div>
                <span className="admin-chart-bar-label">T6</span>
              </div>
              <div className="admin-chart-bar">
                <div className="admin-chart-bar-fill" style={{ height: '45%' }}></div>
                <span className="admin-chart-bar-label">T7</span>
              </div>
              <div className="admin-chart-bar">
                <div className="admin-chart-bar-fill" style={{ height: '75%' }}></div>
                <span className="admin-chart-bar-label">CN</span>
              </div>
            </div>
          </div>

          <div className="admin-chart-card">
            <h3 className="admin-chart-title">🔄 Hoạt động gần đây</h3>
            <div className="admin-activity-list">
              <div className="admin-activity-item">
                <span className="admin-activity-dot admin-activity-dot-green"></span>
                <div className="admin-activity-content">
                  <p className="admin-activity-text">Đơn hàng #12345 đã được xác nhận</p>
                  <span className="admin-activity-time">5 phút trước</span>
                </div>
              </div>
              <div className="admin-activity-item">
                <span className="admin-activity-dot admin-activity-dot-blue"></span>
                <div className="admin-activity-content">
                  <p className="admin-activity-text">Sản phẩm mới "Áo thun XYZ" đã được thêm</p>
                  <span className="admin-activity-time">15 phút trước</span>
                </div>
              </div>
              <div className="admin-activity-item">
                <span className="admin-activity-dot admin-activity-dot-yellow"></span>
                <div className="admin-activity-content">
                  <p className="admin-activity-text">Người dùng "Nguyễn Văn A" vừa đăng ký</p>
                  <span className="admin-activity-time">1 giờ trước</span>
                </div>
              </div>
              <div className="admin-activity-item">
                <span className="admin-activity-dot admin-activity-dot-red"></span>
                <div className="admin-activity-content">
                  <p className="admin-activity-text">Đơn hàng #12340 đã bị hủy</p>
                  <span className="admin-activity-time">2 giờ trước</span>
                </div>
              </div>
              <div className="admin-activity-item">
                <span className="admin-activity-dot admin-activity-dot-green"></span>
                <div className="admin-activity-content">
                  <p className="admin-activity-text">Banner mới đã được cập nhật</p>
                  <span className="admin-activity-time">3 giờ trước</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="admin-table-card">
          <div className="admin-table-header">
            <h3 className="admin-table-title">📋 Đơn hàng gần đây</h3>
            <a href="/admin/orders" className="admin-table-view-all">Xem tất cả →</a>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Sản phẩm</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Ngày đặt</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#12345</td>
                <td>Nguyễn Văn A</td>
                <td>Áo thun XYZ</td>
                <td>250,000₫</td>
                <td><span className="admin-status admin-status-success">Đã xác nhận</span></td>
                <td>22/06/2026</td>
              </tr>
              <tr>
                <td>#12344</td>
                <td>Trần Thị B</td>
                <td>Quần jeans ABC</td>
                <td>350,000₫</td>
                <td><span className="admin-status admin-status-warning">Đang xử lý</span></td>
                <td>22/06/2026</td>
              </tr>
              <tr>
                <td>#12343</td>
                <td>Lê Văn C</td>
                <td>Giày thể thao</td>
                <td>550,000₫</td>
                <td><span className="admin-status admin-status-success">Đã giao hàng</span></td>
                <td>21/06/2026</td>
              </tr>
              <tr>
                <td>#12342</td>
                <td>Phạm Thị D</td>
                <td>Ví da cao cấp</td>
                <td>450,000₫</td>
                <td><span className="admin-status admin-status-danger">Đã hủy</span></td>
                <td>21/06/2026</td>
              </tr>
              <tr>
                <td>#12341</td>
                <td>Hoàng Văn E</td>
                <td>Áo khoác mùa đông</td>
                <td>650,000₫</td>
                <td><span className="admin-status admin-status-info">Đang vận chuyển</span></td>
                <td>20/06/2026</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="admin-dashboard-footer">
          <p>© 2024 Hệ thống quản trị. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}