// D:\TongLaravel\frontend\app\page.tsx
'use client';

import { useEffect, useState } from 'react';
import { fetchCategories, fetchProducts, fetchBanners } from '@/services/api';

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchCategories(), fetchProducts(), fetchBanners()])
      .then(([cats, prods, banners]) => {
        setCategories(cats);
        setProducts(prods.data || prods);
        setBanners(banners);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-10">Đang tải...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Trang chủ</h1>

      {/* Banners */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Banner</h2>
        {banners.length === 0 ? (
          <p className="text-gray-500">Chưa có banner</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {banners.map((b: any) => (
              <div key={b.id} className="border rounded p-2">
                <img src={b.image_path} alt={b.title} className="w-full h-32 object-cover" />
                <p className="text-center mt-1">{b.title}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Danh mục</h2>
        {categories.length === 0 ? (
          <p className="text-gray-500">Chưa có danh mục</p>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {categories.map((cat: any) => (
              <div key={cat.id} className="border rounded p-2 text-center">
                {cat.name}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Products */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Sản phẩm</h2>
        {products.length === 0 ? (
          <p className="text-gray-500">Chưa có sản phẩm</p>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {products.map((p: any) => (
              <div key={p.id} className="border rounded p-2">
                <img src={p.thumbnail} alt={p.name} className="w-full h-48 object-cover" />
                <h3 className="font-semibold mt-1">{p.name}</h3>
                <p className="text-red-600">{p.price?.toLocaleString()} VND</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}