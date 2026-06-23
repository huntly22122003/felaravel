'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PageForm from '../../components/PageForm';
import { getPage, updatePage } from '@/services/adminApi';

export default function EditIntroductionPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const data = await getPage(id);
        setInitialData(data);
      } catch (error) {
        console.error('Failed to fetch page:', error);
        alert('Không tìm thấy trang');
        router.push('/admin/introductions');
      } finally {
        setFetching(false);
      }
    };
    fetchPage();
  }, [id, router]);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      await updatePage(id, data);
      router.push('/admin/introductions');
    } catch (error: any) {
      console.error('Update error:', error);
      alert('Cập nhật trang thất bại: ' + (error.message || ''));
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div style={{ padding: '20px' }}>Đang tải...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Sửa trang</h1>
      <PageForm initialData={initialData} onSubmit={handleSubmit} isLoading={loading} buttonText="Cập nhật" />
    </div>
  );
}