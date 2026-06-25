'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import GalleryForm from '../components/GalleryForm';
import { createGallery } from '@/services/adminApi';
import './galleries-create.css';

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
    <div className="create-container">
      {/* Header */}
      <div className="create-header">
        <div>
          <h1 className="create-title">➕ Thêm ảnh mới</h1>
          <p className="create-subtitle">Thêm ảnh mới vào thư viện</p>
        </div>
        <Link href="/admin/galleries" className="create-back-btn">
          ← Quay lại
        </Link>
      </div>

      {/* Form */}
      <div className="create-form-wrapper">
        <GalleryForm 
          onSubmit={handleSubmit} 
          isLoading={loading} 
          buttonText="Tạo mới" 
        />
      </div>
    </div>
  );
}