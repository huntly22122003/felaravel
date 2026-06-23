'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PostForm from '../components/PostForm';
import { createPost } from '@/services/adminApi';

export default function CreatePostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    try {
      await createPost(formData);
      router.push('/admin/posts');
    } catch (error: any) {
      console.error('Create error:', error);
      alert('Tạo bài viết thất bại: ' + (error.message || ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Thêm bài viết mới</h1>
      <PostForm onSubmit={handleSubmit} isLoading={loading} buttonText="Tạo mới" />
    </div>
  );
}