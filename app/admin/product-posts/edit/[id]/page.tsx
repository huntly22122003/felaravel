'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ProductPostForm from '../../components/ProductPostForm';
import { getProductPost, updateProductPost } from '@/services/adminApi';

export default function EditProductPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getProductPost(id);
        setInitialData(data);
      } catch (error) {
        console.error('Failed to fetch post:', error);
        alert('Không tìm thấy bài đăng');
        router.push('/admin/product-posts');
      } finally {
        setFetching(false);
      }
    };
    fetchPost();
  }, [id, router]);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      await updateProductPost(id, data);
      router.push('/admin/product-posts');
    } catch (error: any) {
      console.error('Update error:', error);
      alert('Cập nhật bài đăng thất bại: ' + (error.message || ''));
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div style={{ padding: '20px' }}>Đang tải...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Sửa bài đăng</h1>
      <ProductPostForm initialData={initialData} onSubmit={handleSubmit} isLoading={loading} buttonText="Cập nhật" />
    </div>
  );
}