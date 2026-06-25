'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getPosts, deletePost } from '@/services/adminApi';
import './posts.css';

export default function PostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  });
  const [filters, setFilters] = useState({ search: '', is_active: '' });

  const fetchPosts = async (page = 1) => {
    setLoading(true);
    try {
      const params = { ...filters, page, per_page: 20 };
      const res = await getPosts(params);
      setPosts(res.data || []);
      setPagination({
        current_page: res.current_page || 1,
        last_page: res.last_page || 1,
        per_page: res.per_page || 20,
        total: res.total || 0,
      });
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [filters]);

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa bài viết này?')) return;
    try {
      await deletePost(id);
      fetchPosts(pagination.current_page);
    } catch (error) {
      console.error('Delete error:', error);
      alert('Xóa thất bại');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.last_page) {
      fetchPosts(page);
    }
  };

  const handleResetFilters = () => {
    setFilters({ search: '', is_active: '' });
    fetchPosts(1);
  };

  if (loading) return (
    <div className="posts-loading-container">
      <div className="posts-loading-spinner"></div>
      <p>Đang tải bài viết...</p>
    </div>
  );

  return (
    <div className="posts-container">
      {/* Header */}
      <div className="posts-header">
        <div>
          <h1 className="posts-title">📰 Quản lý tin tức</h1>
          <p className="posts-subtitle">
            Tổng số bài viết: <span className="posts-total-count">{pagination.total}</span>
          </p>
        </div>
        <Link href="/admin/posts/create" className="posts-add-btn">
          <span className="border-glow"></span>
          <span className="posts-add-icon">+</span>
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
      <div className="posts-filters-wrapper">
        <form onSubmit={handleSearch} className="posts-filters">
          <div className="posts-filters-left">
            <div className="posts-filter-group">
              <span className="posts-filter-icon">🔍</span>
              <input
                type="text"
                placeholder="Tìm kiếm theo tiêu đề..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="posts-filter-input"
              />
            </div>
            <div className="posts-filter-group">
              <select
                value={filters.is_active}
                onChange={(e) => setFilters({ ...filters, is_active: e.target.value })}
                className="posts-filter-select"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="1">🟢 Kích hoạt</option>
                <option value="0">🔴 Không kích hoạt</option>
              </select>
            </div>
          </div>
          <div className="posts-filters-right">
            <button type="submit" className="posts-btn-search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
              Tìm kiếm
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="posts-btn-reset"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9m0 0v6m0-6h-6"/>
              </svg>
              Xóa lọc
            </button>
          </div>
        </form>
        <div className="posts-stats">
          <span className="posts-count">Tổng: {posts.length} bài viết</span>
        </div>
      </div>

      {/* Table */}
      <div className="posts-table-wrapper">
        <div className="posts-table-scroll">
          <table className="posts-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Ảnh</th>
                <th>Tiêu đề</th>
                <th>Danh mục</th>
                <th>Trạng thái</th>
                <th>Ngày đăng</th>
                <th className="text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="posts-empty">
                    <div className="posts-empty-icon">📰</div>
                    <p>Chưa có bài viết nào</p>
                    <Link href="/admin/posts/create" className="posts-empty-link">
                      Thêm bài viết mới
                    </Link>
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id}>
                    <td className="posts-id">#{post.id}</td>
                    <td>
                      {post.thumbnail ? (
                        <div className="posts-thumbnail-wrapper">
                          <img src={post.thumbnail} alt={post.title} className="posts-thumbnail" />
                        </div>
                      ) : (
                        <span className="posts-no-thumbnail">📷</span>
                      )}
                    </td>
                    <td>
                      <div className="posts-title-text">{post.title}</div>
                    </td>
                    <td>
                      <span className="posts-category">
                        {post.category?.name || '—'}
                      </span>
                    </td>
                    <td>
                      <span className={`posts-status posts-status-${post.is_active ? 'active' : 'inactive'}`}>
                        {post.is_active ? '🟢 Kích hoạt' : '🔴 Không kích hoạt'}
                      </span>
                    </td>
                    <td className="posts-date">
                      {post.published_at ? new Date(post.published_at).toLocaleDateString('vi-VN') : '—'}
                    </td>
                    <td>
                      <div className="posts-actions">
                        <Link 
                          href={`/admin/posts/edit/${post.id}`} 
                          className="posts-btn-edit"
                        >
                          ✏️ Sửa
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="posts-btn-delete"
                        >
                          🗑️ Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.last_page > 1 && (
          <div className="posts-pagination">
            <div className="posts-pagination-info">
              Hiển thị {posts.length} / {pagination.total} bài viết
            </div>
            <div className="posts-pagination-buttons">
              <button
                onClick={() => handlePageChange(pagination.current_page - 1)}
                disabled={pagination.current_page <= 1}
                className="posts-pagination-btn"
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
                    className={`posts-pagination-btn ${
                      pageNum === pagination.current_page ? 'posts-pagination-active' : ''
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(pagination.current_page + 1)}
                disabled={pagination.current_page >= pagination.last_page}
                className="posts-pagination-btn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="posts-footer">
        <p>🌿 © 2024 Cửa hàng cây cảnh - Quản lý tin tức</p>
      </div>
    </div>
  );
}