'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getProduct, updateProduct, getCategories } from '@/services/adminApi';
import './edit-product.css';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);

  const [form, setForm] = useState({
    name: '',
    price: '',
    category_id: '',
    summary: '',
    description: '',
    technic_info: '',
    code: '',
    thumbnail: '',
    is_new: false,
    is_featured: false,
    sort_order: 0,
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load categories trước
        const categoriesData = await getCategories();
        setCategories(categoriesData || []);

        // Load product
        const data = await getProduct(id);
        setForm({
          name: data.name || '',
          price: data.price || '',
          category_id: data.category_id || '',
          summary: data.summary || '',
          description: data.description || '',
          technic_info: data.technic_info || '',
          code: data.code || '',
          thumbnail: data.thumbnail || '',
          is_new: data.is_new || false,
          is_featured: data.is_featured || false,
          sort_order: data.sort_order || 0,
        });
      } catch (err) {
        setError('Lỗi tải dữ liệu. Vui lòng thử lại.');
        console.error('Load error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== undefined && value !== null && key !== 'thumbnail') {
        if (typeof value === 'boolean') {
          formData.append(key, value ? '1' : '0');
        } else {
          formData.append(key, String(value));
        }
      }
    });
    if (file) formData.append('thumbnail_file', file);

    try {
      await updateProduct(id, formData);
      setSuccess('✅ Cập nhật sản phẩm thành công!');
      setTimeout(() => {
        router.push('/admin/products');
      }, 1500);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Lỗi cập nhật sản phẩm. Vui lòng kiểm tra lại.';
      setError(msg);
      console.error('Update error:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="edit-loading-container">
      <div className="edit-loading-spinner"></div>
      <p>Đang tải sản phẩm...</p>
    </div>
  );

  return (
    <div className="edit-container">
      <div className="edit-header">
        <div>
          <h1 className="edit-title">✏️ Sửa sản phẩm</h1>
          <p className="edit-subtitle">Cập nhật thông tin sản phẩm #{id}</p>
        </div>
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="edit-back-btn"
        >
          ← Quay lại
        </button>
      </div>

      {error && (
        <div className="edit-error">
          <span className="edit-error-icon">⚠️</span>
          <div>
            <strong>Lỗi:</strong> {error}
          </div>
        </div>
      )}

      {success && (
        <div className="edit-success">
          <span className="edit-success-icon">✅</span>
          <div>
            <strong>Thành công:</strong> {success}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="edit-form">
        <div className="edit-grid">
          {/* Left Column */}
          <div className="edit-left">
            <div className="edit-card">
              <h3 className="edit-card-title">📋 Thông tin cơ bản</h3>
              
              <div className="edit-group">
                <label className="edit-label">
                  Tên sản phẩm <span className="edit-required">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="edit-input"
                  placeholder="Nhập tên sản phẩm"
                  required
                />
              </div>

              <div className="edit-row">
                <div className="edit-group">
                  <label className="edit-label">Giá (VNĐ)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="edit-input"
                    placeholder="0"
                  />
                </div>
                <div className="edit-group">
                  <label className="edit-label">Mã sản phẩm</label>
                  <input
                    type="text"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    className="edit-input"
                    placeholder="SP-001"
                  />
                </div>
              </div>

              <div className="edit-group">
                <label className="edit-label">Danh mục</label>
                <select
                  value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  className="edit-select"
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.parent?.name ? `📁 ${cat.parent.name} → ` : ''}{cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="edit-group">
                <label className="edit-label">Tóm tắt</label>
                <textarea
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  className="edit-textarea"
                  rows={3}
                  placeholder="Tóm tắt ngắn về sản phẩm"
                />
              </div>

              <div className="edit-group">
                <label className="edit-label">Mô tả chi tiết</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="edit-textarea"
                  rows={5}
                  placeholder="Mô tả chi tiết về sản phẩm"
                />
              </div>

              <div className="edit-group">
                <label className="edit-label">Thông số kỹ thuật</label>
                <textarea
                  value={form.technic_info}
                  onChange={(e) => setForm({ ...form, technic_info: e.target.value })}
                  className="edit-textarea"
                  rows={4}
                  placeholder="Thông số kỹ thuật của sản phẩm"
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="edit-right">
            <div className="edit-card">
              <h3 className="edit-card-title">⚙️ Cài đặt</h3>
              
              <div className="edit-group">
                <label className="edit-label">Thứ tự hiển thị</label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                  className="edit-input"
                  placeholder="0"
                />
              </div>

              <div className="edit-checkbox-group">
                <label className="edit-checkbox">
                  <input
                    type="checkbox"
                    checked={form.is_new}
                    onChange={(e) => setForm({ ...form, is_new: e.target.checked })}
                  />
                  <span className="edit-checkbox-label">🆕 Sản phẩm mới</span>
                </label>
                <label className="edit-checkbox">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                  />
                  <span className="edit-checkbox-label">⭐ Nổi bật</span>
                </label>
              </div>
            </div>

            <div className="edit-card">
              <h3 className="edit-card-title">🖼️ Ảnh sản phẩm</h3>
              
              <div className="edit-upload">
                <div className="edit-upload-area">
                  <div className="edit-upload-icon">📸</div>
                  <p className="edit-upload-text">Kéo thả ảnh vào đây hoặc</p>
                  <label className="edit-upload-btn">
                    Chọn ảnh mới
                    <input
                      type="file"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="edit-upload-input"
                    />
                  </label>
                  {file && (
                    <p className="edit-upload-filename">📎 {file.name}</p>
                  )}
                </div>
              </div>

              {form.thumbnail && !file && (
                <div className="edit-current-image">
                  <p className="edit-current-label">Ảnh hiện tại:</p>
                  <img 
                    src={form.thumbnail} 
                    alt="Current product" 
                    className="edit-current-img"
                  />
                </div>
              )}
            </div>

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
                  '💾 Cập nhật sản phẩm'
                )}
              </button>
              <button
                type="button"
                onClick={() => router.push('/admin/products')}
                className="edit-btn-cancel"
              >
                ❌ Hủy bỏ
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}