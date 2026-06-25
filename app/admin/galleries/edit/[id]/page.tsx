'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import GalleryForm from '../../components/GalleryForm';
import { getGallery, updateGallery } from '@/services/adminApi';
import './galleries-edit.css';

export default function EditGalleryPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await getGallery(id);
        setInitialData(data);
      } catch (error) {
        console.error('Failed to fetch gallery:', error);
        alert('Không tìm thấy ảnh');
        router.push('/admin/galleries');
      } finally {
        setFetching(false);
      }
    };
    fetchGallery();
  }, [id, router]);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    try {
      await updateGallery(id, formData);
      router.push('/admin/galleries');
    } catch (error: any) {
      console.error('Update error:', error);
      alert('Cập nhật ảnh thất bại: ' + (error.message || ''));
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="edit-container">
        <div className="edit-loading-container">
          <div className="edit-loading-spinner"></div>
          <p>Đang tải thông tin ảnh...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-container">
      {/* Header */}
      <div className="edit-header">
        <div>
          <h1 className="edit-title">✏️ Sửa ảnh</h1>
          <p className="edit-subtitle">Cập nhật thông tin ảnh #{id}</p>
        </div>
        <Link href="/admin/galleries" className="edit-back-btn">
          ← Quay lại
        </Link>
      </div>

      {/* Form */}
      <div className="edit-form-wrapper">
        <GalleryForm 
          initialData={initialData} 
          onSubmit={handleSubmit} 
          isLoading={loading} 
          buttonText="Cập nhật" 
        />
      </div>
    </div>
  );
}