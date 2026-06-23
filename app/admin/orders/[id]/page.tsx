'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { getOrder, updateOrderStatus } from '@/services/adminApi';

const statusMap: Record<string, { label: string; color: string }> = {
  new: { label: 'Mới', color: '#2196F3' },
  processing: { label: 'Đang xử lý', color: '#FF9800' },
  completed: { label: 'Hoàn thành', color: '#4CAF50' },
  cancelled: { label: 'Đã hủy', color: '#f44336' },
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

  if (loading) return <div style={{ padding: '20px' }}>Đang tải...</div>;
  if (!order) return <div style={{ padding: '20px' }}>Không tìm thấy đơn hàng</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Chi tiết đơn hàng #{order.id}</h1>
        <Link href="/admin/orders">
          <button style={{ padding: '8px 16px', background: '#999', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            ← Quay lại
          </button>
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Thông tin đơn hàng</h3>
          <p><strong>Khách hàng:</strong> {order.customer?.name || 'Khách lẻ'}</p>
          <p><strong>Email:</strong> {order.customer?.email || '—'}</p>
          <p><strong>Tổng tiền:</strong> <strong>{Number(order.total_amount).toLocaleString('vi-VN')} ₫</strong></p>
          <p><strong>Ghi chú:</strong> {order.note || '—'}</p>
          <p><strong>Ngày tạo:</strong> {new Date(order.created_at).toLocaleString('vi-VN')}</p>
        </div>

        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Trạng thái đơn hàng</h3>
          <div style={{ marginBottom: '12px' }}>
            <span style={{
              padding: '6px 12px',
              borderRadius: '4px',
              background: statusMap[order.status]?.color || '#999',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 'bold',
            }}>
              {statusMap[order.status]?.label || order.status}
            </span>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Cập nhật trạng thái:</label>
            <select
              value={order.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={updating}
              style={{
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                width: '100%',
                maxWidth: '300px',
              }}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {statusMap[status]?.label || status}
                </option>
              ))}
            </select>
            {updating && <span style={{ marginLeft: '8px', color: '#999' }}>Đang cập nhật...</span>}
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3>Chi tiết sản phẩm</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>STT</th>
              <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Tên sản phẩm</th>
              <th style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>Số lượng</th>
              <th style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>Đơn giá</th>
              <th style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {order.items && order.items.length > 0 ? (
              order.items.map((item: any, index: number) => (
                <tr key={item.id}>
                  <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{index + 1}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{item.product_name}</td>
                  <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #eee' }}>{item.quantity}</td>
                  <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #eee' }}>{Number(item.price).toLocaleString('vi-VN')} ₫</td>
                  <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #eee' }}>
                    {Number(item.price * item.quantity).toLocaleString('vi-VN')} ₫
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ padding: '20px', textAlign: 'center' }}>Không có sản phẩm nào.</td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr style={{ fontWeight: 'bold', borderTop: '2px solid #ddd' }}>
              <td colSpan={4} style={{ padding: '8px', textAlign: 'right' }}>Tổng cộng:</td>
              <td style={{ padding: '8px', textAlign: 'right' }}>
                {Number(order.total_amount).toLocaleString('vi-VN')} ₫
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}