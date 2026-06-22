'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getUsers, deleteUser } from '@/services/adminApi';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
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

  if (loading) return <div style={{ padding: 20 }}>Đang tải...</div>;

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Quản lý người dùng</h1>
        <Link href="/admin/users/create">
          <button style={{ padding: '8px 16px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
            + Thêm user
          </button>
        </Link>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
        <thead>
          <tr style={{ background: '#DEDBCE' }}>
            <th style={{ padding: 8, textAlign: 'left' }}>ID</th>
            <th style={{ padding: 8, textAlign: 'left' }}>Họ tên</th>
            <th style={{ padding: 8, textAlign: 'left' }}>Username</th>
            <th style={{ padding: 8, textAlign: 'left' }}>Email</th>
            <th style={{ padding: 8, textAlign: 'left' }}>Admin</th>
            <th style={{ padding: 8, textAlign: 'left' }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr><td colSpan={6} style={{ padding: 20, textAlign: 'center' }}>Chưa có user</td></tr>
          ) : (
            users.map((u: any) => (
              <tr key={u.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: 8 }}>{u.id}</td>
                <td style={{ padding: 8 }}>{u.name}</td>
                <td style={{ padding: 8 }}>{u.username}</td>
                <td style={{ padding: 8 }}>{u.email}</td>
                <td style={{ padding: 8 }}>{u.is_admin ? '✅' : '❌'}</td>
                <td style={{ padding: 8 }}>
                  <Link href={`/admin/users/edit/${u.id}`} style={{ marginRight: 8, color: '#2196F3' }}>Sửa</Link>
                  <button onClick={() => handleDelete(u.id)} style={{ background: 'none', border: 'none', color: '#f44336', cursor: 'pointer' }}>Xóa</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}