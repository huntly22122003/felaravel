// app/admin/categories/edit/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { getCategory, updateCategory, getCategories } from '@/services/adminApi';
import './categories-edit.css';

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);

  const [form, setForm] = useState({
    name: '',
    parent_id: '',
    sort_order: 0,
    is_home: false,
    is_active: true,
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getCategory(id), getCategories()])
      .then(([cat, cats]) => {
        setForm({
          name: cat.name || '',
          parent_id: cat.parent_id || '',
          sort_order: cat.sort_order || 0,
          is_home: cat.is_home || false,
          is_active: cat.is_active !== undefined ? cat.is_active : true,
        });
        setCategories(cats || []);
      })
      .catch(() => setError('Lỗi tải danh mục'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const data = {
        ...form,
        parent_id: form.parent_id ? parseInt(form.parent_id) : null,
        sort_order: parseInt(form.sort_order as any) || 0,
      };
      await updateCategory(id, data);
      router.push('/admin/categories');
    } catch (err: any) {
      setError(err.message || 'Lỗi cập nhật danh mục');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="category-edit-container">
        <div className="category-edit-loading">
          <div className="category-edit-spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="category-edit-container">
      {/* Header */}
      <div className="category-edit-header">
        <div className="category-edit-header-left">
          <h1 className="category-edit-title">
            <span className="category-edit-title-icon">✏️</span>
            Sửa danh mục
          </h1>
          <p className="category-edit-subtitle">Cập nhật thông tin danh mục sản phẩm</p>
        </div>
        <Link href="/admin/categories" className="category-edit-back-btn">
          <svg className="back-btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          <span className="back-btn-text">Quay lại</span>
        </Link>
      </div>

      {/* Form */}
      <div className="category-edit-form-wrapper">
        {error && (
          <div className="category-edit-error">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="category-edit-form">
          <div className="category-edit-form-grid">
            {/* Left Column */}
            <div className="category-edit-form-left">
              <div className="category-edit-form-group">
                <label className="category-edit-label">
                  Tên danh mục <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="category-edit-input"
                  placeholder="Nhập tên danh mục..."
                  required
                />
                <p className="category-edit-hint">Tên danh mục sẽ hiển thị trên cửa hàng</p>
              </div>

              <div className="category-edit-form-group">
                <label className="category-edit-label">
                  Danh mục cha
                </label>
                <select
                  value={form.parent_id}
                  onChange={(e) => setForm({ ...form, parent_id: e.target.value })}
                  className="category-edit-select"
                >
                  <option value="">Không có danh mục cha</option>
                  {categories
                    .filter(c => c.id !== id)
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
                <p className="category-edit-hint">Chọn danh mục cha nếu có</p>
              </div>

              <div className="category-edit-form-group">
                <label className="category-edit-label">
                  Thứ tự hiển thị
                </label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                  className="category-edit-input"
                  placeholder="0"
                  min="0"
                />
                <p className="category-edit-hint">Số nhỏ hơn sẽ hiển thị trước</p>
              </div>
            </div>

            {/* Right Column */}
            <div className="category-edit-form-right">
              <div className="category-edit-form-group">
                <label className="category-edit-label">Trạng thái</label>
                <div className="category-edit-toggle-group">
                  <label className="category-edit-toggle">
                    <input
                      type="checkbox"
                      checked={form.is_active}
                      onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    />
                    <span className="category-edit-toggle-slider"></span>
                    <span className="category-edit-toggle-label">
                      {form.is_active ? '🟢 Hoạt động' : '🔴 Ngừng hoạt động'}
                    </span>
                  </label>
                </div>
                <p className="category-edit-hint">Danh mục hoạt động sẽ hiển thị trên cửa hàng</p>
              </div>

              <div className="category-edit-form-group">
                <label className="category-edit-label">Hiển thị trang chủ</label>
                <div className="category-edit-toggle-group">
                  <label className="category-edit-toggle">
                    <input
                      type="checkbox"
                      checked={form.is_home}
                      onChange={(e) => setForm({ ...form, is_home: e.target.checked })}
                    />
                    <span className="category-edit-toggle-slider"></span>
                    <span className="category-edit-toggle-label">
                      {form.is_home ? '✅ Hiển thị' : '❌ Không hiển thị'}
                    </span>
                  </label>
                </div>
                <p className="category-edit-hint">Danh mục sẽ xuất hiện trên trang chủ</p>
              </div>

              {/* ID Info */}
              <div className="category-edit-form-group category-edit-info-box">
                <div className="category-edit-info-item">
                  <span className="category-edit-info-label">ID danh mục:</span>
                  <span className="category-edit-info-value">#{id}</span>
                </div>
                <div className="category-edit-info-item">
                  <span className="category-edit-info-label">Ngày tạo:</span>
                  <span className="category-edit-info-value">{new Date().toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="category-edit-actions">
            <Link href="/admin/categories" className="category-edit-btn-cancel">
              <svg className="cancel-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
              Hủy bỏ
            </Link>
            <button 
              type="submit" 
              className="category-edit-btn-submit"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="spinner"></span>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <svg className="submit-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"/>
                    <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"/>
                  </svg>
                  Cập nhật danh mục
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}