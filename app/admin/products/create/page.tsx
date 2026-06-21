'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createProduct, updateProduct, getProduct } from '@/services/adminApi';

export default function ProductForm({ params }: { params?: { id: string } }) {
  const router = useRouter();
  const isEdit = !!params?.id;

  const [form, setForm] = useState({
    name: '',
    price: '',
    category_id: '',
    summary: '',
    description: '',
    technic_info: '',
    code: '',
    is_new: false,
    is_featured: false,
    sort_order: 0,
  });
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isEdit) {
      getProduct(parseInt(params.id!))
        .then(data => {
          setForm({
            name: data.name,
            price: data.price || '',
            category_id: data.category_id || '',
            summary: data.summary || '',
            description: data.description || '',
            technic_info: data.technic_info || '',
            code: data.code || '',
            is_new: data.is_new || false,
            is_featured: data.is_featured || false,
            sort_order: data.sort_order || 0,
          });
        })
        .catch((err) => setError('Lỗi tải sản phẩm: ' + err.message));
    }
  }, [isEdit, params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== undefined && value !== null && key !== 'thumbnail_file') {
        // Xử lý boolean: gửi 1/0
        if (typeof value === 'boolean') {
          formData.append(key, value ? '1' : '0');
        } else {
          formData.append(key, String(value));
        }
      }
    });
    if (file) formData.append('thumbnail_file', file);

    try {
      if (isEdit) {
        await updateProduct(parseInt(params!.id), formData);
      } else {
        await createProduct(formData);
      }
      router.push('/admin/products');
    } catch (err: any) {
      let errorMsg = 'Lỗi lưu sản phẩm. Vui lòng kiểm tra lại.';
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
      <h1>{isEdit ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h1>
      {error && (
        <div style={{ background: '#fee', color: '#c00', padding: '10px', borderRadius: '4px', marginBottom: '16px', border: '1px solid #fcc' }}>
          <strong>Lỗi:</strong> {error}
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Tên sản phẩm:</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Giá:</label>
          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Danh mục:</label>
          <select
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          >
            <option value="">Chọn danh mục</option>
          </select>
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Tóm tắt:</label>
          <textarea
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            rows={3}
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Mô tả:</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            rows={5}
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Thông số kỹ thuật:</label>
          <textarea
            value={form.technic_info}
            onChange={(e) => setForm({ ...form, technic_info: e.target.value })}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            rows={4}
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Mã sản phẩm:</label>
          <input
            type="text"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label>
            <input
              type="checkbox"
              checked={form.is_new}
              onChange={(e) => setForm({ ...form, is_new: e.target.checked })}
            />
            Sản phẩm mới
          </label>
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label>
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
            />
            Nổi bật
          </label>
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Thứ tự:</label>
          <input
            type="number"
            value={form.sort_order}
            onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Ảnh sản phẩm:</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            style={{ width: '100%' }}
          />
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
            onClick={() => router.push('/admin/products')}
            style={{ background: '#ccc', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}