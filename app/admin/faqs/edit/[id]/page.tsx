'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import FaqForm from '../../components/FaqForm';
import { getFaq, updateFaq } from '@/services/adminApi';
import './faqs-edit.css';

export default function EditFaqPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchFaq = async () => {
      try {
        const data = await getFaq(id);
        setInitialData(data);
      } catch (error) {
        console.error('Failed to fetch faq:', error);
        alert('Không tìm thấy câu hỏi');
        router.push('/admin/faqs');
      } finally {
        setFetching(false);
      }
    };
    fetchFaq();
  }, [id, router]);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      await updateFaq(id, data);
      router.push('/admin/faqs');
    } catch (error: any) {
      console.error('Update error:', error);
      alert('Cập nhật câu hỏi thất bại: ' + (error.message || ''));
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="edit-container">
        <div className="edit-loading-container">
          <div className="edit-loading-spinner"></div>
          <p>Đang tải thông tin câu hỏi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-container">
      {/* Header */}
      <div className="edit-header">
        <div>
          <h1 className="edit-title">✏️ Sửa câu hỏi</h1>
          <p className="edit-subtitle">Cập nhật thông tin câu hỏi #{id}</p>
        </div>
        <Link href="/admin/faqs" className="edit-back-btn">
          ← Quay lại
        </Link>
      </div>

      {/* Form */}
      <div className="edit-form-wrapper">
        <FaqForm 
          initialData={initialData} 
          onSubmit={handleSubmit} 
          isLoading={loading} 
          buttonText="Cập nhật" 
        />
      </div>
    </div>
  );
}