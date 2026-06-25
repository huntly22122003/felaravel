'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBanner, updateBanner, getBanner } from '@/services/adminApi';
import './banners-create.css';

const POSITIONS = [
  { value: '1', label: 'Menu trái' },
  { value: '2', label: 'Menu phải' },
  { value: '3', label: 'Ảnh quảng cáo giữa' },
  { value: '4', label: 'Banner' },
  { value: '5', label: 'Ngoài cùng trái' },
  { value: '6', label: 'Ngoài cùng phải' },
  { value: '7', label: 'Dòng chữ' },
  { value: '8', label: 'Khoá Meta tìm kiếm' },
];

export default function BannerForm({ params }: { params?: { id: string } }) {
  const router = useRouter();
  const isEdit = !!params?.id;

  const [form, setForm] = useState({
    title: '',
    link: '',
    position: '1',
    summary: '',
    content: '',
    sort_order: 0,
    is_active: true,
  });
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isEdit) {
      getBanner(parseInt(params.id!))
        .then(data => {
          setForm({
            title: data.title || '',
            link: data.link || '',
            position: data.position || '1',
            summary: data.summary || '',
            content: data.content || '',
            sort_order: data.sort_order || 0,
            is_active: data.is_active !== undefined ? data.is_active : true,
          });
        })
        .catch((err) => setError('Lỗi tải banner: ' + err.message));
    }
  }, [isEdit, params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === 'boolean') {
          formData.append(key, value ? '1' : '0');
        } else {
          formData.append(key, String(value));
        }
      }
    });
    if (file) formData.append('image_file', file);

    try {
      if (isEdit) {
        await updateBanner(parseInt(params!.id), formData);
      } else {
        await createBanner(formData);
      }
      router.push('/admin/banners');
    } catch (err: any) {
      let errorMsg = 'Lỗi lưu banner. Vui lòng kiểm tra lại.';
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
      setSaving(false);
    }
  };

  return (
    <div className="create-container">
      {/* Header */}
      <div className="create-header">
        <div>
          <h1 className="create-title">
            {isEdit ? '✏️ Sửa banner' : '➕ Thêm banner mới'}
          </h1>
          <p className="create-subtitle">
            {isEdit ? 'Cập nhật thông tin banner' : 'Tạo banner mới cho cửa hàng'}
          </p>
        </div>
        <Link href="/admin/banners" className="create-back-btn">
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
              <h3 className="create-card-title">📋 Thông tin banner</h3>
              
              <div className="create-group">
                <label className="create-label">
                  Tiêu đề <span className="create-required">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="create-input"
                  placeholder="Nhập tiêu đề banner"
                  required
                />
                <p className="create-hint">Tiêu đề hiển thị trên banner</p>
              </div>

              <div className="create-group">
                <label className="create-label">Trang liên kết</label>
                <input
                  type="text"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  className="create-input"
                  placeholder="https://example.com"
                />
                <p className="create-hint">Đường dẫn khi click vào banner</p>
              </div>

              <div className="create-group">
                <label className="create-label">Vị trí</label>
                <select
                  value={form.position}
                  onChange={(e) => setForm({ ...form, position: e.target.value })}
                  className="create-select"
                >
                  {POSITIONS.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
                <p className="create-hint">Vị trí hiển thị trên website</p>
              </div>

              <div className="create-group">
                <label className="create-label">Tóm tắt</label>
                <textarea
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  className="create-textarea"
                  rows={3}
                  placeholder="Tóm tắt ngắn về banner"
                />
              </div>

              <div className="create-group">
                <label className="create-label">Nội dung chi tiết</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="create-textarea"
                  rows={4}
                  placeholder="Nội dung chi tiết của banner"
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="create-right">
            <div className="create-card">
              <h3 className="create-card-title">⚙️ Cài đặt</h3>
              
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
                      {form.is_active ? '🟢 Hiển thị' : '🔴 Ẩn'}
                    </span>
                  </label>
                </div>
                <p className="create-hint">Banner sẽ hiển thị trên website</p>
              </div>
            </div>

            <div className="create-card">
              <h3 className="create-card-title">🖼️ Hình ảnh</h3>
              
              <div className="create-upload">
                <div className="create-upload-area">
                  <span className="create-upload-icon">📸</span>
                  <p className="create-upload-text">Kéo thả ảnh vào đây hoặc</p>
                  <label className="create-upload-btn">
                    Chọn ảnh
                    <input
                      type="file"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="create-upload-input"
                    />
                  </label>
                  {file && (
                    <p className="create-upload-filename">📎 {file.name}</p>
                  )}
                </div>
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
              `💾 ${isEdit ? 'Cập nhật' : 'Lưu'} banner`
            )}
          </button>
          <Link
            href="/admin/banners"
            className="create-btn-cancel"
          >
            ❌ Hủy bỏ
          </Link>
        </div>
      </form>
    </div>
  );
}