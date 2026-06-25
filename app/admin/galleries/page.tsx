'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getGalleries, deleteGallery } from '@/services/adminApi';
import './galleries.css';

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

  const handleResetFilters = () => {
    setFilters({ search: '', is_active: '' });
    fetchGalleries(1);
  };

  if (loading) return (
    <div className="galleries-loading-container">
      <div className="galleries-loading-spinner"></div>
      <p>Đang tải thư viện ảnh...</p>
    </div>
  );

  return (
    <div className="galleries-container">
      {/* Header */}
      <div className="galleries-header">
        <div>
          <h1 className="galleries-title">🖼️ Quản lý thư viện ảnh</h1>
          <p className="galleries-subtitle">
            Tổng số ảnh: <span className="galleries-total-count">{pagination.total}</span>
          </p>
        </div>
        <Link href="/admin/galleries/create" className="galleries-add-btn">
          <span className="border-glow"></span>
          <span className="galleries-add-icon">+</span>
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
      <div className="galleries-filters-wrapper">
        <form onSubmit={handleSearch} className="galleries-filters">
          <div className="galleries-filters-left">
            <div className="galleries-filter-group">
              <span className="galleries-filter-icon">🔍</span>
              <input
                type="text"
                placeholder="Tìm kiếm theo tiêu đề..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="galleries-filter-input"
              />
            </div>
            <div className="galleries-filter-group">
              <select
                value={filters.is_active}
                onChange={(e) => setFilters({ ...filters, is_active: e.target.value })}
                className="galleries-filter-select"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="1">🟢 Kích hoạt</option>
                <option value="0">🔴 Không kích hoạt</option>
              </select>
            </div>
          </div>
          <div className="galleries-filters-right">
            <button type="submit" className="galleries-btn-search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
              Tìm kiếm
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="galleries-btn-reset"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9m0 0v6m0-6h-6"/>
              </svg>
              Xóa lọc
            </button>
          </div>
        </form>
        <div className="galleries-stats">
          <span className="galleries-count">Tổng: {galleries.length} ảnh</span>
        </div>
      </div>

      {/* Grid */}
      <div className="galleries-grid">
        {galleries.length === 0 ? (
          <div className="galleries-empty">
            <div className="galleries-empty-icon">🖼️</div>
            <p>Chưa có ảnh nào trong thư viện</p>
            <Link href="/admin/galleries/create" className="galleries-empty-link">
              Thêm ảnh mới
            </Link>
          </div>
        ) : (
          galleries.map((gallery) => (
            <div key={gallery.id} className="galleries-card">
              <div className="galleries-card-image-wrapper">
                <img 
                  src={gallery.image_path} 
                  alt={gallery.title} 
                  className="galleries-card-image"
                />
                <div className="galleries-card-image-overlay"></div>
              </div>
              <div className="galleries-card-body">
                <h4 className="galleries-card-title">{gallery.title || 'Chưa có tiêu đề'}</h4>
                <p className="galleries-card-description">
                  {gallery.description ? gallery.description : '—'}
                </p>
                <div className="galleries-card-footer">
                  <span className={`galleries-card-status galleries-card-status-${gallery.is_active ? 'active' : 'inactive'}`}>
                    {gallery.is_active ? '🟢 Kích hoạt' : '🔴 Không kích hoạt'}
                  </span>
                  <div className="galleries-card-actions">
                    <Link 
                      href={`/admin/galleries/edit/${gallery.id}`} 
                      className="galleries-btn-edit"
                    >
                      ✏️ Sửa
                    </Link>
                    <button
                      onClick={() => handleDelete(gallery.id)}
                      className="galleries-btn-delete"
                    >
                      🗑️ Xóa
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.last_page > 1 && (
        <div className="galleries-pagination">
          <div className="galleries-pagination-info">
            Hiển thị {galleries.length} / {pagination.total} ảnh
          </div>
          <div className="galleries-pagination-buttons">
            <button
              onClick={() => handlePageChange(pagination.current_page - 1)}
              disabled={pagination.current_page <= 1}
              className="galleries-pagination-btn"
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
                  className={`galleries-pagination-btn ${
                    pageNum === pagination.current_page ? 'galleries-pagination-active' : ''
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(pagination.current_page + 1)}
              disabled={pagination.current_page >= pagination.last_page}
              className="galleries-pagination-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="galleries-footer">
        <p>🌿 © 2024 Cửa hàng cây cảnh - Quản lý thư viện ảnh</p>
      </div>
    </div>
  );
}