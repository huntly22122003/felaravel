'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { getUser, updateUser } from '@/services/adminApi';
import './users-edit.css';

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);

  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    is_admin: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getUser(id)
      .then(data => {
        setForm({
          name: data.name || '',
          username: data.username || '',
          email: data.email || '',
          password: '',
          is_admin: data.is_admin || false,
        });
      })
      .catch(() => setError('Lỗi tải user'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const data: any = {
        name: form.name,
        username: form.username,
        email: form.email,
        is_admin: form.is_admin,
      };
      if (form.password) {
        data.password = form.password;
      }
      await updateUser(id, data);
      router.push('/admin/users');
    } catch (err: any) {
      setError(err.message || 'Lỗi cập nhật user');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-container">
        <div className="edit-loading-container">
          <div className="edit-loading-spinner"></div>
          <p>Đang tải thông tin người dùng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-container">
      {/* Header */}
      <div className="edit-header">
        <div>
          <h1 className="edit-title">✏️ Sửa người dùng</h1>
          <p className="edit-subtitle">Cập nhật thông tin người dùng #{id}</p>
        </div>
        <Link href="/admin/users" className="edit-back-btn">
          ← Quay lại
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="edit-error">
          <span className="edit-error-icon">⚠️</span>
          <div>
            <strong>Lỗi:</strong> {error}
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="edit-form">
        <div className="edit-grid">
          {/* Left Column */}
          <div className="edit-left">
            <div className="edit-card">
              <h3 className="edit-card-title">📋 Thông tin người dùng</h3>
              
              <div className="edit-group">
                <label className="edit-label">
                  Họ tên <span className="edit-required">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="edit-input"
                  placeholder="Nhập họ tên"
                  required
                />
                <p className="edit-hint">Tên đầy đủ của người dùng</p>
              </div>

              <div className="edit-group">
                <label className="edit-label">
                  Username <span className="edit-required">*</span>
                </label>
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="edit-input"
                  placeholder="Nhập tên đăng nhập"
                  required
                />
                <p className="edit-hint">Tên đăng nhập duy nhất cho người dùng</p>
              </div>

              <div className="edit-group">
                <label className="edit-label">
                  Email <span className="edit-required">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="edit-input"
                  placeholder="example@email.com"
                  required
                />
                <p className="edit-hint">Địa chỉ email của người dùng</p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="edit-right">
            <div className="edit-card">
              <h3 className="edit-card-title">🔑 Bảo mật & Quyền</h3>
              
              <div className="edit-group">
                <label className="edit-label">Mật khẩu mới</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="edit-input"
                  placeholder="Để trống nếu không đổi"
                  minLength={6}
                />
                <p className="edit-hint">Để trống nếu không muốn thay đổi mật khẩu</p>
              </div>

              <div className="edit-group">
                <label className="edit-label">Quyền quản trị</label>
                <div className="edit-toggle-group">
                  <label className="edit-toggle">
                    <input
                      type="checkbox"
                      checked={form.is_admin}
                      onChange={(e) => setForm({ ...form, is_admin: e.target.checked })}
                    />
                    <span className="edit-toggle-slider"></span>
                    <span className="edit-toggle-label">
                      {form.is_admin ? '✅ Quản trị viên' : '👤 Người dùng thường'}
                    </span>
                  </label>
                </div>
                <p className="edit-hint">
                  {form.is_admin 
                    ? 'Người dùng có toàn quyền quản trị hệ thống' 
                    : 'Người dùng chỉ có quyền xem và thao tác cơ bản'}
                </p>
              </div>
            </div>

            <div className="edit-card">
              <h3 className="edit-card-title">ℹ️ Thông tin</h3>
              <div className="edit-info-box">
                <div className="edit-info-item">
                  <span className="edit-info-label">ID:</span>
                  <span className="edit-info-value">#{id}</span>
                </div>
                <div className="edit-info-item">
                  <span className="edit-info-label">Ngày tạo:</span>
                  <span className="edit-info-value">{new Date().toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="edit-actions">
          <button 
            type="submit" 
            className="edit-btn-save" 
            disabled={saving}
          >
            {saving ? (
              <>
                <span className="edit-spinner"></span>
                Đang xử lý...
              </>
            ) : (
              '💾 Cập nhật người dùng'
            )}
          </button>
          <Link
            href="/admin/users"
            className="edit-btn-cancel"
          >
            ❌ Hủy bỏ
          </Link>
        </div>
      </form>
    </div>
  );
}