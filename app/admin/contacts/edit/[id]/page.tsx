'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ContactForm from '../../components/ContactForm';
import { getContact, updateContact } from '@/services/adminApi';

export default function EditContactPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const data = await getContact(id);
        setInitialData(data);
      } catch (error) {
        console.error('Failed to fetch contact:', error);
        alert('Không tìm thấy liên hệ');
        router.push('/admin/contacts');
      } finally {
        setFetching(false);
      }
    };
    fetchContact();
  }, [id, router]);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      await updateContact(id, data);
      router.push('/admin/contacts');
    } catch (error: any) {
      console.error('Update error:', error);
      alert('Cập nhật liên hệ thất bại: ' + (error.message || ''));
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div style={{ padding: '20px' }}>Đang tải...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Sửa liên hệ</h1>
      <ContactForm initialData={initialData} onSubmit={handleSubmit} isLoading={loading} buttonText="Cập nhật" />
    </div>
  );
}