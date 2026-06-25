'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface GalleryFormProps {
  initialData?: any;
  onSubmit: (formData: FormData) => Promise<void>;
  isLoading: boolean;
  buttonText?: string;
}

export default function GalleryForm({ initialData, onSubmit, isLoading, buttonText = 'Lưu' }: GalleryFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [sortOrder, setSortOrder] = useState(initialData?.sort_order || 0);
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(initialData?.image_path || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image && !initialData?.image_path) {
      alert('Vui lòng chọn ảnh');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    if (description) formData.append('description', description);
    formData.append('sort_order', String(sortOrder));
    formData.append('is_active', isActive ? '1' : '0');
    if (image) formData.append('image_file', image);

    await onSubmit(formData);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="edit-form">
      <div className="edit-grid">
        {/* Left Column */}
        <div className="edit-left">
          <div className="edit-card">
            <h3 className="edit-card-title">📋 Thông tin ảnh</h3>

            <div className="edit-group">
              <label className="edit-label">
                Tiêu đề <span className="edit-required">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="edit-input"
                placeholder="Nhập tiêu đề ảnh"
                required
              />
              <p className="edit-hint">Tiêu đề hiển thị cho ảnh</p>
            </div>

            <div className="edit-group">
              <label className="edit-label">Mô tả</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="edit-textarea"
                placeholder="Nhập mô tả cho ảnh..."
              />
              <p className="edit-hint">Mô tả chi tiết về ảnh</p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="edit-right">
          <div className="edit-card">
            <h3 className="edit-card-title">⚙️ Cài đặt</h3>

            <div className="edit-group">
              <label className="edit-label">Thứ tự sắp xếp</label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
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
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                  />
                  <span className="edit-toggle-slider"></span>
                  <span className="edit-toggle-label">
                    {isActive ? '🟢 Kích hoạt' : '🔴 Không kích hoạt'}
                  </span>
                </label>
              </div>
              <p className="edit-hint">Ảnh sẽ hiển thị trên website</p>
            </div>
          </div>

          <div className="edit-card">
            <h3 className="edit-card-title">🖼️ Hình ảnh</h3>

            <div className="edit-upload">
              <div className="edit-upload-area">
                <span className="edit-upload-icon">📸</span>
                <p className="edit-upload-text">Kéo thả ảnh vào đây hoặc</p>
                <label className="edit-upload-btn">
                  {initialData ? 'Chọn ảnh mới' : 'Chọn ảnh'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="edit-upload-input"
                    required={!initialData}
                  />
                </label>
                {image && (
                  <p className="edit-upload-filename">📎 {image.name}</p>
                )}
              </div>
            </div>

            {imagePreview && (
              <div className="edit-current-image">
                <p className="edit-current-label">
                  {initialData && !image ? 'Ảnh hiện tại:' : 'Ảnh xem trước:'}
                </p>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="edit-current-img"
                />
              </div>
            )}

            {initialData?.image_path && !image && (
              <div style={{ marginTop: '8px', fontSize: '0.85rem', color: '#6b7280' }}>
                <a 
                  href={initialData.image_path} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: '#3b82f6', textDecoration: 'none' }}
                >
                  🔗 Xem ảnh gốc
                </a>
              </div>
            )}
          </div>

          {initialData && (
            <div className="edit-card">
              <h3 className="edit-card-title">ℹ️ Thông tin</h3>
              <div className="edit-info-box">
                <div className="edit-info-item">
                  <span className="edit-info-label">ID:</span>
                  <span className="edit-info-value">#{initialData.id}</span>
                </div>
                <div className="edit-info-item">
                  <span className="edit-info-label">Ngày tạo:</span>
                  <span className="edit-info-value">
                    {initialData.created_at 
                      ? new Date(initialData.created_at).toLocaleDateString('vi-VN') 
                      : new Date().toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="edit-actions">
        <button
          type="submit"
          className="edit-btn-save"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="edit-spinner"></span>
              Đang xử lý...
            </>
          ) : (
            `💾 ${buttonText}`
          )}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="edit-btn-cancel"
        >
          ❌ Hủy bỏ
        </button>
      </div>
    </form>
  );
}