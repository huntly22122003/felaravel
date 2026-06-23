'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './admin-dashboard.css';

// Interface cho thống kê
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
  faqs: number;
}

export default function AdminDashboard() {
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
    faqs: 0,
  });
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Kiểm tra đăng nhập
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    const userStr = localStorage.getItem('admin_user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }

    // Giả lập lấy thống kê (sẽ thay bằng API thật)
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
          introductions: 1,
          productPosts: 23,
          faqs: 7,
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
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      document.cookie = 'admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      router.push('/admin/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading-container">
        <div className="dashboard-loading-spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  // Danh sách các module
  const modules = [
    { key: 'users', label: 'Người dùng', icon: '👤', path: '/admin/users', color: '#4CAF50' },
    { key: 'products', label: 'Sản phẩm', icon: '📦', path: '/admin/products', color: '#2196F3' },
    { key: 'categories', label: 'Danh mục', icon: '📂', path: '/admin/categories', color: '#FF9800' },
    { key: 'banners', label: 'Banner quảng cáo', icon: '🖼️', path: '/admin/banners', color: '#E91E63' },
    { key: 'posts', label: 'Tin tức', icon: '📰', path: '/admin/posts', color: '#9C27B0' },
    { key: 'galleries', label: 'Thư viện ảnh', icon: '🖼️', path: '/admin/galleries', color: '#00BCD4' },
    { key: 'orders', label: 'Đơn hàng', icon: '🛒', path: '/admin/orders', color: '#F44336' },
    { key: 'contacts', label: 'Liên hệ', icon: '📞', path: '/admin/contacts', color: '#3F51B5' },
    { key: 'introductions', label: 'Lời giới thiệu', icon: '📝', path: '/admin/introductions', color: '#607D8B' },
    { key: 'productPosts', label: 'SP đăng tin', icon: '📢', path: '/admin/product-posts', color: '#8BC34A' },
    { key: 'faqs', label: 'FAQ', icon: '❓', path: '/admin/faqs', color: '#FF5722' },
  ];

  // Dữ liệu thống kê nổi bật
  const highlightStats = [
    { label: 'Tổng sản phẩm', value: stats.products, icon: '🌱', color: '#2d5a3a' },
    { label: 'Đơn hàng', value: stats.orders, icon: '🛒', color: '#2196F3' },
    { label: 'Người dùng', value: stats.users, icon: '👤', color: '#FF9800' },
    { label: 'Danh mục', value: stats.categories, icon: '📂', color: '#9C27B0' },
  ];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-header-left">
          <h1 className="dashboard-title">🌿 Dashboard</h1>
          <p className="dashboard-subtitle">Quản lý cửa hàng cây cảnh của bạn</p>
        </div>
        <div className="dashboard-header-right">
          <span className="dashboard-date">
            {new Date().toLocaleDateString('vi-VN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
          <div className="dashboard-user-info">
            <span className="dashboard-user-name">
              {user?.name || user?.username || 'Admin'}
            </span>
            <button onClick={handleLogout} className="dashboard-logout-btn">
              🚪 Đăng xuất
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-stats">
        {highlightStats.map((stat, index) => (
          <div key={index} className="dashboard-stat-card">
            <div className="dashboard-stat-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
              {stat.icon}
            </div>
            <div className="dashboard-stat-info">
              <p className="dashboard-stat-label">{stat.label}</p>
              <p className="dashboard-stat-value">{stat.value.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="dashboard-charts">
        <div className="dashboard-chart-card">
          <h3 className="dashboard-chart-title">📊 Doanh thu theo ngày</h3>
          <div className="dashboard-chart-bars">
            {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, index) => {
              const heights = [70, 50, 85, 65, 90, 45, 75];
              return (
                <div key={day} className="dashboard-bar">
                  <div 
                    className="dashboard-bar-fill" 
                    style={{ height: `${heights[index]}%` }}
                  ></div>
                  <span className="dashboard-bar-label">{day}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="dashboard-chart-card">
          <h3 className="dashboard-chart-title">🔄 Hoạt động gần đây</h3>
          <div className="dashboard-activity">
            <div className="dashboard-activity-item">
              <span className="dashboard-dot dashboard-dot-green"></span>
              <div>
                <p className="dashboard-activity-text">🌿 Cây phong thủy mới đã được thêm</p>
                <span className="dashboard-activity-time">5 phút trước</span>
              </div>
            </div>
            <div className="dashboard-activity-item">
              <span className="dashboard-dot dashboard-dot-blue"></span>
              <div>
                <p className="dashboard-activity-text">🪴 Đơn hàng #12345 đã được xác nhận</p>
                <span className="dashboard-activity-time">15 phút trước</span>
              </div>
            </div>
            <div className="dashboard-activity-item">
              <span className="dashboard-dot dashboard-dot-yellow"></span>
              <div>
                <p className="dashboard-activity-text">🌱 Khách hàng mới: Nguyễn Văn A vừa đăng ký</p>
                <span className="dashboard-activity-time">1 giờ trước</span>
              </div>
            </div>
            <div className="dashboard-activity-item">
              <span className="dashboard-dot dashboard-dot-red"></span>
              <div>
                <p className="dashboard-activity-text">🍃 Đơn hàng #12340 đã bị hủy</p>
                <span className="dashboard-activity-time">2 giờ trước</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="dashboard-modules">
        <div className="dashboard-modules-header">
          <h3 className="dashboard-modules-title">📋 Quản lý hệ thống</h3>
          <span className="dashboard-modules-count">{modules.length} module</span>
        </div>
        <div className="dashboard-modules-grid">
          {modules.map((mod) => (
            <Link
              key={mod.key}
              href={mod.path}
              className="dashboard-module-card"
              style={{ borderLeftColor: mod.color }}
            >
              <div className="dashboard-module-icon" style={{ background: `${mod.color}15`, color: mod.color }}>
                {mod.icon}
              </div>
              <div className="dashboard-module-info">
                <div className="dashboard-module-count">
                  {stats[mod.key as keyof Stats]?.toLocaleString() ?? 0}
                </div>
                <div className="dashboard-module-label">{mod.label}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="dashboard-table">
        <div className="dashboard-table-header">
          <h3 className="dashboard-table-title">🌿 Đơn hàng gần đây</h3>
          <Link href="/admin/orders" className="dashboard-table-link">
            Xem tất cả →
          </Link>
        </div>
        <div className="dashboard-table-responsive">
          <table className="dashboard-table-content">
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
                <td>Cây Kim Ngân</td>
                <td>250,000₫</td>
                <td><span className="dashboard-status dashboard-status-success">Đã xác nhận</span></td>
                <td>22/06/2026</td>
              </tr>
              <tr>
                <td>#12344</td>
                <td>Trần Thị B</td>
                <td>Sen đá mini</td>
                <td>350,000₫</td>
                <td><span className="dashboard-status dashboard-status-warning">Đang xử lý</span></td>
                <td>22/06/2026</td>
              </tr>
              <tr>
                <td>#12343</td>
                <td>Lê Văn C</td>
                <td>Cây Lưỡi Hổ</td>
                <td>550,000₫</td>
                <td><span className="dashboard-status dashboard-status-success">Đã giao hàng</span></td>
                <td>21/06/2026</td>
              </tr>
              <tr>
                <td>#12342</td>
                <td>Phạm Thị D</td>
                <td>Cây Trầu Bà</td>
                <td>450,000₫</td>
                <td><span className="dashboard-status dashboard-status-danger">Đã hủy</span></td>
                <td>21/06/2026</td>
              </tr>
              <tr>
                <td>#12341</td>
                <td>Hoàng Văn E</td>
                <td>Cây Xương Rồng</td>
                <td>650,000₫</td>
                <td><span className="dashboard-status dashboard-status-info">Đang vận chuyển</span></td>
                <td>20/06/2026</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="dashboard-footer">
        <p>🌿 © {new Date().getFullYear()} Trung Tâm Cây Cảnh Anh Quân. All rights reserved.</p>
      </div>
    </div>
  );
}