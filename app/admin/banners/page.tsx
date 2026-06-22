'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getBanners, deleteBanner } from '@/services/adminApi';

const POSITIONS: Record<string, string> = {
  '1': 'Menu trái',
  '2': 'Menu phải',
  '3': 'QC giữa',
  '4': 'Banner',
  '5': 'Ngoài cùng trái',
  '6': 'Ngoài cùng phải',
  '7': 'Dòng chữ',
  '8': 'Khoá Meta',
};

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBanners = async () => {
    try {
      const data = await getBanners();
      setBanners(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa banner này?')) return;
    try {
      await deleteBanner(id);
      setBanners(banners.filter(b => b.id !== id));
    } catch (err) {
      alert('Xóa thất bại');
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Đang tải...</div>;

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Quản lý Banner</h1>
        <Link href="/admin/banners/create">
          <button style={{ padding: '8px 16px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
            + Thêm banner
          </button>
        </Link>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
        <thead>
          <tr style={{ background: '#DEDBCE' }}>
            <th style={{ padding: 8, textAlign: 'left' }}>ID</th>
            <th style={{ padding: 8, textAlign: 'left' }}>Tiêu đề</th>
            <th style={{ padding: 8, textAlign: 'left' }}>Vị trí</th>
            <th style={{ padding: 8, textAlign: 'left' }}>Ảnh</th>
            <th style={{ padding: 8, textAlign: 'left' }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {banners.length === 0 ? (
            <tr><td colSpan={5} style={{ padding: 20, textAlign: 'center' }}>Chưa có banner</td></tr>
          ) : (
            banners.map((b: any) => (
              <tr key={b.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: 8 }}>{b.id}</td>
                <td style={{ padding: 8 }}>{b.title || '-'}</td>
                <td style={{ padding: 8 }}>{POSITIONS[b.position] || b.position}</td>
                <td style={{ padding: 8 }}>
                  {b.image_path && <img src={b.image_path} alt={b.title} style={{ width: 50, height: 50, objectFit: 'cover' }} />}
                </td>
                <td style={{ padding: 8 }}>
                  <Link href={`/admin/banners/edit/${b.id}`} style={{ marginRight: 8, color: '#2196F3' }}>Sửa</Link>
                  <button onClick={() => handleDelete(b.id)} style={{ background: 'none', border: 'none', color: '#f44336', cursor: 'pointer' }}>Xóa</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}