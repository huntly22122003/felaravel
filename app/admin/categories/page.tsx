'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCategories, deleteCategory } from '@/services/adminApi';
import './categories.css';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa danh mục này?')) return;
    try {
      await deleteCategory(id);
      setCategories(categories.filter(c => c.id !== id));
    } catch (err) {
      alert('Xóa thất bại');
    }
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.slug?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="categories-loading-container">
      <div className="categories-loading-spinner"></div>
      <p>Đang tải danh mục...</p>
    </div>
  );

  return (
    <div className="categories-container">
      {/* Header */}
      <div className="categories-header">
        <div>
          <h1 className="categories-title">📂 Quản lý danh mục</h1>
          <p className="categories-subtitle">Quản lý danh mục sản phẩm của cửa hàng</p>
        </div>
        <Link href="/admin/categories/create" className="categories-add-btn">
          <span className="border-glow"></span>
          <span className="categories-add-icon">+</span>
          <span className="btn-text">Thêm mới</span>
          <span className="particle"></span>
          <span className="particle"></span>
          <span className="particle"></span>
          <span className="particle"></span>
          <span className="particle"></span>
          <span className="particle"></span>
        </Link>
      </div>

      {/* Toolbar */}
      <div className="categories-toolbar">
        <div className="categories-search">
          <span className="categories-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Tìm kiếm danh mục..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="categories-search-input"
          />
          {searchTerm && (
            <button 
              className="categories-search-clear"
              onClick={() => setSearchTerm('')}
            >
              ✕
            </button>
          )}
        </div>
        <div className="categories-stats">
          <span className="categories-count">Tổng: {filteredCategories.length} danh mục</span>
        </div>
      </div>

      {/* Table */}
      <div className="categories-table-wrapper">
        <table className="categories-table">
          <thead>
            <tr>
              <th className="col-id">ID</th>
              <th className="col-name">Tên danh mục</th>
              <th className="col-slug">Slug</th>
              <th className="col-parent">Danh mục cha</th>
              <th className="col-order">Thứ tự</th>
              <th className="col-products">Sản phẩm</th>
              <th className="col-status">Trạng thái</th>
              <th className="col-actions">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.length === 0 ? (
              <tr>
                <td colSpan={8} className="categories-empty">
                  <div className="categories-empty-icon">📁</div>
                  <h3>Chưa có danh mục nào</h3>
                  <p>Bắt đầu thêm danh mục mới cho cửa hàng của bạn</p>
                  <Link href="/admin/categories/create" className="categories-empty-link">
                    + Thêm danh mục mới
                  </Link>
                </td>
              </tr>
            ) : (
              filteredCategories.map((cat: any) => (
                <tr key={cat.id}>
                  <td className="categories-id">#{String(cat.id).padStart(3, '0')}</td>
                  <td>
                    <div className="categories-name">
                      <div className="categories-name-text">{cat.name}</div>
                      {cat.description && (
                        <div className="categories-description">{cat.description}</div>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="categories-slug">{cat.slug || '-'}</span>
                  </td>
                  <td>
                    {cat.parent ? (
                      <span className="categories-parent">
                        📁 {cat.parent.name}
                      </span>
                    ) : (
                      <span className="categories-parent-none">-</span>
                    )}
                  </td>
                  <td>
                    <span className="categories-order">{cat.sort_order || 0}</span>
                  </td>
                  <td>
                    <span className="categories-product-count">
                      {cat.product_count || 0} sản phẩm
                    </span>
                  </td>
                  <td>
                    <span className={`categories-status categories-status-${cat.is_active ? 'active' : 'inactive'}`}>
                      <span className="status-dot"></span>
                      {cat.is_active ? 'Hoạt động' : 'Ngừng'}
                    </span>
                  </td>
                  <td>
                    <div className="categories-actions">
                      <Link 
                        href={`/admin/categories/edit/${cat.id}`} 
                        className="categories-btn-edit"
                        title="Chỉnh sửa"
                      >
                        ✏️ Sửa
                      </Link>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="categories-btn-delete"
                        title="Xóa"
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

      {/* Footer */}
      <div className="categories-footer">
        <p>📂 © 2024 Cửa hàng cây cảnh - Quản lý danh mục</p>
      </div>
    </div>
  );
}