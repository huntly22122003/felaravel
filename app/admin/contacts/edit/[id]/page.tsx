'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import ContactForm from '../../components/ContactForm';
import { getContact, updateContact } from '@/services/adminApi';
import './contacts-edit.css';

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

  if (fetching) {
    return (
      <div className="edit-container">
        <div className="edit-loading-container">
          <div className="edit-loading-spinner"></div>
          <p>Đang tải thông tin liên hệ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-container">
      {/* Header */}
      <div className="edit-header">
        <div>
          <h1 className="edit-title">✏️ Sửa liên hệ</h1>
          <p className="edit-subtitle">Cập nhật thông tin liên hệ #{id}</p>
        </div>
        <Link href="/admin/contacts" className="edit-back-btn">
          ← Quay lại
        </Link>
      </div>

      {/* Form */}
      <div className="edit-form-wrapper">
        <ContactForm 
          initialData={initialData} 
          onSubmit={handleSubmit} 
          isLoading={loading} 
          buttonText="Cập nhật" 
        />
      </div>
    </div>
  );
}