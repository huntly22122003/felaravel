'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getPosts, deletePost } from '@/services/adminApi';

export default function PostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  });
  const [filters, setFilters] = useState({ search: '', is_active: '' });

  const fetchPosts = async (page = 1) => {
    setLoading(true);
    try {
      const params = { ...filters, page, per_page: 20 };
      const res = await getPosts(params);
      setPosts(res.data || []);
      setPagination({
        current_page: res.current_page || 1,
        last_page: res.last_page || 1,
        per_page: res.per_page || 20,
        total: res.total || 0,
      });
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [filters]);

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa bài viết này?')) return;
    try {
      await deletePost(id);
      fetchPosts(pagination.current_page);
    } catch (error) {
      console.error('Delete error:', error);
      alert('Xóa thất bại');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.last_page) {
      fetchPosts(page);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Quản lý tin tức</h1>
        <Link href="/admin/posts/create">
          <button style={{
            padding: '10px 20px',
            background: '#4CAF50',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
          }}>
            + Thêm mới
          </button>
        </Link>
      </div>

      {/* Bộ lọc */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Tìm kiếm theo tiêu đề..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', flex: '1', minWidth: '200px' }}
        />
        <select
          value={filters.is_active}
          onChange={(e) => setFilters({ ...filters, is_active: e.target.value })}
          style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="1">Kích hoạt</option>
          <option value="0">Không kích hoạt</option>
        </select>
        <button type="submit" style={{ padding: '8px 16px', background: '#2196F3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Tìm kiếm
        </button>
        <button
          type="button"
          onClick={() => { setFilters({ search: '', is_active: '' }); fetchPosts(1); }}
          style={{ padding: '8px 16px', background: '#999', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Xóa lọc
        </button>
      </form>

      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>ID</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Ảnh</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Tiêu đề</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Danh mục</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Trạng thái</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Ngày đăng</th>
                  <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {posts.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '40px', textAlign: 'center' }}>Không có bài viết nào.</td>
                  </tr>
                ) : (
                  posts.map((post) => (
                    <tr key={post.id}>
                      <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{post.id}</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                        {post.thumbnail ? (
                          <img src={post.thumbnail} alt={post.title} style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                        ) : (
                          <span style={{ color: '#999' }}>—</span>
                        )}
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{post.title}</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{post.category?.name || '—'}</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          background: post.is_active ? '#4CAF50' : '#f44336',
                          color: '#fff',
                          fontSize: '12px',
                        }}>
                          {post.is_active ? 'Kích hoạt' : 'Không kích hoạt'}
                        </span>
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                        {post.published_at ? new Date(post.published_at).toLocaleDateString('vi-VN') : '—'}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #eee' }}>
                        <Link href={`/admin/posts/${post.id}/edit`} style={{ marginRight: '8px', color: '#2196F3', textDecoration: 'none' }}>
                          Sửa
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#f44336',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                          }}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Phân trang */}
          {pagination.last_page > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
              <button
                onClick={() => handlePageChange(pagination.current_page - 1)}
                disabled={pagination.current_page <= 1}
                style={{ padding: '8px 12px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer', borderRadius: '4px' }}
              >
                &laquo;
              </button>
              {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    background: page === pagination.current_page ? '#2196F3' : '#fff',
                    color: page === pagination.current_page ? '#fff' : '#000',
                    cursor: 'pointer',
                    borderRadius: '4px',
                  }}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(pagination.current_page + 1)}
                disabled={pagination.current_page >= pagination.last_page}
                style={{ padding: '8px 12px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer', borderRadius: '4px' }}
              >
                &raquo;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}