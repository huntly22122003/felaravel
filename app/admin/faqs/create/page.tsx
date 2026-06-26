'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FaqForm from '../components/FaqForm';
import { createFaq } from '@/services/adminApi';
import './faqs-create.css';

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
    <div className="create-container">
      {/* Header */}
      <div className="create-header">
        <div>
          <h1 className="create-title">➕ Thêm câu hỏi mới</h1>
          <p className="create-subtitle">Thêm câu hỏi thường gặp mới</p>
        </div>
        <Link href="/admin/faqs" className="create-back-btn">
          ← Quay lại
        </Link>
      </div>

      {/* Form */}
      <div className="create-form-wrapper">
        <FaqForm 
          onSubmit={handleSubmit} 
          isLoading={loading} 
          buttonText="Tạo mới" 
        />
      </div>
    </div>
  );
}