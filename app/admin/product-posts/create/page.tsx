'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductPostForm from '../components/ProductPostForm';
import { createProductPost } from '@/services/adminApi';

export default function CreateProductPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      await createProductPost(data);
      router.push('/admin/product-posts');
    } catch (error: any) {
      console.error('Create error:', error);
      alert('Tạo bài đăng thất bại: ' + (error.message || ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Thêm bài đăng mới</h1>
      <ProductPostForm onSubmit={handleSubmit} isLoading={loading} buttonText="Tạo mới" />
    </div>
  );
}