'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import FaqForm from '../../components/FaqForm';
import { getFaq, updateFaq } from '@/services/adminApi';

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

  if (fetching) return <div style={{ padding: '20px' }}>Đang tải...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Sửa câu hỏi</h1>
      <FaqForm initialData={initialData} onSubmit={handleSubmit} isLoading={loading} buttonText="Cập nhật" />
    </div>
  );
}