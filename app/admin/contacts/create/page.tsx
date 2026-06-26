'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ContactForm from '../components/ContactForm';
import { createContact } from '@/services/adminApi';
import './contacts-create.css';

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
    <div className="create-container">
      {/* Header */}
      <div className="create-header">
        <div>
          <h1 className="create-title">➕ Thêm liên hệ mới</h1>
          <p className="create-subtitle">Thêm liên hệ mới vào danh sách</p>
        </div>
        <Link href="/admin/contacts" className="create-back-btn">
          ← Quay lại
        </Link>
      </div>

      {/* Form */}
      <div className="create-form-wrapper">
        <ContactForm 
          onSubmit={handleSubmit} 
          isLoading={loading} 
          buttonText="Tạo mới" 
        />
      </div>
    </div>
  );
}