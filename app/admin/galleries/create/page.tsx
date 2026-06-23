'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import GalleryForm from '../components/GalleryForm';
import { createGallery } from '@/services/adminApi';

export default function CreateGalleryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    try {
      await createGallery(formData);
      router.push('/admin/galleries');
    } catch (error: any) {
      console.error('Create error:', error);
      alert('Tạo ảnh thất bại: ' + (error.message || ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Thêm ảnh mới</h1>
      <GalleryForm onSubmit={handleSubmit} isLoading={loading} buttonText="Tạo mới" />
    </div>
  );
}