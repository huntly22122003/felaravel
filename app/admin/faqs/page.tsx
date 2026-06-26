'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getFaqs, deleteFaq } from '@/services/adminApi';
import './faqs.css';

export default function FaqsPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  });
  const [filters, setFilters] = useState({ search: '', is_active: '' });

  const fetchFaqs = async (page = 1) => {
    setLoading(true);
    try {
      const params = { ...filters, page, per_page: 20 };
      const res = await getFaqs(params);
      setFaqs(res.data || []);
      setPagination({
        current_page: res.current_page || 1,
        last_page: res.last_page || 1,
        per_page: res.per_page || 20,
        total: res.total || 0,
      });
    } catch (error) {
      console.error('Failed to fetch faqs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, [filters]);

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa câu hỏi này?')) return;
    try {
      await deleteFaq(id);
      fetchFaqs(pagination.current_page);
    } catch (error) {
      console.error('Delete error:', error);
      alert('Xóa thất bại');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFaqs(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.last_page) {
      fetchFaqs(page);
    }
  };

  const handleResetFilters = () => {
    setFilters({ search: '', is_active: '' });
    fetchFaqs(1);
  };

  if (loading) return (
    <div className="faqs-loading-container">
      <div className="faqs-loading-spinner"></div>
      <p>Đang tải câu hỏi thường gặp...</p>
    </div>
  );

  return (
    <div className="faqs-container">
      {/* Header */}
      <div className="faqs-header">
        <div>
          <h1 className="faqs-title">❓ Quản lý FAQ</h1>
          <p className="faqs-subtitle">
            Tổng số câu hỏi: <span className="faqs-total-count">{pagination.total}</span>
          </p>
        </div>
        <Link href="/admin/faqs/create" className="faqs-add-btn">
          <span className="border-glow"></span>
          <span className="faqs-add-icon">+</span>
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
      <div className="faqs-filters-wrapper">
        <form onSubmit={handleSearch} className="faqs-filters">
          <div className="faqs-filters-left">
            <div className="faqs-filter-group">
              <span className="faqs-filter-icon">🔍</span>
              <input
                type="text"
                placeholder="Tìm kiếm theo câu hỏi..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="faqs-filter-input"
              />
            </div>
            <div className="faqs-filter-group">
              <select
                value={filters.is_active}
                onChange={(e) => setFilters({ ...filters, is_active: e.target.value })}
                className="faqs-filter-select"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="1">🟢 Kích hoạt</option>
                <option value="0">🔴 Không kích hoạt</option>
              </select>
            </div>
          </div>
          <div className="faqs-filters-right">
            <button type="submit" className="faqs-btn-search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
              Tìm kiếm
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="faqs-btn-reset"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9m0 0v6m0-6h-6"/>
              </svg>
              Xóa lọc
            </button>
          </div>
        </form>
        <div className="faqs-stats">
          <span className="faqs-count">Tổng: {faqs.length} câu hỏi</span>
        </div>
      </div>

      {/* Table */}
      <div className="faqs-table-wrapper">
        <div className="faqs-table-scroll">
          <table className="faqs-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Câu hỏi</th>
                <th>Trả lời</th>
                <th>Thứ tự</th>
                <th>Trạng thái</th>
                <th className="text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {faqs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="faqs-empty">
                    <div className="faqs-empty-icon">❓</div>
                    <p>Chưa có câu hỏi nào</p>
                    <Link href="/admin/faqs/create" className="faqs-empty-link">
                      Thêm câu hỏi mới
                    </Link>
                  </td>
                </tr>
              ) : (
                faqs.map((faq) => (
                  <tr key={faq.id}>
                    <td className="faqs-id">#{faq.id}</td>
                    <td>
                      <div className="faqs-question">
                        {faq.question.length > 80 ? faq.question.substring(0, 80) + '...' : faq.question}
                      </div>
                    </td>
                    <td>
                      <div className="faqs-answer">
                        {faq.answer ? (faq.answer.length > 80 ? faq.answer.substring(0, 80) + '...' : faq.answer) : '—'}
                      </div>
                    </td>
                    <td>
                      <span className="faqs-order">{faq.sort_order || 0}</span>
                    </td>
                    <td>
                      <span className={`faqs-status faqs-status-${faq.is_active ? 'active' : 'inactive'}`}>
                        {faq.is_active ? '🟢 Kích hoạt' : '🔴 Không kích hoạt'}
                      </span>
                    </td>
                    <td>
                      <div className="faqs-actions">
                        <Link 
                          href={`/admin/faqs/edit/${faq.id}`} 
                          className="faqs-btn-edit"
                        >
                          ✏️ Sửa
                        </Link>
                        <button
                          onClick={() => handleDelete(faq.id)}
                          className="faqs-btn-delete"
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
          <div className="faqs-pagination">
            <div className="faqs-pagination-info">
              Hiển thị {faqs.length} / {pagination.total} câu hỏi
            </div>
            <div className="faqs-pagination-buttons">
              <button
                onClick={() => handlePageChange(pagination.current_page - 1)}
                disabled={pagination.current_page <= 1}
                className="faqs-pagination-btn"
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
                    className={`faqs-pagination-btn ${
                      pageNum === pagination.current_page ? 'faqs-pagination-active' : ''
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(pagination.current_page + 1)}
                disabled={pagination.current_page >= pagination.last_page}
                className="faqs-pagination-btn"
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
      <div className="faqs-footer">
        <p>🌿 © 2024 Cửa hàng cây cảnh - Quản lý FAQ</p>
      </div>
    </div>
  );
}