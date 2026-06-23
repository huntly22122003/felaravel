'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FaqForm from '../components/FaqForm';
import { createFaq } from '@/services/adminApi';

export default function CreateFaqPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      await createFaq(data);
      router.push('/admin/faqs');
    } catch (error: any) {
      console.error('Create error:', error);
      alert('Tạo câu hỏi thất bại: ' + (error.message || ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Thêm câu hỏi mới</h1>
      <FaqForm onSubmit={handleSubmit} isLoading={loading} buttonText="Tạo mới" />
    </div>
  );
}