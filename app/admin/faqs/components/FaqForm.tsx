'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FaqFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
  buttonText?: string;
}

export default function FaqForm({ initialData, onSubmit, isLoading, buttonText = 'Lưu' }: FaqFormProps) {
  const router = useRouter();
  const [question, setQuestion] = useState(initialData?.question || '');
  const [answer, setAnswer] = useState(initialData?.answer || '');
  const [sortOrder, setSortOrder] = useState(initialData?.sort_order || 0);
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      question,
      answer,
      sort_order: Number(sortOrder),
      is_active: isActive ? 1 : 0,
    };

    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="edit-form">
      <div className="edit-grid">
        {/* Left Column */}
        <div className="edit-left">
          <div className="edit-card">
            <h3 className="edit-card-title">📝 Nội dung</h3>

            <div className="edit-group">
              <label className="edit-label">
                Câu hỏi <span className="edit-required">*</span>
              </label>
              <textarea
                rows={3}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="edit-textarea"
                placeholder="Nhập câu hỏi..."
                required
              />
              <p className="edit-hint">Câu hỏi thường gặp của khách hàng</p>
            </div>

            <div className="edit-group">
              <label className="edit-label">Câu trả lời</label>
              <textarea
                rows={6}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="edit-textarea"
                placeholder="Nhập câu trả lời chi tiết..."
              />
              <p className="edit-hint">Câu trả lời cho câu hỏi</p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="edit-right">
          <div className="edit-card">
            <h3 className="edit-card-title">⚙️ Cài đặt</h3>

            <div className="edit-group">
              <label className="edit-label">Thứ tự sắp xếp</label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className="edit-input"
                placeholder="0"
                min="0"
              />
              <p className="edit-hint">Số nhỏ hơn sẽ hiển thị trước</p>
            </div>

            <div className="edit-group">
              <label className="edit-label">Trạng thái</label>
              <div className="edit-toggle-group">
                <label className="edit-toggle">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                  />
                  <span className="edit-toggle-slider"></span>
                  <span className="edit-toggle-label">
                    {isActive ? '🟢 Kích hoạt' : '🔴 Không kích hoạt'}
                  </span>
                </label>
              </div>
              <p className="edit-hint">Câu hỏi sẽ hiển thị trên website</p>
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