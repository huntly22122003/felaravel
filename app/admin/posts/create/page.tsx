'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PostForm from '../components/PostForm';
import { createPost } from '@/services/adminApi';
import './posts-create.css';

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
    <div className="create-container">
      {/* Header */}
      <div className="create-header">
        <div>
          <h1 className="create-title">📝 Thêm bài viết mới</h1>
          <p className="create-subtitle">Tạo bài viết mới cho trang tin tức</p>
        </div>
        <Link href="/admin/posts" className="create-back-btn">
          ← Quay lại
        </Link>
      </div>

      {/* Form */}
      <div className="create-form-wrapper">
        <PostForm onSubmit={handleSubmit} isLoading={loading} buttonText="Tạo mới" />
      </div>
    </div>
  );
}