'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import './admin-dashboard.css';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading-container">
        <div className="dashboard-loading-spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
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
          <button className="dashboard-notification">🔔</button>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon">🌱</div>
          <div className="dashboard-stat-info">
            <p className="dashboard-stat-label">Tổng cây cảnh</p>
            <p className="dashboard-stat-value">1,234</p>
            <p className="dashboard-stat-change dashboard-stat-up">↑ 12.5% so với tháng trước</p>
          </div>
        </div>
        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon">🪴</div>
          <div className="dashboard-stat-info">
            <p className="dashboard-stat-label">Đơn hàng</p>
            <p className="dashboard-stat-value">567</p>
            <p className="dashboard-stat-change dashboard-stat-up">↑ 8.3% so với tháng trước</p>
          </div>
        </div>
        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon">👤</div>
          <div className="dashboard-stat-info">
            <p className="dashboard-stat-label">Khách hàng</p>
            <p className="dashboard-stat-value">2,345</p>
            <p className="dashboard-stat-change dashboard-stat-up">↑ 15.2% so với tháng trước</p>
          </div>
        </div>
        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon">🏷️</div>
          <div className="dashboard-stat-info">
            <p className="dashboard-stat-label">Danh mục</p>
            <p className="dashboard-stat-value">48</p>
            <p className="dashboard-stat-change dashboard-stat-up">↑ 5.3% so với tháng trước</p>
          </div>
        </div>
      </div>

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

      <div className="dashboard-table">
        <div className="dashboard-table-header">
          <h3 className="dashboard-table-title">🌿 Đơn hàng gần đây</h3>
          <Link href="/admin/orders" className="dashboard-table-link">Xem tất cả →</Link>
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

      <div className="dashboard-footer">
        <p>🌿 © 2024 Cửa hàng cây cảnh. All rights reserved.</p>
      </div>
    </div>
  );
}