'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getOrders, deleteOrder } from '@/services/adminApi';

const statusMap: Record<string, { label: string; color: string }> = {
  new: { label: 'Mới', color: '#2196F3' },
  processing: { label: 'Đang xử lý', color: '#FF9800' },
  completed: { label: 'Hoàn thành', color: '#4CAF50' },
  cancelled: { label: 'Đã hủy', color: '#f44336' },
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

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Quản lý đơn hàng</h1>
        <Link href="/admin/orders/create">
          <button
            style={{
              padding: '10px 20px',
              background: '#4CAF50',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            + Thêm mới
          </button>
        </Link>
      </div>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Tìm kiếm theo khách hàng..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', flex: '1', minWidth: '200px' }}
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="new">Mới</option>
          <option value="processing">Đang xử lý</option>
          <option value="completed">Hoàn thành</option>
          <option value="cancelled">Đã hủy</option>
        </select>
        <button type="submit" style={{ padding: '8px 16px', background: '#2196F3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Tìm kiếm
        </button>
        <button
          type="button"
          onClick={() => { setFilters({ search: '', status: '' }); fetchOrders(1); }}
          style={{ padding: '8px 16px', background: '#999', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Xóa lọc
        </button>
      </form>

      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>ID</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Khách hàng</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Tổng tiền</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Trạng thái</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Số lượng SP</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Ngày tạo</th>
                  <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '40px', textAlign: 'center' }}>Không có đơn hàng nào.</td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id}>
                      <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>#{order.id}</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                        {order.customer?.name || 'Khách lẻ'}
                        {order.customer?.email && <div style={{ fontSize: '12px', color: '#999' }}>{order.customer.email}</div>}
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                        {Number(order.total_amount).toLocaleString('vi-VN')} ₫
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          background: statusMap[order.status]?.color || '#999',
                          color: '#fff',
                          fontSize: '12px',
                        }}>
                          {statusMap[order.status]?.label || order.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                        {order.items?.length || 0}
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                        {new Date(order.created_at).toLocaleString('vi-VN')}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #eee' }}>
                        <Link href={`/admin/orders/${order.id}`} style={{ marginRight: '8px', color: '#2196F3', textDecoration: 'none' }}>
                          Chi tiết
                        </Link>
                        <button
                          onClick={() => handleDelete(order.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#f44336',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                          }}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {pagination.last_page > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
              <button
                onClick={() => handlePageChange(pagination.current_page - 1)}
                disabled={pagination.current_page <= 1}
                style={{ padding: '8px 12px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer', borderRadius: '4px' }}
              >
                &laquo;
              </button>
              {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    background: page === pagination.current_page ? '#2196F3' : '#fff',
                    color: page === pagination.current_page ? '#fff' : '#000',
                    cursor: 'pointer',
                    borderRadius: '4px',
                  }}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(pagination.current_page + 1)}
                disabled={pagination.current_page >= pagination.last_page}
                style={{ padding: '8px 12px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer', borderRadius: '4px' }}
              >
                &raquo;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}