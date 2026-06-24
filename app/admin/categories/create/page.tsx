'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createCategory, getCategories } from '@/services/adminApi';
import './categories-create.css';

export default function CreateCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    parent_id: '',
    sort_order: 0,
    is_home: false,
    is_active: true,
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = {
        ...form,
        parent_id: form.parent_id ? parseInt(form.parent_id) : null,
        sort_order: parseInt(form.sort_order as any) || 0,
      };
      await createCategory(data);
      router.push('/admin/categories');
    } catch (err: any) {
      setError(err.message || 'Lỗi tạo danh mục');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="category-create-container">
      {/* Header */}
      <div className="category-create-header">
        <div className="category-create-header-left">
          <h1 className="category-create-title">
            <span className="category-create-title-icon">📂</span>
            Thêm danh mục mới
          </h1>
          <p className="category-create-subtitle">Tạo danh mục sản phẩm mới cho cửa hàng</p>
        </div>
        <Link href="/admin/categories" className="category-create-back-btn">
          <svg className="back-btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          <span className="back-btn-text">Quay lại</span>
        </Link>
      </div>

      {/* Form */}
      <div className="category-create-form-wrapper">
        {error && (
          <div className="category-create-error">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="category-create-form">
          <div className="category-create-form-grid">
            {/* Left Column */}
            <div className="category-create-form-left">
              <div className="category-create-form-group">
                <label className="category-create-label">
                  Tên danh mục <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="category-create-input"
                  placeholder="Nhập tên danh mục..."
                  required
                />
                <p className="category-create-hint">Tên danh mục sẽ hiển thị trên cửa hàng</p>
              </div>

              <div className="category-create-form-group">
                <label className="category-create-label">
                  Danh mục cha
                </label>
                <select
                  value={form.parent_id}
                  onChange={(e) => setForm({ ...form, parent_id: e.target.value })}
                  className="category-create-select"
                >
                  <option value="">Không có danh mục cha</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <p className="category-create-hint">Chọn danh mục cha nếu có</p>
              </div>

              <div className="category-create-form-group">
                <label className="category-create-label">
                  Thứ tự hiển thị
                </label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                  className="category-create-input"
                  placeholder="0"
                  min="0"
                />
                <p className="category-create-hint">Số nhỏ hơn sẽ hiển thị trước</p>
              </div>
            </div>

            {/* Right Column */}
            <div className="category-create-form-right">
              <div className="category-create-form-group">
                <label className="category-create-label">Trạng thái</label>
                <div className="category-create-toggle-group">
                  <label className="category-create-toggle">
                    <input
                      type="checkbox"
                      checked={form.is_active}
                      onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    />
                    <span className="category-create-toggle-slider"></span>
                    <span className="category-create-toggle-label">
                      {form.is_active ? '🟢 Hoạt động' : '🔴 Ngừng hoạt động'}
                    </span>
                  </label>
                </div>
                <p className="category-create-hint">Danh mục hoạt động sẽ hiển thị trên cửa hàng</p>
              </div>

              <div className="category-create-form-group">
                <label className="category-create-label">Hiển thị trang chủ</label>
                <div className="category-create-toggle-group">
                  <label className="category-create-toggle">
                    <input
                      type="checkbox"
                      checked={form.is_home}
                      onChange={(e) => setForm({ ...form, is_home: e.target.checked })}
                    />
                    <span className="category-create-toggle-slider"></span>
                    <span className="category-create-toggle-label">
                      {form.is_home ? '✅ Hiển thị' : '❌ Không hiển thị'}
                    </span>
                  </label>
                </div>
                <p className="category-create-hint">Danh mục sẽ xuất hiện trên trang chủ</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="category-create-actions">
            <Link href="/admin/categories" className="category-create-btn-cancel">
              <svg className="cancel-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
              Hủy bỏ
            </Link>
            <button 
              type="submit" 
              className="category-create-btn-submit"
              disabled={loading}
            >
              {loading ? (
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
                  Lưu danh mục
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}