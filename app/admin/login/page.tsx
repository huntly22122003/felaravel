'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { loginAdmin } from '@/services/adminApi';
import './admin-login.css';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await loginAdmin(username, password);
      const expires = remember ? 7 : 1;
      Cookies.set('admin_token', data.token, { expires });
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-wrapper">
        <div className="admin-login-left">
          <img 
            src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=600&h=600&fit=crop" 
            alt="Cây xanh" 
            className="admin-tree-image"
          />
          <div className="admin-image-overlay">
            <h2 className="admin-overlay-title">🌿 Chào mừng</h2>
          </div>
        </div>

        <div className="admin-login-right">
          <h1 className="admin-login-title">
            <span className="highlight">Đăng nhập</span>
          </h1>
          <p className="admin-login-subtitle">Chào mừng  admin trở lại! Vui lòng đăng nhập vào tài khoản.</p>

          <form onSubmit={handleSubmit}>
            <div className="admin-form-group">
              <label className="admin-label">Tên đăng nhập</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="admin-input"
                placeholder="Nhập tên đăng nhập"
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-input"
                placeholder="Nhập mật khẩu"
                required
              />
            </div>

            <div className="admin-options">
              <label className="admin-remember">
                <input 
                  type="checkbox" 
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Ghi nhớ đăng nhập
              </label>
              <a href="#" className="admin-forgot">Quên mật khẩu?</a>
            </div>

            {error && (
              <div className="admin-error">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading} 
              className="admin-button"
            >
              {loading ? (
                <>
                  <span className="admin-spinner"></span>
                  Đang xử lý...
                </>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </form>

          <div className="admin-footer">
            Chưa có tài khoản? <a href="#" className="admin-footer-link">Đăng ký</a>
            <br />
            <span style={{ fontSize: '0.75rem', color: '#d1d5db' }}>Cần trợ giúp? Liên hệ với chúng tôi</span>
          </div>
        </div>
      </div>
    </div>
  );
}