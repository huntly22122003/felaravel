'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getProduct, updateProduct } from '@/services/adminApi';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);

  const [form, setForm] = useState({
    name: '',
    price: '',
    category_id: '',
    summary: '',
    description: '',
    technic_info: '',
    code: '',
    thumbnail: '', 
    is_new: false,
    is_featured: false,
    sort_order: 0,
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProduct(id);
        setForm({
          name: data.name || '',
          price: data.price || '',
          category_id: data.category_id || '',
          summary: data.summary || '',
          description: data.description || '',
          technic_info: data.technic_info || '',
          code: data.code || '',
          thumbnail: data.thumbnail || '',
          is_new: data.is_new || false,
          is_featured: data.is_featured || false,
          sort_order: data.sort_order || 0,
        });
      } catch (err) {
        setError('Lỗi tải sản phẩm');
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== undefined && value !== null && key !== 'thumbnail_file') {
        if (typeof value === 'boolean') {
          formData.append(key, value ? '1' : '0');
        } else {
          formData.append(key, String(value));
        }
      }
    });
    if (file) formData.append('thumbnail_file', file);

    try {
      await updateProduct(id, formData);
      router.push('/admin/products');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Lỗi cập nhật sản phẩm';
      setError(msg);
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Đang tải...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Sửa sản phẩm</h1>
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
            {/* Gọi API lấy danh mục nếu cần */}
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
          {form.thumbnail && (
            <div style={{ marginTop: '8px' }}>
              <img src={form.thumbnail} alt="Current" style={{ width: '100px', border: '1px solid #ddd' }} />
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="submit"
            style={{ background: '#4A865A', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Cập nhật
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