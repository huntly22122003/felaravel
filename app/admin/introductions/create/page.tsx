'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageForm from '../components/PageForm';
import { createPage } from '@/services/adminApi';

export default function CreateIntroductionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      await createPage(data);
      router.push('/admin/introductions');
    } catch (error: any) {
      console.error('Create error:', error);
      alert('Tạo trang thất bại: ' + (error.message || ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Thêm trang mới</h1>
      <PageForm onSubmit={handleSubmit} isLoading={loading} buttonText="Tạo mới" />
    </div>
  );
}