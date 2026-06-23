'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import GalleryForm from '../../components/GalleryForm';
import { getGallery, updateGallery } from '@/services/adminApi';

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

  if (fetching) return <div style={{ padding: '20px' }}>Đang tải...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Sửa ảnh</h1>
      <GalleryForm initialData={initialData} onSubmit={handleSubmit} isLoading={loading} buttonText="Cập nhật" />
    </div>
  );
}