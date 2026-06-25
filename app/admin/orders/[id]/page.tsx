'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { getOrder, updateOrderStatus } from '@/services/adminApi';
import './order-detail.css';

const statusMap: Record<string, { label: string; color: string; bg: string }> = {
  new: { label: 'Mới', color: '#2563eb', bg: '#eff6ff' },
  processing: { label: 'Đang xử lý', color: '#ea580c', bg: '#fff7ed' },
  completed: { label: 'Hoàn thành', color: '#16a34a', bg: '#f0fdf4' },
  cancelled: { label: 'Đã hủy', color: '#dc2626', bg: '#fef2f2' },
};

const statusOptions = ['new', 'processing', 'completed', 'cancelled'];

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchOrder = async () => {
    try {
      const data = await getOrder(id);
      setOrder(data);
    } catch (error) {
      console.error('Failed to fetch order:', error);
      alert('Không tìm thấy đơn hàng');
      router.push('/admin/orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!confirm(`Chuyển trạng thái đơn hàng sang "${statusMap[newStatus]?.label}"?`)) return;
    setUpdating(true);
    try {
      await updateOrderStatus(id, newStatus);
      await fetchOrder();
      alert('Cập nhật trạng thái thành công');
    } catch (error: any) {
      console.error('Update status error:', error);
      alert('Cập nhật thất bại: ' + (error.message || ''));
    } finally {
      setUpdating(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  if (loading) {
    return (
      <div className="order-detail-container">
        <div className="order-detail-loading">
          <div className="order-detail-spinner"></div>
          <p>Đang tải đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-detail-container">
        <div className="order-detail-not-found">
          <span className="not-found-icon">🔍</span>
          <p>Không tìm thấy đơn hàng</p>
          <Link href="/admin/orders" className="order-detail-back-link">
            ← Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="order-detail-container">
      {/* Header */}
      <div className="order-detail-header">
        <div>
          <h1 className="order-detail-title">📋 Chi tiết đơn hàng #{order.id}</h1>
          <p className="order-detail-subtitle">
            Ngày tạo: {new Date(order.created_at).toLocaleString('vi-VN')}
          </p>
        </div>
        <Link href="/admin/orders" className="order-detail-back-btn">
          ← Quay lại
        </Link>
      </div>

      {/* Info Grid */}
      <div className="order-detail-grid">
        {/* Order Info */}
        <div className="order-detail-card">
          <div className="order-detail-card-header">
            <span className="card-icon">📦</span>
            <h3>Thông tin đơn hàng</h3>
          </div>
          <div className="order-detail-info-list">
            <div className="order-detail-info-item">
              <span className="info-label">Khách hàng</span>
              <span className="info-value">{order.customer?.name || 'Khách lẻ'}</span>
            </div>
            <div className="order-detail-info-item">
              <span className="info-label">Email</span>
              <span className="info-value">{order.customer?.email || '—'}</span>
            </div>
            <div className="order-detail-info-item">
              <span className="info-label">Tổng tiền</span>
              <span className="info-value info-value-price">{formatPrice(order.total_amount)}</span>
            </div>
            <div className="order-detail-info-item">
              <span className="info-label">Ghi chú</span>
              <span className="info-value">{order.note || '—'}</span>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="order-detail-card">
          <div className="order-detail-card-header">
            <span className="card-icon">🔄</span>
            <h3>Trạng thái đơn hàng</h3>
          </div>
          <div className="order-detail-status-section">
            <div className="order-detail-current-status">
              <span className="status-label">Hiện tại:</span>
              <span className={`order-detail-status-badge status-${order.status}`}>
                <span className="status-dot"></span>
                {statusMap[order.status]?.label || order.status}
              </span>
            </div>
            <div className="order-detail-status-update">
              <label className="update-label">Cập nhật trạng thái:</label>
              <div className="update-select-wrapper">
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={updating}
                  className="order-detail-status-select"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {statusMap[status]?.label || status}
                    </option>
                  ))}
                </select>
                {updating && (
                  <span className="updating-indicator">
                    <span className="updating-spinner"></span>
                    Đang cập nhật...
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="order-detail-card order-detail-products">
        <div className="order-detail-card-header">
          <span className="card-icon">🛍️</span>
          <h3>Chi tiết sản phẩm</h3>
          <span className="order-detail-product-count">
            {order.items?.length || 0} sản phẩm
          </span>
        </div>
        <div className="order-detail-table-wrapper">
          <table className="order-detail-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên sản phẩm</th>
                <th className="text-right">Số lượng</th>
                <th className="text-right">Đơn giá</th>
                <th className="text-right">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {order.items && order.items.length > 0 ? (
                order.items.map((item: any, index: number) => (
                  <tr key={item.id || index} className="order-detail-product-row">
                    <td>{index + 1}</td>
                    <td>
                      <div className="product-name-cell">
                        <span className="product-name">{item.product_name}</span>
                        {item.product_id && (
                          <span className="product-id">ID: #{item.product_id}</span>
                        )}
                      </div>
                    </td>
                    <td className="text-right">
                      <span className="product-quantity">{item.quantity}</span>
                    </td>
                    <td className="text-right">{formatPrice(item.price)}</td>
                    <td className="text-right product-total">
                      {formatPrice(item.price * item.quantity)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="order-detail-empty-products">
                    <span className="empty-icon">📭</span>
                    <p>Không có sản phẩm nào trong đơn hàng</p>
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="order-detail-footer">
                <td colSpan={4} className="text-right footer-label">
                  Tổng cộng:
                </td>
                <td className="text-right footer-total">
                  {formatPrice(order.total_amount)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}