'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBanner, updateBanner, getBanner } from '@/services/adminApi';

const POSITIONS = [
  { value: '1', label: 'Menu trái' },
  { value: '2', label: 'Menu phải' },
  { value: '3', label: 'Ảnh quảng cáo giữa' },
  { value: '4', label: 'Banner' },
  { value: '5', label: 'Ngoài cùng trái' },
  { value: '6', label: 'Ngoài cùng phải' },
  { value: '7', label: 'Dòng chữ' },
  { value: '8', label: 'Khoá Meta tìm kiếm' },
];

export default function BannerForm({ params }: { params?: { id: string } }) {
  const router = useRouter();
  const isEdit = !!params?.id;

  const [form, setForm] = useState({
    title: '',
    link: '',
    position: '1',
    summary: '',
    content: '',
    sort_order: 0,
    is_active: true,
  });
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isEdit) {
      getBanner(parseInt(params.id!))
        .then(data => {
          setForm({
            title: data.title || '',
            link: data.link || '',
            position: data.position || '1',
            summary: data.summary || '',
            content: data.content || '',
            sort_order: data.sort_order || 0,
            is_active: data.is_active !== undefined ? data.is_active : true,
          });
        })
        .catch((err) => setError('Lỗi tải banner: ' + err.message));
    }
  }, [isEdit, params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        // 👇 XỬ LÝ BOOLEAN
        if (typeof value === 'boolean') {
          formData.append(key, value ? '1' : '0');
        } else {
          formData.append(key, String(value));
        }
      }
    });
    if (file) formData.append('image_file', file);

    try {
      if (isEdit) {
        await updateBanner(parseInt(params!.id), formData);
      } else {
        await createBanner(formData);
      }
      router.push('/admin/banners');
    } catch (err: any) {
      let errorMsg = 'Lỗi lưu banner. Vui lòng kiểm tra lại.';
      if (err.response && err.response.data) {
        const data = err.response.data;
        if (data.errors) {
          const messages = Object.values(data.errors).flat();
          errorMsg = messages.join(', ');
        } else if (data.message) {
          errorMsg = data.message;
        }
      } else if (err.message) {
        errorMsg = err.message;
      }
      setError(errorMsg);
      console.error('Lỗi chi tiết:', err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>{isEdit ? 'Sửa banner' : 'Thêm banner mới'}</h1>
      {error && (
        <div style={{ background: '#fee', color: '#c00', padding: '10px', borderRadius: '4px', marginBottom: '16px', border: '1px solid #fcc' }}>
          <strong>Lỗi:</strong> {error}
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Tiêu đề</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Trang liên kết</label>
          <input
            type="text"
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Vị trí</label>
          <select
            value={form.position}
            onChange={(e) => setForm({ ...form, position: e.target.value })}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          >
            {POSITIONS.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Tóm tắt nội dung</label>
          <textarea
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            rows={3}
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Chi tiết nội dung</label>
          <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            rows={5}
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>File ảnh</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Thứ tự</label>
          <input
            type="number"
            value={form.sort_order}
            onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label>
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
            />
            Hiển thị
          </label>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="submit"
            style={{ background: '#4A865A', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Lưu
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/banners')}
            style={{ background: '#ccc', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}