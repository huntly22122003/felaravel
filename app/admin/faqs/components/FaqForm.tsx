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
    <form onSubmit={handleSubmit} style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Câu hỏi *</label>
        <textarea
          rows={3}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
          style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Câu trả lời</label>
        <textarea
          rows={6}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Thứ tự sắp xếp</label>
        <input
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(Number(e.target.value))}
          style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Kích hoạt
        </label>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: '10px 24px',
            background: '#2196F3',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          {isLoading ? 'Đang xử lý...' : buttonText}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          style={{
            padding: '10px 24px',
            background: '#999',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Hủy
        </button>
      </div>
    </form>
  );
}