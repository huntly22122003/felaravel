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
        // Kiểm tra cấu trúc response: có thể res.data hoặc res là mảng
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
    <form onSubmit={handleSubmit} style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Tiêu đề *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Slug</label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="Để trống sẽ tự động sinh từ tiêu đề"
          style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Danh mục</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          disabled={loadingCategories}
        >
          <option value="">{loadingCategories ? 'Đang tải...' : 'Không chọn'}</option>
          {categories.map((cat: any) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Tóm tắt</label>
        <textarea
          rows={3}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Nội dung</label>
        <textarea
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Ảnh đại diện</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleThumbnailChange}
          style={{ marginBottom: '8px' }}
        />
        {thumbnailPreview && (
          <div>
            <img src={thumbnailPreview} alt="Thumbnail preview" style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }} />
          </div>
        )}
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Ngày đăng</label>
        <input
          type="date"
          value={publishedAt}
          onChange={(e) => setPublishedAt(e.target.value)}
          max="2099-12-31"
          style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Kích hoạt
        </label>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: '10px 24px',
            background: '#2196F3',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          {isLoading ? 'Đang xử lý...' : buttonText}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          style={{
            padding: '10px 24px',
            background: '#999',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Hủy
        </button>
      </div>
    </form>
  );
}