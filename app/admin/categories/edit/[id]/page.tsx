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
  const [saving, setSaving] = useState(false);
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
    setSaving(true);
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
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-container">
        <div className="edit-loading-container">
          <div className="edit-loading-spinner"></div>
          <p>Đang tải danh mục...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-container">
      {/* Header */}
      <div className="edit-header">
        <div>
          <h1 className="edit-title">✏️ Sửa danh mục</h1>
          <p className="edit-subtitle">Cập nhật thông tin danh mục #{id}</p>
        </div>
        <Link href="/admin/categories" className="edit-back-btn">
          ← Quay lại
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="edit-error">
          <span className="edit-error-icon">⚠️</span>
          <div>
            <strong>Lỗi:</strong> {error}
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="edit-form">
        <div className="edit-grid">
          {/* Left Column */}
          <div className="edit-left">
            <div className="edit-card">
              <h3 className="edit-card-title">📋 Thông tin danh mục</h3>
              
              <div className="edit-group">
                <label className="edit-label">
                  Tên danh mục <span className="edit-required">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="edit-input"
                  placeholder="Nhập tên danh mục"
                  required
                />
                <p className="edit-hint">Tên danh mục sẽ hiển thị trên cửa hàng</p>
              </div>

              <div className="edit-group">
                <label className="edit-label">Danh mục cha</label>
                <select
                  value={form.parent_id}
                  onChange={(e) => setForm({ ...form, parent_id: e.target.value })}
                  className="edit-select"
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
                <p className="edit-hint">Chọn danh mục cha nếu có</p>
              </div>

              <div className="edit-group">
                <label className="edit-label">Thứ tự hiển thị</label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                  className="edit-input"
                  placeholder="0"
                  min="0"
                />
                <p className="edit-hint">Số nhỏ hơn sẽ hiển thị trước</p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="edit-right">
            <div className="edit-card">
              <h3 className="edit-card-title">⚙️ Cài đặt</h3>
              
              <div className="edit-group">
                <label className="edit-label">Trạng thái</label>
                <div className="edit-toggle-group">
                  <label className="edit-toggle">
                    <input
                      type="checkbox"
                      checked={form.is_active}
                      onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    />
                    <span className="edit-toggle-slider"></span>
                    <span className="edit-toggle-label">
                      {form.is_active ? '🟢 Hoạt động' : '🔴 Ngừng hoạt động'}
                    </span>
                  </label>
                </div>
                <p className="edit-hint">Danh mục hoạt động sẽ hiển thị trên cửa hàng</p>
              </div>

              <div className="edit-group">
                <label className="edit-label">Hiển thị trang chủ</label>
                <div className="edit-toggle-group">
                  <label className="edit-toggle">
                    <input
                      type="checkbox"
                      checked={form.is_home}
                      onChange={(e) => setForm({ ...form, is_home: e.target.checked })}
                    />
                    <span className="edit-toggle-slider"></span>
                    <span className="edit-toggle-label">
                      {form.is_home ? '✅ Hiển thị' : '❌ Không hiển thị'}
                    </span>
                  </label>
                </div>
                <p className="edit-hint">Danh mục sẽ xuất hiện trên trang chủ</p>
              </div>
            </div>

            <div className="edit-card">
              <h3 className="edit-card-title">ℹ️ Thông tin</h3>
              <div className="edit-info-box">
                <div className="edit-info-item">
                  <span className="edit-info-label">ID danh mục:</span>
                  <span className="edit-info-value">#{id}</span>
                </div>
                <div className="edit-info-item">
                  <span className="edit-info-label">Ngày tạo:</span>
                  <span className="edit-info-value">{new Date().toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="edit-actions">
          <button 
            type="submit" 
            className="edit-btn-save" 
            disabled={saving}
          >
            {saving ? (
              <>
                <span className="edit-spinner"></span>
                Đang lưu...
              </>
            ) : (
              '💾 Cập nhật danh mục'
            )}
          </button>
          <Link
            href="/admin/categories"
            className="edit-btn-cancel"
          >
            ❌ Hủy bỏ
          </Link>
        </div>
      </form>
    </div>
  );
}