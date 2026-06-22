'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createProduct, updateProduct, getProduct } from '@/services/adminApi';
import './product-form.css'; // Sửa lại import

export default function ProductForm({ params }: { params?: { id: string } }) {
  const router = useRouter();
  const isEdit = !!params?.id;

  const [form, setForm] = useState({
    name: '',
    price: '',
    category_id: '',
    summary: '',
    description: '',
    technic_info: '',
    code: '',
    is_new: false,
    is_featured: false,
    sort_order: 0,
  });
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      loadProduct();
    }
  }, [isEdit, params]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const data = await getProduct(parseInt(params!.id!));
      setForm({
        name: data.name,
        price: data.price || '',
        category_id: data.category_id || '',
        summary: data.summary || '',
        description: data.description || '',
        technic_info: data.technic_info || '',
        code: data.code || '',
        is_new: data.is_new || false,
        is_featured: data.is_featured || false,
        sort_order: data.sort_order || 0,
      });
    } catch (err: any) {
      setError('Lỗi tải sản phẩm: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== undefined && value !== null && key !== 'thumbnail_file') {
        if (typeof value === 'boolean') {
          formData.append(key, value ? '1' : '0');
        } else {
          formData.append(key, String(value));
        }
      }
    });
    if (file) formData.append('thumbnail_file', file);

    try {
      if (isEdit) {
        await updateProduct(parseInt(params!.id), formData);
      } else {
        await createProduct(formData);
      }
      router.push('/admin/products');
    } catch (err: any) {
      let errorMsg = 'Lỗi lưu sản phẩm. Vui lòng kiểm tra lại.';
      if (err.response && err.response.data) {
        const data = err.response.data;
        if (data.errors) {
          const messages = Object.values(data.errors).flat();
          errorMsg = messages.join(', ');
        } else if (data.message) {
          errorMsg = data.message;
        }
      } else if (err.message) {
        errorMsg = err.message;
      }
      setError(errorMsg);
      console.error('Lỗi chi tiết:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="product-form-loading">
      <div className="product-form-spinner"></div>
      <p>Đang tải...</p>
    </div>
  );

  return (
    <div className="product-form-container">
      <div className="product-form-header">
        <div>
          <h1 className="product-form-title">
            {isEdit ? '✏️ Sửa sản phẩm' : '🌱 Thêm sản phẩm mới'}
          </h1>
          <p className="product-form-subtitle">
            {isEdit ? 'Cập nhật thông tin sản phẩm' : 'Thêm sản phẩm mới vào cửa hàng'}
          </p>
        </div>
      </div>

      {error && (
        <div className="product-form-error">
          <span className="product-form-error-icon">⚠️</span>
          <div>
            <strong>Lỗi:</strong> {error}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="product-form">
        <div className="product-form-grid">
          {/* Left Column */}
          <div className="product-form-left">
            <div className="product-form-card">
              <h3 className="product-form-card-title">📋 Thông tin cơ bản</h3>
              
              <div className="product-form-group">
                <label className="product-form-label">Tên sản phẩm <span className="product-form-required">*</span></label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="product-form-input"
                  placeholder="Nhập tên sản phẩm"
                  required
                />
              </div>

              <div className="product-form-row">
                <div className="product-form-group">
                  <label className="product-form-label">Giá (VNĐ)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="product-form-input"
                    placeholder="0"
                  />
                </div>
                <div className="product-form-group">
                  <label className="product-form-label">Mã sản phẩm</label>
                  <input
                    type="text"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    className="product-form-input"
                    placeholder="SP-001"
                  />
                </div>
              </div>

              <div className="product-form-group">
                <label className="product-form-label">Danh mục</label>
                <select
                  value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  className="product-form-select"
                >
                  <option value="">Chọn danh mục</option>
                </select>
              </div>

              <div className="product-form-group">
                <label className="product-form-label">Tóm tắt</label>
                <textarea
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  className="product-form-textarea"
                  rows={3}
                  placeholder="Tóm tắt ngắn về sản phẩm"
                />
              </div>

              <div className="product-form-group">
                <label className="product-form-label">Mô tả chi tiết</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="product-form-textarea"
                  rows={5}
                  placeholder="Mô tả chi tiết về sản phẩm"
                />
              </div>

              <div className="product-form-group">
                <label className="product-form-label">Thông số kỹ thuật</label>
                <textarea
                  value={form.technic_info}
                  onChange={(e) => setForm({ ...form, technic_info: e.target.value })}
                  className="product-form-textarea"
                  rows={4}
                  placeholder="Thông số kỹ thuật của sản phẩm"
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="product-form-right">
            <div className="product-form-card">
              <h3 className="product-form-card-title">⚙️ Cài đặt</h3>
              
              <div className="product-form-group">
                <label className="product-form-label">Thứ tự hiển thị</label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                  className="product-form-input"
                  placeholder="0"
                />
              </div>

              <div className="product-form-checkbox-group">
                <label className="product-form-checkbox">
                  <input
                    type="checkbox"
                    checked={form.is_new}
                    onChange={(e) => setForm({ ...form, is_new: e.target.checked })}
                  />
                  <span className="product-form-checkbox-label">🆕 Sản phẩm mới</span>
                </label>
                <label className="product-form-checkbox">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                  />
                  <span className="product-form-checkbox-label">⭐ Nổi bật</span>
                </label>
              </div>
            </div>

            <div className="product-form-card">
              <h3 className="product-form-card-title">🖼️ Ảnh sản phẩm</h3>
              
              <div className="product-form-upload">
                <div className="product-form-upload-area">
                  <div className="product-form-upload-icon">📸</div>
                  <p className="product-form-upload-text">Kéo thả ảnh vào đây hoặc</p>
                  <label className="product-form-upload-btn">
                    Chọn ảnh
                    <input
                      type="file"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="product-form-upload-input"
                    />
                  </label>
                  {file && (
                    <p className="product-form-upload-filename">📎 {file.name}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="product-form-actions">
              <button type="submit" className="product-form-btn-save" disabled={loading}>
                {loading ? 'Đang lưu...' : '💾 Lưu sản phẩm'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/admin/products')}
                className="product-form-btn-cancel"
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