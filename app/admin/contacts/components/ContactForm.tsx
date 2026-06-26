'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ContactFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
  buttonText?: string;
}

export default function ContactForm({ initialData, onSubmit, isLoading, buttonText = 'Lưu' }: ContactFormProps) {
  const router = useRouter();
  const [fullname, setFullname] = useState(initialData?.fullname || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [subject, setSubject] = useState(initialData?.subject || '');
  const [message, setMessage] = useState(initialData?.message || '');
  const [isRead, setIsRead] = useState(initialData?.is_read ?? false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      fullname,
      email,
      phone,
      subject,
      message,
      is_read: isRead,
    };

    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="edit-form">
      <div className="edit-grid">
        {/* Left Column */}
        <div className="edit-left">
          <div className="edit-card">
            <h3 className="edit-card-title">📋 Thông tin liên hệ</h3>

            <div className="edit-group">
              <label className="edit-label">
                Họ tên <span className="edit-required">*</span>
              </label>
              <input
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="edit-input"
                placeholder="Nhập họ tên"
                required
              />
              <p className="edit-hint">Họ tên đầy đủ của người liên hệ</p>
            </div>

            <div className="edit-group">
              <label className="edit-label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="edit-input"
                placeholder="example@email.com"
              />
              <p className="edit-hint">Địa chỉ email của người liên hệ</p>
            </div>

            <div className="edit-group">
              <label className="edit-label">Điện thoại</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="edit-input"
                placeholder="0909 123 456"
              />
              <p className="edit-hint">Số điện thoại liên hệ</p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="edit-right">
          <div className="edit-card">
            <h3 className="edit-card-title">📝 Nội dung</h3>

            <div className="edit-group">
              <label className="edit-label">Chủ đề</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="edit-input"
                placeholder="Nhập chủ đề"
              />
              <p className="edit-hint">Chủ đề của liên hệ</p>
            </div>

            <div className="edit-group">
              <label className="edit-label">
                Nội dung <span className="edit-required">*</span>
              </label>
              <textarea
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="edit-textarea"
                placeholder="Nhập nội dung liên hệ..."
                required
              />
              <p className="edit-hint">Nội dung chi tiết của liên hệ</p>
            </div>
          </div>

          <div className="edit-card">
            <h3 className="edit-card-title">⚙️ Cài đặt</h3>

            <div className="edit-group">
              <label className="edit-label">Trạng thái</label>
              <div className="edit-toggle-group">
                <label className="edit-toggle">
                  <input
                    type="checkbox"
                    checked={isRead}
                    onChange={(e) => setIsRead(e.target.checked)}
                  />
                  <span className="edit-toggle-slider"></span>
                  <span className="edit-toggle-label">
                    {isRead ? '📖 Đã đọc' : '📩 Chưa đọc'}
                  </span>
                </label>
              </div>
              <p className="edit-hint">Đánh dấu liên hệ đã được đọc</p>
            </div>
          </div>

          {initialData && (
            <div className="edit-card">
              <h3 className="edit-card-title">ℹ️ Thông tin</h3>
              <div className="edit-info-box">
                <div className="edit-info-item">
                  <span className="edit-info-label">ID:</span>
                  <span className="edit-info-value">#{initialData.id}</span>
                </div>
                <div className="edit-info-item">
                  <span className="edit-info-label">Ngày tạo:</span>
                  <span className="edit-info-value">
                    {initialData.created_at 
                      ? new Date(initialData.created_at).toLocaleDateString('vi-VN') 
                      : new Date().toLocaleDateString('vi-VN')}
                  </span>
                </div>
                {initialData.updated_at && initialData.updated_at !== initialData.created_at && (
                  <div className="edit-info-item">
                    <span className="edit-info-label">Cập nhật:</span>
                    <span className="edit-info-value">
                      {new Date(initialData.updated_at).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="edit-actions">
        <button
          type="submit"
          className="edit-btn-save"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="edit-spinner"></span>
              Đang xử lý...
            </>
          ) : (
            `💾 ${buttonText}`
          )}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="edit-btn-cancel"
        >
          ❌ Hủy bỏ
        </button>
      </div>
    </form>
  );
}