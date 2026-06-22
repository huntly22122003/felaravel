'use client';

import { useState } from 'react';
import { login } from '@/services/api';
import './login.css'; 

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login(email, password);
      setMessage('🌿 Đăng nhập thành công! 🌿');
    } catch (err: any) {
      setMessage('🌱 Lỗi: ' + err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="corner-decoration corner-top-left">✿</div>
      <div className="corner-decoration corner-bottom-right">✿</div>
      
      <h1 className="login-title">Đăng nhập</h1>
      
      <div className="login-decoration">
        🌿 ✿ 🌱 ✿ 🌿
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="login-form-group">
          <label className="login-label">📧 Email</label>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
            required
          />
        </div>
        
        <div className="login-form-group">
          <label className="login-label">🔑 Mật khẩu</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            required
          />
        </div>
        
        <button type="submit" className="login-button">
          Đăng nhập
        </button>
      </form>
      
      {message && (
        <div className="login-message">
          {message}
        </div>
      )}
      

      <div style={{ 
        textAlign: 'center', 
        marginTop: '1.5rem', 
        fontSize: '0.75rem', 
        color: '#b5aa96',
        fontFamily: 'Georgia, serif',
        fontStyle: 'italic',
        borderTop: '1px dashed #c4b59a',
        paddingTop: '1rem'
      }}>
        ✦ Chào mừng đến với khu vườn của chúng tôi ✦
      </div>
    </div>
  );
}