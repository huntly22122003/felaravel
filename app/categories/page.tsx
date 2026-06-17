// D:\TongLaravel\frontend\app\categories\page.tsx
'use client';

import { useEffect, useState } from 'react';
import { fetchCategories } from '@/services/api';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories()
      .then((data) => {
        setCategories(data);
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
      <h1 className="text-2xl font-bold mb-4">Danh mục sản phẩm</h1>
      {categories.length === 0 ? (
        <p>Chưa có danh mục</p>
      ) : (
        <ul className="space-y-2">
          {categories.map((cat: any) => (
            <li key={cat.id} className="border p-2 rounded">
              {cat.name}
              {cat.children && cat.children.length > 0 && (
                <ul className="ml-4 mt-1 space-y-1">
                  {cat.children.map((child: any) => (
                    <li key={child.id} className="border-l-2 border-blue-300 pl-2">
                      {child.name}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}