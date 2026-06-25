'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createCategory, getCategories } from '@/services/adminApi';
import './categories-create.css';

export default function CreateCategoryPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
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
    setSaving(true);
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
      setSaving(false);
    }
  };

  return (
    <div className="create-container">
      {/* Header */}
      <div className="create-header">
        <div>
          <h1 className="create-title">📂 Thêm danh mục mới</h1>
          <p className="create-subtitle">Tạo danh mục sản phẩm mới cho cửa hàng</p>
        </div>
        <Link href="/admin/categories" className="create-back-btn">
          ← Quay lại
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="create-error">
          <span className="create-error-icon">⚠️</span>
          <div>
            <strong>Lỗi:</strong> {error}
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="create-form">
        <div className="create-grid">
          {/* Left Column */}
          <div className="create-left">
            <div className="create-card">
              <h3 className="create-card-title">📋 Thông tin danh mục</h3>
              
              <div className="create-group">
                <label className="create-label">
                  Tên danh mục <span className="create-required">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="create-input"
                  placeholder="Nhập tên danh mục"
                  required
                />
                <p className="create-hint">Tên danh mục sẽ hiển thị trên cửa hàng</p>
              </div>

              <div className="create-group">
                <label className="create-label">Danh mục cha</label>
                <select
                  value={form.parent_id}
                  onChange={(e) => setForm({ ...form, parent_id: e.target.value })}
                  className="create-select"
                >
                  <option value="">Không có danh mục cha</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <p className="create-hint">Chọn danh mục cha nếu có</p>
              </div>

              <div className="create-group">
                <label className="create-label">Thứ tự hiển thị</label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                  className="create-input"
                  placeholder="0"
                  min="0"
                />
                <p className="create-hint">Số nhỏ hơn sẽ hiển thị trước</p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="create-right">
            <div className="create-card">
              <h3 className="create-card-title">⚙️ Cài đặt</h3>
              
              <div className="create-group">
                <label className="create-label">Trạng thái</label>
                <div className="create-toggle-group">
                  <label className="create-toggle">
                    <input
                      type="checkbox"
                      checked={form.is_active}
                      onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    />
                    <span className="create-toggle-slider"></span>
                    <span className="create-toggle-label">
                      {form.is_active ? '🟢 Hoạt động' : '🔴 Ngừng hoạt động'}
                    </span>
                  </label>
                </div>
                <p className="create-hint">Danh mục hoạt động sẽ hiển thị trên cửa hàng</p>
              </div>

              <div className="create-group">
                <label className="create-label">Hiển thị trang chủ</label>
                <div className="create-toggle-group">
                  <label className="create-toggle">
                    <input
                      type="checkbox"
                      checked={form.is_home}
                      onChange={(e) => setForm({ ...form, is_home: e.target.checked })}
                    />
                    <span className="create-toggle-slider"></span>
                    <span className="create-toggle-label">
                      {form.is_home ? '✅ Hiển thị' : '❌ Không hiển thị'}
                    </span>
                  </label>
                </div>
                <p className="create-hint">Danh mục sẽ xuất hiện trên trang chủ</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="create-actions">
          <button 
            type="submit" 
            className="create-btn-save" 
            disabled={saving}
          >
            {saving ? (
              <>
                <span className="create-spinner"></span>
                Đang lưu...
              </>
            ) : (
              '💾 Lưu danh mục'
            )}
          </button>
          <Link
            href="/admin/categories"
            className="create-btn-cancel"
          >
            ❌ Hủy bỏ
          </Link>
        </div>
      </form>
    </div>
  );
}