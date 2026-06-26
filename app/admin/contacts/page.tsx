'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getContacts, deleteContact } from '@/services/adminApi';
import './contacts.css';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  });
  const [filters, setFilters] = useState({ search: '', is_read: '' });

  const fetchContacts = async (page = 1) => {
    setLoading(true);
    try {
      const params = { ...filters, page, per_page: 20 };
      const res = await getContacts(params);
      setContacts(res.data || []);
      setPagination({
        current_page: res.current_page || 1,
        last_page: res.last_page || 1,
        per_page: res.per_page || 20,
        total: res.total || 0,
      });
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [filters]);

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa liên hệ này?')) return;
    try {
      await deleteContact(id);
      fetchContacts(pagination.current_page);
    } catch (error) {
      console.error('Delete error:', error);
      alert('Xóa thất bại');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchContacts(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.last_page) {
      fetchContacts(page);
    }
  };

  const handleResetFilters = () => {
    setFilters({ search: '', is_read: '' });
    fetchContacts(1);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN') + ' ' + d.toLocaleTimeString('vi-VN');
  };

  if (loading) return (
    <div className="contacts-loading-container">
      <div className="contacts-loading-spinner"></div>
      <p>Đang tải liên hệ...</p>
    </div>
  );

  return (
    <div className="contacts-container">
      {/* Header */}
      <div className="contacts-header">
        <div>
          <h1 className="contacts-title">💬 Quản lý liên hệ</h1>
          <p className="contacts-subtitle">
            Tổng số liên hệ: <span className="contacts-total-count">{pagination.total}</span>
          </p>
        </div>
        <Link href="/admin/contacts/create" className="contacts-add-btn">
          <span className="border-glow"></span>
          <span className="contacts-add-icon">+</span>
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
      <div className="contacts-filters-wrapper">
        <form onSubmit={handleSearch} className="contacts-filters">
          <div className="contacts-filters-left">
            <div className="contacts-filter-group">
              <span className="contacts-filter-icon">🔍</span>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email, điện thoại..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="contacts-filter-input"
              />
            </div>
            <div className="contacts-filter-group">
              <select
                value={filters.is_read}
                onChange={(e) => setFilters({ ...filters, is_read: e.target.value })}
                className="contacts-filter-select"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="1">📖 Đã đọc</option>
                <option value="0">📩 Chưa đọc</option>
              </select>
            </div>
          </div>
          <div className="contacts-filters-right">
            <button type="submit" className="contacts-btn-search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
              Tìm kiếm
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="contacts-btn-reset"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9m0 0v6m0-6h-6"/>
              </svg>
              Xóa lọc
            </button>
          </div>
        </form>
        <div className="contacts-stats">
          <span className="contacts-count">Tổng: {contacts.length} liên hệ</span>
        </div>
      </div>

      {/* Table */}
      <div className="contacts-table-wrapper">
        <div className="contacts-table-scroll">
          <table className="contacts-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Họ tên</th>
                <th>Email / Điện thoại</th>
                <th>Chủ đề</th>
                <th>Trạng thái</th>
                <th>Ngày gửi</th>
                <th className="text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {contacts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="contacts-empty">
                    <div className="contacts-empty-icon">💬</div>
                    <p>Chưa có liên hệ nào</p>
                    <Link href="/admin/contacts/create" className="contacts-empty-link">
                      Thêm liên hệ mới
                    </Link>
                  </td>
                </tr>
              ) : (
                contacts.map((contact) => (
                  <tr key={contact.id}>
                    <td className="contacts-id">#{contact.id}</td>
                    <td>
                      <div className="contacts-name">{contact.fullname}</div>
                    </td>
                    <td>
                      <div className="contacts-info">
                        <span className="contacts-email">{contact.email || '—'}</span>
                        <span className="contacts-phone">{contact.phone || '—'}</span>
                      </div>
                    </td>
                    <td>
                      <span className="contacts-subject">{contact.subject || '—'}</span>
                    </td>
                    <td>
                      <span className={`contacts-status contacts-status-${contact.is_read ? 'read' : 'unread'}`}>
                        {contact.is_read ? '📖 Đã đọc' : '📩 Chưa đọc'}
                      </span>
                    </td>
                    <td className="contacts-date">{formatDate(contact.created_at)}</td>
                    <td>
                      <div className="contacts-actions">
                        <Link 
                          href={`/admin/contacts/edit/${contact.id}`} 
                          className="contacts-btn-edit"
                        >
                          ✏️ Sửa
                        </Link>
                        <button
                          onClick={() => handleDelete(contact.id)}
                          className="contacts-btn-delete"
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
          <div className="contacts-pagination">
            <div className="contacts-pagination-info">
              Hiển thị {contacts.length} / {pagination.total} liên hệ
            </div>
            <div className="contacts-pagination-buttons">
              <button
                onClick={() => handlePageChange(pagination.current_page - 1)}
                disabled={pagination.current_page <= 1}
                className="contacts-pagination-btn"
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
                    className={`contacts-pagination-btn ${
                      pageNum === pagination.current_page ? 'contacts-pagination-active' : ''
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(pagination.current_page + 1)}
                disabled={pagination.current_page >= pagination.last_page}
                className="contacts-pagination-btn"
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
      <div className="contacts-footer">
        <p>🌿 © 2024 Cửa hàng cây cảnh - Quản lý liên hệ</p>
      </div>
    </div>
  );
}