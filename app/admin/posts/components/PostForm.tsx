'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCategories } from '@/services/adminApi';

interface PostFormProps {
  initialData?: any;
  onSubmit: (formData: FormData) => Promise<void>;
  isLoading: boolean;
  buttonText?: string;
}

export default function PostForm({ initialData, onSubmit, isLoading, buttonText = 'Lưu' }: PostFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [categoryId, setCategoryId] = useState(initialData?.category_id || '');
  const [summary, setSummary] = useState(initialData?.summary || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(initialData?.thumbnail || '');
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true);
  const [publishedAt, setPublishedAt] = useState(initialData?.published_at?.split('T')[0] || '');
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories({ per_page: 100 });
        const catData = res.data ?? res ?? [];
        setCategories(Array.isArray(catData) ? catData : []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const validateDate = (dateStr: string): boolean => {
    if (!dateStr) return true;
    const parts = dateStr.split('-');
    const year = parseInt(parts[0]);
    return year >= 1900 && year <= 2099;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (publishedAt && !validateDate(publishedAt)) {
      alert('Ngày đăng phải trong khoảng 1900-01-01 đến 2099-12-31');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('slug', slug);
    if (categoryId) formData.append('category_id', String(categoryId));
    if (summary) formData.append('summary', summary);
    if (content) formData.append('content', content);
    if (thumbnail) formData.append('thumbnail_file', thumbnail);
    formData.append('is_active', isActive ? '1' : '0');
    if (publishedAt) formData.append('published_at', publishedAt);

    await onSubmit(formData);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-form">
      <div className="create-grid">
        {/* Left Column */}
        <div className="create-left">
          <div className="create-card">
            <h3 className="create-card-title">📋 Thông tin bài viết</h3>

            <div className="create-group">
              <label className="create-label">
                Tiêu đề <span className="create-required">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="create-input"
                placeholder="Nhập tiêu đề bài viết"
                required
              />
            </div>

            <div className="create-group">
              <label className="create-label">Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="create-input"
                placeholder="Để trống sẽ tự động sinh từ tiêu đề"
              />
              <p className="create-hint">Đường dẫn thân thiện với SEO</p>
            </div>

            <div className="create-group">
              <label className="create-label">Danh mục</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="create-select"
                disabled={loadingCategories}
              >
                <option value="">{loadingCategories ? 'Đang tải...' : 'Chọn danh mục'}</option>
                {categories.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="create-group">
              <label className="create-label">Tóm tắt</label>
              <textarea
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="create-textarea"
                placeholder="Tóm tắt nội dung bài viết"
              />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="create-right">
          <div className="create-card">
            <h3 className="create-card-title">⚙️ Cài đặt</h3>

            <div className="create-group">
              <label className="create-label">Ngày đăng</label>
              <input
                type="date"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                max="2099-12-31"
                className="create-input"
              />
              <p className="create-hint">Chọn ngày xuất bản bài viết</p>
            </div>

            <div className="create-group">
              <label className="create-label">Trạng thái</label>
              <div className="create-toggle-group">
                <label className="create-toggle">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                  />
                  <span className="create-toggle-slider"></span>
                  <span className="create-toggle-label">
                    {isActive ? '🟢 Kích hoạt' : '🔴 Không kích hoạt'}
                  </span>
                </label>
              </div>
              <p className="create-hint">Bài viết sẽ hiển thị trên website</p>
            </div>
          </div>

          <div className="create-card">
            <h3 className="create-card-title">🖼️ Ảnh đại diện</h3>

            <div className="create-upload">
              <div className="create-upload-area">
                <span className="create-upload-icon">📸</span>
                <p className="create-upload-text">Kéo thả ảnh vào đây hoặc</p>
                <label className="create-upload-btn">
                  Chọn ảnh
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="create-upload-input"
                  />
                </label>
                {thumbnail && (
                  <p className="create-upload-filename">📎 {thumbnail.name}</p>
                )}
              </div>
            </div>

            {thumbnailPreview && (
              <div className="create-current-image">
                <p className="create-current-label">Ảnh xem trước:</p>
                <img 
                  src={thumbnailPreview} 
                  alt="Thumbnail preview" 
                  className="create-current-img"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Nội dung - Full width */}
      <div className="create-card">
        <h3 className="create-card-title">📄 Nội dung</h3>
        <div className="create-group">
          <label className="create-label">Nội dung chi tiết</label>
          <textarea
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="create-textarea"
            placeholder="Viết nội dung chi tiết của bài viết..."
            style={{ minHeight: '200px' }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="create-actions">
        <button
          type="submit"
          className="create-btn-save"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="create-spinner"></span>
              Đang xử lý...
            </>
          ) : (
            `💾 ${buttonText}`
          )}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="create-btn-cancel"
        >
          ❌ Hủy bỏ
        </button>
      </div>
    </form>
  );
}