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
    <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
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
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Ảnh {!initialData && '*'}</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required={!initialData}
          style={{ marginBottom: '8px' }}
        />
        {imagePreview && (
          <div>
            <img src={imagePreview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover', borderRadius: '4px' }} />
          </div>
        )}
        {initialData?.image_path && !image && (
          <div style={{ marginTop: '4px', fontSize: '14px', color: '#666' }}>
            Ảnh hiện tại: <a href={initialData.image_path} target="_blank" rel="noopener noreferrer">Xem</a>
          </div>
        )}
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Mô tả</label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Thứ tự sắp xếp</label>
        <input
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(Number(e.target.value))}
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