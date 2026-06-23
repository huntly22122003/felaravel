'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PostForm from '../../components/PostForm';
import { getPost, updatePost } from '@/services/adminApi';

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPost(id);
        setInitialData(data);
      } catch (error) {
        console.error('Failed to fetch post:', error);
        alert('Không tìm thấy bài viết');
        router.push('/admin/posts');
      } finally {
        setFetching(false);
      }
    };
    fetchPost();
  }, [id, router]);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    try {
      await updatePost(id, formData);
      router.push('/admin/posts');
    } catch (error: any) {
      console.error('Update error:', error);
      alert('Cập nhật bài viết thất bại: ' + (error.message || ''));
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div style={{ padding: '20px' }}>Đang tải...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Sửa bài viết</h1>
      <PostForm initialData={initialData} onSubmit={handleSubmit} isLoading={loading} buttonText="Cập nhật" />
    </div>
  );
}