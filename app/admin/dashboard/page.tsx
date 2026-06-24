'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './admin-dashboard.css';

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

interface Module {
  key: keyof Stats;
  label: string;
  icon: string;
  path: string;
  color: string;
  description?: string;
  bgColor?: string;
}

interface Activity {
  id: string;
  text: string;
  time: string;
  dotColor: 'green' | 'blue' | 'yellow' | 'red';
}

interface Order {
  id: string;
  customer: string;
  product: string;
  total: string;
  status: 'success' | 'warning' | 'danger' | 'info';
  statusLabel: string;
  date: string;
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

  // Cấu hình modules với màu sắc mới
  const modules: Module[] = [
    { 
      key: 'users', 
      label: 'Người dùng', 
      icon: '👤', 
      path: '/admin/users', 
      color: '#4CAF50',
      bgColor: '#e8f5e9',
      description: 'Quản lý tài khoản' 
    },
    { 
      key: 'products', 
      label: 'Sản phẩm', 
      icon: '🌿', 
      path: '/admin/products', 
      color: '#2E7D32',
      bgColor: '#e8f5e9',
      description: 'Quản lý cây cảnh' 
    },
    { 
      key: 'categories', 
      label: 'Danh mục', 
      icon: '📂', 
      path: '/admin/categories', 
      color: '#E65100',
      bgColor: '#fff3e0',
      description: 'Phân loại sản phẩm' 
    },
    { 
      key: 'banners', 
      label: 'Banner', 
      icon: '🎨', 
      path: '/admin/banners', 
      color: '#C2185B',
      bgColor: '#fce4ec',
      description: 'Quảng cáo' 
    },
    { 
      key: 'posts', 
      label: 'Tin tức', 
      icon: '📰', 
      path: '/admin/posts', 
      color: '#6A1B9A',
      bgColor: '#f3e5f5',
      description: 'Bài viết mới' 
    },
    { 
      key: 'galleries', 
      label: 'Thư viện', 
      icon: '🖼️', 
      path: '/admin/galleries', 
      color: '#00695C',
      bgColor: '#e0f2f1',
      description: 'Hình ảnh' 
    },
    { 
      key: 'orders', 
      label: 'Đơn hàng', 
      icon: '🛒', 
      path: '/admin/orders', 
      color: '#C62828',
      bgColor: '#ffebee',
      description: 'Quản lý đơn' 
    },
    { 
      key: 'contacts', 
      label: 'Liên hệ', 
      icon: '💬', 
      path: '/admin/contacts', 
      color: '#1565C0',
      bgColor: '#e3f2fd',
      description: 'Phản hồi KH' 
    },
    { 
      key: 'introductions', 
      label: 'Giới thiệu', 
      icon: '📝', 
      path: '/admin/introductions', 
      color: '#455A64',
      bgColor: '#eceff1',
      description: 'Nội dung trang' 
    },
    { 
      key: 'productPosts', 
      label: 'SP đăng tin', 
      icon: '📢', 
      path: '/admin/product-posts', 
      color: '#33691E',
      bgColor: '#f1f8e9',
      description: 'Tin đăng bán' 
    },
    { 
      key: 'faqs', 
      label: 'FAQ', 
      icon: '❓', 
      path: '/admin/faqs', 
      color: '#BF360C',
      bgColor: '#fbe9e7',
      description: 'Hỏi đáp' 
    },
  ];

  // Dữ liệu hoạt động
  const activities: Activity[] = [
    { id: '1', text: '🌿 Cây phong thủy mới đã được thêm', time: '5 phút trước', dotColor: 'green' },
    { id: '2', text: '🪴 Đơn hàng #12345 đã được xác nhận', time: '15 phút trước', dotColor: 'blue' },
    { id: '3', text: '🌱 Khách hàng mới: Nguyễn Văn A vừa đăng ký', time: '1 giờ trước', dotColor: 'yellow' },
    { id: '4', text: '🍃 Đơn hàng #12340 đã bị hủy', time: '2 giờ trước', dotColor: 'red' },
  ];

  // Dữ liệu đơn hàng
  const recentOrders: Order[] = [
    { id: '#12345', customer: 'Nguyễn Văn A', product: 'Cây Kim Ngân', total: '250,000₫', status: 'success', statusLabel: 'Đã xác nhận', date: '22/06/2026' },
    { id: '#12344', customer: 'Trần Thị B', product: 'Sen đá mini', total: '350,000₫', status: 'warning', statusLabel: 'Đang xử lý', date: '22/06/2026' },
    { id: '#12343', customer: 'Lê Văn C', product: 'Cây Lưỡi Hổ', total: '550,000₫', status: 'success', statusLabel: 'Đã giao hàng', date: '21/06/2026' },
    { id: '#12342', customer: 'Phạm Thị D', product: 'Cây Trầu Bà', total: '450,000₫', status: 'danger', statusLabel: 'Đã hủy', date: '21/06/2026' },
    { id: '#12341', customer: 'Hoàng Văn E', product: 'Cây Xương Rồng', total: '650,000₫', status: 'info', statusLabel: 'Đang vận chuyển', date: '20/06/2026' },
  ];

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

    // Khôi phục dữ liệu từ localStorage
    const savedStats = localStorage.getItem('dashboard_stats');
    if (savedStats) {
      try {
        const parsed = JSON.parse(savedStats);
        setStats(parsed);
        setLoading(false);
        return;
      } catch (e) {
        console.error('Parse stats error:', e);
      }
    }

    fetchStats();
  }, []);

  // Lắng nghe sự kiện storage để cập nhật khi có thay đổi từ tab khác
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'dashboard_stats') {
        try {
          const newStats = JSON.parse(e.newValue || '{}');
          setStats(newStats);
        } catch {
          // ignore
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const newStats = {
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
      };
      
      setStats(newStats);
      localStorage.setItem('dashboard_stats', JSON.stringify(newStats));
      localStorage.setItem('dashboard_updated', Date.now().toString());
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!confirm('Bạn có chắc muốn đăng xuất?')) return;
    try {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      localStorage.removeItem('dashboard_stats');
      localStorage.removeItem('dashboard_updated');
      document.cookie = 'admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      router.push('/admin/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleRefresh = () => {
    fetchStats();
  };

  const handleDeleteOrder = (orderId: string) => {
    if (confirm(`Bạn có chắc muốn xóa đơn hàng ${orderId}?`)) {
      alert(`Đã xóa đơn hàng ${orderId}`);
    }
  };

  const handleEditOrder = (orderId: string) => {
    alert(`Chỉnh sửa đơn hàng ${orderId}`);
  };

  if (loading) {
    return (
      <div className="dashboard-loading-container">
        <div className="dashboard-loading-spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

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
          <h1 className="dashboard-title">🌿 <span>Dashboard</span></h1>
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
          <button onClick={handleRefresh} className="dashboard-refresh-btn" title="Làm mới">
            🔄
          </button>
          <div className="dashboard-user-info">
            <span className="dashboard-user-name">
              👤 {user?.name || user?.username || 'Admin'}
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
            {activities.map((activity) => (
              <div key={activity.id} className="dashboard-activity-item">
                <span className={`dashboard-dot dashboard-dot-${activity.dotColor}`}></span>
                <div>
                  <p className="dashboard-activity-text">{activity.text}</p>
                  <span className="dashboard-activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modules Grid - Thiết kế mới */}
      <div className="dashboard-modules">
        <div className="dashboard-modules-header">
          <h3 className="dashboard-modules-title">🚀 Quản lý hệ thống</h3>
          <div className="dashboard-modules-actions">
            <span className="dashboard-modules-count">{modules.length} module</span>
            <button className="dashboard-modules-refresh" onClick={handleRefresh} title="Làm mới">
              🔄
            </button>
          </div>
        </div>
        <div className="dashboard-modules-grid">
          {modules.map((mod) => (
            <Link
              key={mod.key}
              href={mod.path}
              className="dashboard-module-card-new"
              style={{ 
                '--module-color': mod.color,
                '--module-bg': mod.bgColor || `${mod.color}15`
              } as React.CSSProperties}
            >
              <div className="module-card-content">
                <div className="module-icon-wrapper" style={{ background: mod.bgColor || `${mod.color}15` }}>
                  <span className="module-icon">{mod.icon}</span>
                </div>
                <div className="module-info">
                  <span className="module-label">{mod.label}</span>
                  <span className="module-desc">{mod.description}</span>
                </div>
              </div>
              <div className="module-arrow-wrapper">
                <svg className="module-arrow-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="dashboard-table">
        <div className="dashboard-table-header">
          <h3 className="dashboard-table-title">🌿 Đơn hàng gần đây</h3>
          <div className="dashboard-table-actions">
            <Link href="/admin/orders" className="dashboard-table-link">
              Xem tất cả →
            </Link>
            <button className="dashboard-table-refresh" onClick={handleRefresh} title="Làm mới">
              🔄
            </button>
          </div>
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
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td><strong>{order.id}</strong></td>
                  <td>{order.customer}</td>
                  <td>{order.product}</td>
                  <td>{order.total}</td>
                  <td>
                    <span className={`dashboard-status dashboard-status-${order.status}`}>
                      {order.statusLabel}
                    </span>
                  </td>
                  <td>{order.date}</td>
                  <td>
                    <div className="dashboard-table-actions-group">
                      <Link 
                        href={`/admin/orders/${order.id}`} 
                        className="dashboard-table-action-btn view"
                        title="Xem chi tiết"
                      >
                        👁️
                      </Link>
                      <button 
                        className="dashboard-table-action-btn edit"
                        onClick={() => handleEditOrder(order.id)}
                        title="Chỉnh sửa"
                      >
                        ✏️
                      </button>
                      <button 
                        className="dashboard-table-action-btn delete"
                        onClick={() => handleDeleteOrder(order.id)}
                        title="Xóa"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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