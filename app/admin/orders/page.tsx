'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getOrders, deleteOrder } from '@/services/adminApi';
import './orders.css';

const statusMap: Record<string, { label: string; color: string; bg: string }> = {
  new: { label: 'Mới', color: '#2563eb', bg: '#eff6ff' },
  processing: { label: 'Đang xử lý', color: '#ea580c', bg: '#fff7ed' },
  completed: { label: 'Hoàn thành', color: '#16a34a', bg: '#f0fdf4' },
  cancelled: { label: 'Đã hủy', color: '#dc2626', bg: '#fef2f2' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  });
  const [filters, setFilters] = useState({ search: '', status: '' });

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const params = { ...filters, page, per_page: 20 };
      const res = await getOrders(params);
      setOrders(res.data || []);
      setPagination({
        current_page: res.current_page || 1,
        last_page: res.last_page || 1,
        per_page: res.per_page || 20,
        total: res.total || 0,
      });
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa đơn hàng này?')) return;
    try {
      await deleteOrder(id);
      fetchOrders(pagination.current_page);
    } catch (error) {
      console.error('Delete error:', error);
      alert('Xóa thất bại');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.last_page) {
      fetchOrders(page);
    }
  };

  const handleResetFilters = () => {
    setFilters({ search: '', status: '' });
    fetchOrders(1);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div className="orders-container">
      {/* Header */}
      <div className="orders-header">
        <div>
          <h1 className="orders-title">
            🛒 Quản lý đơn hàng
          </h1>
          <p className="orders-subtitle">
            Tổng số đơn hàng: <span className="orders-total-count">{pagination.total}</span>
          </p>
        </div>
        <Link href="/admin/orders/create" className="orders-create-btn">
          <span className="border-glow"></span>
          <span className="create-icon">+</span>
          <span className="btn-text">Thêm mới</span>
          <span className="particle"></span>
          <span className="particle"></span>
          <span className="particle"></span>
          <span className="particle"></span>
          <span className="particle"></span>
          <span className="particle"></span>
        </Link>
      </div>

      {/* Filters */}
      <div className="orders-filters-wrapper">
        <form onSubmit={handleSearch} className="orders-filters">
          <div className="orders-filters-left">
            <div className="orders-filter-group">
              <span className="orders-filter-icon">🔍</span>
              <input
                type="text"
                placeholder="Tìm kiếm theo khách hàng..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="orders-filter-input"
              />
            </div>
            <div className="orders-filter-group">
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="orders-filter-select"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="new">🆕 Mới</option>
                <option value="processing">⚙️ Đang xử lý</option>
                <option value="completed">✅ Hoàn thành</option>
                <option value="cancelled">❌ Đã hủy</option>
              </select>
            </div>
          </div>
          <div className="orders-filters-right">
            <button type="submit" className="orders-btn-search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
              Tìm kiếm
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="orders-btn-reset"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9m0 0v6m0-6h-6"/>
              </svg>
              Xóa lọc
            </button>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="orders-table-wrapper">
        {loading ? (
          <div className="orders-loading">
            <div className="orders-spinner"></div>
            <p>Đang tải đơn hàng...</p>
          </div>
        ) : (
          <>
            <div className="orders-table-scroll">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Khách hàng</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                    <th>Số lượng SP</th>
                    <th>Ngày tạo</th>
                    <th className="orders-table-actions">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={7}>
                        <div className="orders-empty">
                          <span className="orders-empty-icon">📭</span>
                          <p>Không có đơn hàng nào</p>
                          <p className="orders-empty-sub">Hãy tạo đơn hàng mới để bắt đầu</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    orders.map((order, index) => (
                      <tr key={order.id}>
                        <td className="orders-id">
                          <span className="orders-id-badge">#{order.id}</span>
                        </td>
                        <td>
                          <div className="orders-customer">
                            <div className="orders-customer-name">
                              {order.customer?.name || 'Khách lẻ'}
                            </div>
                            {order.customer?.email && (
                              <div className="orders-customer-email">
                                {order.customer.email}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="orders-price">
                          {formatPrice(order.total_amount)}
                        </td>
                        <td>
                          <span className={`orders-status orders-status-${order.status}`}>
                            <span className="orders-status-dot"></span>
                            {statusMap[order.status]?.label || order.status}
                          </span>
                        </td>
                        <td className="orders-items-count">
                          <span className="orders-items-badge">
                            {order.items?.length || 0}
                          </span>
                        </td>
                        <td className="orders-date">
                          {new Date(order.created_at).toLocaleString('vi-VN')}
                        </td>
                       {/* Actions - SỬA GIỐNG PRODUCTS & CATEGORIES */}
<td className="orders-actions">
  <Link 
    href={`/admin/orders/${order.id}`} 
    className="orders-action-btn orders-action-view"
  >
    ✏️ Chi tiết
  </Link>
  <button
    onClick={() => handleDelete(order.id)}
    className="orders-action-btn orders-action-delete"
  >
    🗑️ Xóa
  </button>
</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.last_page > 1 && (
              <div className="orders-pagination">
                <div className="orders-pagination-info">
                  Hiển thị {orders.length} / {pagination.total} đơn hàng
                </div>
                <div className="orders-pagination-buttons">
                  <button
                    onClick={() => handlePageChange(pagination.current_page - 1)}
                    disabled={pagination.current_page <= 1}
                    className="orders-pagination-btn"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 18l-6-6 6-6"/>
                    </svg>
                  </button>
                  
                  {Array.from({ length: Math.min(pagination.last_page, 5) }, (_, i) => {
                    let pageNum;
                    if (pagination.last_page <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.current_page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.current_page >= pagination.last_page - 2) {
                      pageNum = pagination.last_page - 4 + i;
                    } else {
                      pageNum = pagination.current_page - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`orders-pagination-btn ${
                          pageNum === pagination.current_page ? 'orders-pagination-active' : ''
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(pagination.current_page + 1)}
                    disabled={pagination.current_page >= pagination.last_page}
                    className="orders-pagination-btn"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}