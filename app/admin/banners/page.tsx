'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getBanners, deleteBanner } from '@/services/adminApi';
import './banners.css';

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

const POSITION_COLORS: Record<string, string> = {
  '1': '#3b82f6',
  '2': '#8b5cf6',
  '3': '#ec4899',
  '4': '#14b8a6',
  '5': '#f59e0b',
  '6': '#ef4444',
  '7': '#6366f1',
  '8': '#8b5cf6',
};

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadBanners = async () => {
    setLoading(true);
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

  const filteredBanners = banners.filter(banner =>
    banner.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    banner.id?.toString().includes(searchTerm)
  );

  if (loading) return (
    <div className="banners-loading-container">
      <div className="banners-loading-spinner"></div>
      <p>Đang tải banner...</p>
    </div>
  );

  return (
    <div className="banners-container">
      <div className="banners-header">
        <div>
          <h1 className="banners-title">🎨 Quản lý Banner</h1>
          <p className="banners-subtitle">Quản lý banner quảng cáo và hình ảnh hiển thị trên website</p>
        </div>
        <Link href="/admin/banners/create" className="banners-add-btn">
          <span className="border-glow"></span>
          <span className="banners-add-icon">+</span>
          <span className="btn-text">Thêm mới</span>
          <span className="particle"></span>
          <span className="particle"></span>
          <span className="particle"></span>
          <span className="particle"></span>
          <span className="particle"></span>
          <span className="particle"></span>
        </Link>
      </div>

      <div className="banners-toolbar">
        <div className="banners-search">
          <span className="banners-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Tìm kiếm banner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="banners-search-input"
          />
          {searchTerm && (
            <button 
              className="banners-search-clear"
              onClick={() => setSearchTerm('')}
            >
              ✕
            </button>
          )}
        </div>
        <div className="banners-stats">
          <span className="banners-count">Tổng: {filteredBanners.length} banner</span>
        </div>
      </div>

      <div className="banners-table-wrapper">
        <table className="banners-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tiêu đề</th>
              <th>Vị trí</th>
              <th>Hình ảnh</th>
              <th>Link</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredBanners.length === 0 ? (
              <tr>
                <td colSpan={6} className="banners-empty">
                  <div className="banners-empty-icon">🖼️</div>
                  <p>Chưa có banner nào</p>
                  <Link href="/admin/banners/create" className="banners-empty-link">
                    Thêm banner mới
                  </Link>
                </td>
              </tr>
            ) : (
              filteredBanners.map((b: any) => (
                <tr key={b.id}>
                  <td className="banners-id">#{b.id}</td>
                  <td>
                    <div className="banners-name">
                      <div className="banners-name-text">{b.title || 'Chưa có tiêu đề'}</div>
                      {b.description && <div className="banners-code">{b.description}</div>}
                    </div>
                  </td>
                  <td>
                    <span 
                      className="banners-position"
                      style={{ 
                        backgroundColor: POSITION_COLORS[b.position] + '20',
                        color: POSITION_COLORS[b.position],
                        borderColor: POSITION_COLORS[b.position] + '40'
                      }}
                    >
                      {POSITIONS[b.position] || b.position}
                    </span>
                  </td>
                  <td>
                    {b.image_path ? (
                      <div className="banners-image-wrapper">
                        <img 
                          src={b.image_path} 
                          alt={b.title || 'Banner'} 
                          className="banners-image"
                        />
                      </div>
                    ) : (
                      <span className="banners-no-image">📷 Không có ảnh</span>
                    )}
                  </td>
                  <td>
                    {b.link ? (
                      <a 
                        href={b.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="banners-link"
                      >
                        🔗 Link
                      </a>
                    ) : (
                      <span className="banners-no-link">-</span>
                    )}
                  </td>
                  <td>
                    <div className="banners-actions">
                      <Link 
                        href={`/admin/banners/edit/${b.id}`} 
                        className="banners-btn-edit"
                      >
                        ✏️ Sửa
                      </Link>
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="banners-btn-delete"
                      >
                        🗑️ Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="banners-footer">
        <p>🌿 © 2024 Cửa hàng cây cảnh - Quản lý Banner</p>
      </div>
    </div>
  );
}