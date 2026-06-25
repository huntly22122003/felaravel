'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createUser } from '@/services/adminApi';
import './users-create.css';

export default function CreateUserPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    is_admin: false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await createUser(form);
      router.push('/admin/users');
    } catch (err: any) {
      setError(err.message || 'Lỗi tạo user');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="create-container">
      {/* Header */}
      <div className="create-header">
        <div>
          <h1 className="create-title">➕ Thêm người dùng mới</h1>
          <p className="create-subtitle">Tạo tài khoản người dùng mới cho hệ thống</p>
        </div>
        <Link href="/admin/users" className="create-back-btn">
          ← Quay lại
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="create-error">
          <span className="create-error-icon">⚠️</span>
          <div>
            <strong>Lỗi:</strong> {error}
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="create-form">
        <div className="create-grid">
          {/* Left Column */}
          <div className="create-left">
            <div className="create-card">
              <h3 className="create-card-title">📋 Thông tin người dùng</h3>
              
              <div className="create-group">
                <label className="create-label">
                  Họ tên <span className="create-required">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="create-input"
                  placeholder="Nhập họ tên"
                  required
                />
                <p className="create-hint">Tên đầy đủ của người dùng</p>
              </div>

              <div className="create-group">
                <label className="create-label">
                  Username <span className="create-required">*</span>
                </label>
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="create-input"
                  placeholder="Nhập tên đăng nhập"
                  required
                />
                <p className="create-hint">Tên đăng nhập duy nhất cho người dùng</p>
              </div>

              <div className="create-group">
                <label className="create-label">
                  Email <span className="create-required">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="create-input"
                  placeholder="example@email.com"
                  required
                />
                <p className="create-hint">Địa chỉ email của người dùng</p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="create-right">
            <div className="create-card">
              <h3 className="create-card-title">🔑 Bảo mật & Quyền</h3>
              
              <div className="create-group">
                <label className="create-label">
                  Mật khẩu <span className="create-required">*</span>
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="create-input"
                  placeholder="Nhập mật khẩu"
                  required
                  minLength={6}
                />
                <p className="create-hint">Mật khẩu tối thiểu 6 ký tự</p>
              </div>

              <div className="create-group">
                <label className="create-label">Quyền quản trị</label>
                <div className="create-toggle-group">
                  <label className="create-toggle">
                    <input
                      type="checkbox"
                      checked={form.is_admin}
                      onChange={(e) => setForm({ ...form, is_admin: e.target.checked })}
                    />
                    <span className="create-toggle-slider"></span>
                    <span className="create-toggle-label">
                      {form.is_admin ? '✅ Quản trị viên' : '👤 Người dùng thường'}
                    </span>
                  </label>
                </div>
                <p className="create-hint">
                  {form.is_admin 
                    ? 'Người dùng có toàn quyền quản trị hệ thống' 
                    : 'Người dùng chỉ có quyền xem và thao tác cơ bản'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="create-actions">
          <button 
            type="submit" 
            className="create-btn-save" 
            disabled={saving}
          >
            {saving ? (
              <>
                <span className="create-spinner"></span>
                Đang xử lý...
              </>
            ) : (
              '💾 Lưu người dùng'
            )}
          </button>
          <Link
            href="/admin/users"
            className="create-btn-cancel"
          >
            ❌ Hủy bỏ
          </Link>
        </div>
      </form>
    </div>
  );
}