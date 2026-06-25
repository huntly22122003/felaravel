'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getUsers, deleteUser } from '@/services/adminApi';
import './users.css';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data.data || data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa user này?')) return;
    try {
      await deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
    } catch (err: any) {
      alert(err.message || 'Xóa thất bại');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id?.toString().includes(searchTerm)
  );

  if (loading) return (
    <div className="users-loading-container">
      <div className="users-loading-spinner"></div>
      <p>Đang tải người dùng...</p>
    </div>
  );

  return (
    <div className="users-container">
      {/* Header */}
      <div className="users-header">
        <div>
          <h1 className="users-title">👤 Quản lý người dùng</h1>
          <p className="users-subtitle">
            Tổng số người dùng: <span className="users-total-count">{users.length}</span>
          </p>
        </div>
        <Link href="/admin/users/create" className="users-add-btn">
          <span className="border-glow"></span>
          <span className="users-add-icon">+</span>
          <span className="btn-text">Thêm mới</span>
          <span className="particle"></span>
          <span className="particle"></span>
          <span className="particle"></span>
          <span className="particle"></span>
          <span className="particle"></span>
          <span className="particle"></span>
        </Link>
      </div>

      {/* Toolbar */}
      <div className="users-toolbar">
        <div className="users-search">
          <span className="users-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="users-search-input"
          />
          {searchTerm && (
            <button 
              className="users-search-clear"
              onClick={() => setSearchTerm('')}
            >
              ✕
            </button>
          )}
        </div>
        <div className="users-stats">
          <span className="users-count">Tổng: {filteredUsers.length} người dùng</span>
        </div>
      </div>

      {/* Table */}
      <div className="users-table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Họ tên</th>
              <th>Username</th>
              <th>Email</th>
              <th>Admin</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="users-empty">
                  <div className="users-empty-icon">👤</div>
                  <p>Chưa có người dùng nào</p>
                  <Link href="/admin/users/create" className="users-empty-link">
                    Thêm người dùng mới
                  </Link>
                </td>
              </tr>
            ) : (
              filteredUsers.map((u: any) => (
                <tr key={u.id}>
                  <td className="users-id">#{u.id}</td>
                  <td>
                    <div className="users-name">
                      <div className="users-name-text">{u.name}</div>
                      {u.email && <div className="users-email">{u.email}</div>}
                    </div>
                  </td>
                  <td className="users-username">{u.username}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`users-admin-badge users-admin-${u.is_admin ? 'true' : 'false'}`}>
                      {u.is_admin ? '✅ Admin' : '❌ User'}
                    </span>
                  </td>
                  <td>
                    <div className="users-actions">
                      <Link 
                        href={`/admin/users/edit/${u.id}`} 
                        className="users-btn-edit"
                      >
                        ✏️ Sửa
                      </Link>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="users-btn-delete"
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

      {/* Footer */}
      <div className="users-footer">
        <p>🌿 © 2024 Cửa hàng cây cảnh - Quản lý người dùng</p>
      </div>
    </div>
  );
}