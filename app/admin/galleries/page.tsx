'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getGalleries, deleteGallery } from '@/services/adminApi';

export default function GalleriesPage() {
  const [galleries, setGalleries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  });
  const [filters, setFilters] = useState({ search: '', is_active: '' });

  const fetchGalleries = async (page = 1) => {
    setLoading(true);
    try {
      const params = { ...filters, page, per_page: 20 };
      const res = await getGalleries(params);
      setGalleries(res.data || []);
      setPagination({
        current_page: res.current_page || 1,
        last_page: res.last_page || 1,
        per_page: res.per_page || 20,
        total: res.total || 0,
      });
    } catch (error) {
      console.error('Failed to fetch galleries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleries();
  }, [filters]);

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa ảnh này?')) return;
    try {
      await deleteGallery(id);
      fetchGalleries(pagination.current_page);
    } catch (error) {
      console.error('Delete error:', error);
      alert('Xóa thất bại');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchGalleries(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.last_page) {
      fetchGalleries(page);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Quản lý thư viện ảnh</h1>
        <Link href="/admin/galleries/create">
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
          onClick={() => { setFilters({ search: '', is_active: '' }); fetchGalleries(1); }}
          style={{ padding: '8px 16px', background: '#999', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Xóa lọc
        </button>
      </form>

      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
            {galleries.length === 0 ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px' }}>Không có ảnh nào.</div>
            ) : (
              galleries.map((gallery) => (
                <div key={gallery.id} style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', background: '#fff' }}>
                  <img 
                    src={gallery.image_path} 
                    alt={gallery.title} 
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
                  />
                  <div style={{ padding: '12px' }}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>{gallery.title}</h4>
                    <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>
                      {gallery.description ? gallery.description.substring(0, 50) + (gallery.description.length > 50 ? '...' : '') : '—'}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: gallery.is_active ? '#4CAF50' : '#f44336',
                        color: '#fff',
                        fontSize: '11px',
                      }}>
                        {gallery.is_active ? 'Kích hoạt' : 'Không kích hoạt'}
                      </span>
                      <div>
                        {/* ✅ Sửa link: /edit/[id] */}
                        <Link href={`/admin/galleries/edit/${gallery.id}`} style={{ marginRight: '8px', color: '#2196F3', textDecoration: 'none', fontSize: '14px' }}>
                          Sửa
                        </Link>
                        <button
                          onClick={() => handleDelete(gallery.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#f44336',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            fontSize: '14px',
                          }}
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
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