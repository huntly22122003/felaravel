'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getProducts, deleteProduct } from '@/services/adminApi';
import './products.css';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await getProducts();
      setProducts(res.data || res);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      alert('Xóa thất bại');
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="products-loading-container">
      <div className="products-loading-spinner"></div>
      <p>Đang tải sản phẩm...</p>
    </div>
  );

  return (
    <div className="products-container">
      <div className="products-header">
        <div>
          <h1 className="products-title">📦 Quản lý sản phẩm</h1>
          <p className="products-subtitle">Quản lý danh sách sản phẩm của cửa hàng</p>
        </div>
        <Link href="/admin/products/create" className="products-add-btn">
          <span className="products-add-icon">+</span> Thêm mới
        </Link>
      </div>

      <div className="products-toolbar">
        <div className="products-search">
          <span className="products-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="products-search-input"
          />
          {searchTerm && (
            <button 
              className="products-search-clear"
              onClick={() => setSearchTerm('')}
            >
              ✕
            </button>
          )}
        </div>
        <div className="products-stats">
          <span className="products-count">Tổng: {filteredProducts.length} sản phẩm</span>
        </div>
      </div>

      <div className="products-table-wrapper">
        <table className="products-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên sản phẩm</th>
              <th>Danh mục</th>
              <th>Giá</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="products-empty">
                  <div className="products-empty-icon">🌱</div>
                  <p>Chưa có sản phẩm nào</p>
                  <Link href="/admin/products/create" className="products-empty-link">
                    Thêm sản phẩm mới
                  </Link>
                </td>
              </tr>
            ) : (
              filteredProducts.map((p: any) => (
                <tr key={p.id}>
                  <td className="products-id">#{p.id}</td>
                  <td>
                    <div className="products-name">
                      <div className="products-name-text">{p.name}</div>
                      {p.code && <div className="products-code">{p.code}</div>}
                    </div>
                  </td>
                  <td>
                    <span className="products-category">
                      {p.category?.name || 'Chưa phân loại'}
                    </span>
                  </td>
                  <td className="products-price">
                    {p.price?.toLocaleString() || 0}₫
                  </td>
                  <td>
                    <span className={`products-status products-status-${p.is_active ? 'active' : 'inactive'}`}>
                      {p.is_active ? '🟢 Hoạt động' : '🔴 Ngừng bán'}
                    </span>
                  </td>
                  <td>
                    <div className="products-actions">
                      <Link 
                        href={`/admin/products/edit/${p.id}`} 
                        className="products-btn-edit"
                      >
                        ✏️ Sửa
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="products-btn-delete"
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

      <div className="products-footer">
        <p>🌿 © 2024 Cửa hàng cây cảnh - Quản lý sản phẩm</p>
      </div>
    </div>
  );
}