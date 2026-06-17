// D:\TongLaravel\frontend\app\products\page.tsx
'use client';

import { useEffect, useState } from 'react';
import { fetchProducts } from '@/services/api';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        setProducts(data.data || data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Đang tải...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Sản phẩm</h1>
      {products.length === 0 ? (
        <p>Chưa có sản phẩm</p>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {products.map((p: any) => (
            <div key={p.id} className="border rounded p-2">
              <img src={p.thumbnail} alt={p.name} className="w-full h-48 object-cover" />
              <h3 className="font-semibold mt-1">{p.name}</h3>
              <p className="text-red-600">{p.price?.toLocaleString()} VND</p>
              <p className="text-sm text-gray-500">{p.category?.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}