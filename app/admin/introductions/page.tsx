'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPages, deletePage } from '@/services/adminApi';

export default function IntroductionsPage() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  });
  const [filters, setFilters] = useState({ search: '', is_active: '' });

  const fetchPages = async (page = 1) => {
    setLoading(true);
    try {
      const params = { ...filters, page, per_page: 20 };
      const res = await getPages(params);
      setPages(res.data || []);
      setPagination({
        current_page: res.current_page || 1,
        last_page: res.last_page || 1,
        per_page: res.per_page || 20,
        total: res.total || 0,
      });
    } catch (error) {
      console.error('Failed to fetch pages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, [filters]);

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa trang này?')) return;
    try {
      await deletePage(id);
      fetchPages(pagination.current_page);
    } catch (error) {
      console.error('Delete error:', error);
      alert('Xóa thất bại');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPages(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.last_page) {
      fetchPages(page);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Quản lý Lời giới thiệu</h1>
        <Link href="/admin/introductions/create">
          <button style={{
            padding: '10px 20px',
            background: '#4CAF50',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
          }}>
            + Thêm mới
          </button>
        </Link>
      </div>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Tìm kiếm theo tiêu đề..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', flex: '1', minWidth: '200px' }}
        />
        <select
          value={filters.is_active}
          onChange={(e) => setFilters({ ...filters, is_active: e.target.value })}
          style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="1">Kích hoạt</option>
          <option value="0">Không kích hoạt</option>
        </select>
        <button type="submit" style={{ padding: '8px 16px', background: '#2196F3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Tìm kiếm
        </button>
        <button
          type="button"
          onClick={() => { setFilters({ search: '', is_active: '' }); fetchPages(1); }}
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
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Tiêu đề</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Slug</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Trạng thái</th>
                  <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {pages.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '40px', textAlign: 'center' }}>Không có trang nào.</td>
                  </tr>
                ) : (
                  pages.map((page) => (
                    <tr key={page.id}>
                      <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{page.id}</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{page.title}</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{page.slug}</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          background: page.is_active ? '#4CAF50' : '#f44336',
                          color: '#fff',
                          fontSize: '12px',
                        }}>
                          {page.is_active ? 'Kích hoạt' : 'Không kích hoạt'}
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #eee' }}>
                        <Link href={`/admin/introductions/edit/${page.id}`} style={{ marginRight: '8px', color: '#2196F3', textDecoration: 'none' }}>
                          Sửa
                        </Link>
                        <button
                          onClick={() => handleDelete(page.id)}
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