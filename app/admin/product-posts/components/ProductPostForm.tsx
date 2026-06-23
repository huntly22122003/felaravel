'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getProducts } from '@/services/adminApi';

interface ProductPostFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
  buttonText?: string;
}

export default function ProductPostForm({ initialData, onSubmit, isLoading, buttonText = 'Lưu' }: ProductPostFormProps) {
  const router = useRouter();
  const [productId, setProductId] = useState(initialData?.product_id || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [postedAt, setPostedAt] = useState(initialData?.posted_at?.split('T')[0] || '');
  const [sortOrder, setSortOrder] = useState(initialData?.sort_order || 0);
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true);
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts({ per_page: 100 });
        setProducts(res.data || []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productId) {
      alert('Vui lòng chọn sản phẩm');
      return;
    }

    const data = {
      product_id: Number(productId),
      content,
      posted_at: postedAt || null,
      sort_order: Number(sortOrder),
      is_active: isActive ? 1 : 0,
    };

    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Sản phẩm *</label>
        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          required
          style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          disabled={loadingProducts}
        >
          <option value="">{loadingProducts ? 'Đang tải...' : 'Chọn sản phẩm'}</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>{p.name} {p.price ? `(${p.price.toLocaleString('vi-VN')} ₫)` : ''}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Nội dung</label>
        <textarea
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Ngày đăng</label>
        <input
          type="date"
          value={postedAt}
          onChange={(e) => setPostedAt(e.target.value)}
          style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Thứ tự</label>
        <input
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(Number(e.target.value))}
          style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Kích hoạt
        </label>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: '10px 24px',
            background: '#2196F3',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          {isLoading ? 'Đang xử lý...' : buttonText}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          style={{
            padding: '10px 24px',
            background: '#999',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Hủy
        </button>
      </div>
    </form>
  );
}