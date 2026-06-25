'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { getBanner, updateBanner } from '@/services/adminApi';
import './banners-edit.css';

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

export default function EditBannerPage() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);

  const [form, setForm] = useState({
    title: '',
    link: '',
    position: '1',
    summary: '',
    content: '',
    image_path: '',
    sort_order: 0,
    is_active: true,
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadBanner = async () => {
      try {
        const data = await getBanner(id);
        setForm({
          title: data.title || '',
          link: data.link || '',
          position: data.position || '1',
          summary: data.summary || '',
          content: data.content || '',
          image_path: data.image_path || '',
          sort_order: data.sort_order || 0,
          is_active: data.is_active !== undefined ? data.is_active : true,
        });
      } catch (err) {
        setError('Lỗi tải banner');
      } finally {
        setLoading(false);
      }
    };
    loadBanner();
  }, [id]);

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
      await updateBanner(id, formData);
      router.push('/admin/banners');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Lỗi cập nhật banner';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-container">
        <div className="edit-loading-container">
          <div className="edit-loading-spinner"></div>
          <p>Đang tải banner...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-container">
      {/* Header */}
      <div className="edit-header">
        <div>
          <h1 className="edit-title">✏️ Sửa banner</h1>
          <p className="edit-subtitle">Cập nhật thông tin banner #{id}</p>
        </div>
        <Link href="/admin/banners" className="edit-back-btn">
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
              <h3 className="edit-card-title">📋 Thông tin banner</h3>
              
              <div className="edit-group">
                <label className="edit-label">
                  Tiêu đề <span className="edit-required">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="edit-input"
                  placeholder="Nhập tiêu đề banner"
                  required
                />
                <p className="edit-hint">Tiêu đề hiển thị trên banner</p>
              </div>

              <div className="edit-group">
                <label className="edit-label">Trang liên kết</label>
                <input
                  type="text"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  className="edit-input"
                  placeholder="https://example.com"
                />
                <p className="edit-hint">Đường dẫn khi click vào banner</p>
              </div>

              <div className="edit-group">
                <label className="edit-label">Vị trí</label>
                <select
                  value={form.position}
                  onChange={(e) => setForm({ ...form, position: e.target.value })}
                  className="edit-select"
                >
                  {POSITIONS.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
                <p className="edit-hint">Vị trí hiển thị trên website</p>
              </div>

              <div className="edit-group">
                <label className="edit-label">Tóm tắt</label>
                <textarea
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  className="edit-textarea"
                  rows={3}
                  placeholder="Tóm tắt ngắn về banner"
                />
              </div>

              <div className="edit-group">
                <label className="edit-label">Nội dung chi tiết</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="edit-textarea"
                  rows={4}
                  placeholder="Nội dung chi tiết của banner"
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
                  min="0"
                />
                <p className="edit-hint">Số nhỏ hơn sẽ hiển thị trước</p>
              </div>

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
                      {form.is_active ? '🟢 Hiển thị' : '🔴 Ẩn'}
                    </span>
                  </label>
                </div>
                <p className="edit-hint">Banner sẽ hiển thị trên website</p>
              </div>
            </div>

            <div className="edit-card">
              <h3 className="edit-card-title">🖼️ Hình ảnh</h3>
              
              <div className="edit-upload">
                <div className="edit-upload-area">
                  <span className="edit-upload-icon">📸</span>
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

              {form.image_path && !file && (
                <div className="edit-current-image">
                  <p className="edit-current-label">Ảnh hiện tại:</p>
                  <img 
                    src={form.image_path} 
                    alt="Current banner" 
                    className="edit-current-img"
                  />
                </div>
              )}
            </div>

            <div className="edit-card">
              <h3 className="edit-card-title">ℹ️ Thông tin</h3>
              <div className="edit-info-box">
                <div className="edit-info-item">
                  <span className="edit-info-label">ID:</span>
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
              '💾 Cập nhật banner'
            )}
          </button>
          <Link
            href="/admin/banners"
            className="edit-btn-cancel"
          >
            ❌ Hủy bỏ
          </Link>
        </div>
      </form>
    </div>
  );
}