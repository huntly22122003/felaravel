'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ContactForm from '../components/ContactForm';
import { createContact } from '@/services/adminApi';

export default function CreateContactPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      await createContact(data);
      router.push('/admin/contacts');
    } catch (error: any) {
      console.error('Create error:', error);
      alert('Tạo liên hệ thất bại: ' + (error.message || ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Thêm liên hệ mới</h1>
      <ContactForm onSubmit={handleSubmit} isLoading={loading} buttonText="Tạo mới" />
    </div>
  );
}