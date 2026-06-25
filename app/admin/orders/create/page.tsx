'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getProducts, createOrder } from '@/services/adminApi';
import './create-order.css';

interface OrderItem {
  product_id: number | null;
  product_name: string;
  quantity: number;
  price: number;
}

interface Product {
  id: number;
  name: string;
  price?: number;
}

export default function CreateOrderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customerId, setCustomerId] = useState('');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('new');
  const [items, setItems] = useState<OrderItem[]>([
    { product_id: null, product_name: '', quantity: 1, price: 0 }
  ]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRes = await getProducts({ per_page: 100 });
        setProducts(productsRes.data || []);
        setCustomers([]); // TODO: thay bằng API getCustomers sau
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const newTotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    setTotal(newTotal);
  }, [items]);

  const addItem = () => {
    setItems([...items, { product_id: null, product_name: '', quantity: 1, price: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof OrderItem, value: any) => {
    const newItems = [...items];
    if (field === 'product_id') {
      const product = products.find(p => p.id === Number(value));
      if (product) {
        newItems[index].product_id = product.id;
        newItems[index].product_name = product.name;
        newItems[index].price = product.price || 0;
      }
    } else if (field === 'product_name') {
      newItems[index].product_name = value;
    } else if (field === 'quantity') {
      newItems[index].quantity = Number(value);
    } else if (field === 'price') {
      newItems[index].price = Number(value);
    }
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.some(item => !item.product_name || item.quantity < 1 || item.price < 0)) {
      alert('Vui lòng nhập đầy đủ thông tin sản phẩm');
      return;
    }

    const data = {
      customer_id: customerId || null,
      status,
      note,
      items: items.map(item => ({
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    setLoading(true);
    try {
      await createOrder(data);
      router.push('/admin/orders');
    } catch (error: any) {
      console.error('Create error:', error);
      alert('Tạo đơn hàng thất bại: ' + (error.message || ''));
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div className="order-create-container">
      {/* Header */}
      <div className="order-create-header">
        <div>
          <h1 className="order-create-title">➕ Tạo đơn hàng mới</h1>
          <p className="order-create-subtitle">Nhập thông tin đơn hàng và sản phẩm</p>
        </div>
        <Link href="/admin/orders" className="order-create-back-btn">
          ← Quay lại
        </Link>
      </div>

      {/* Form */}
      <div className="order-create-form-wrapper">
        <form onSubmit={handleSubmit} className="order-create-form">
          {/* Customer */}
          <div className="order-create-form-group">
            <label className="order-create-label">Khách hàng</label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="order-create-select"
            >
              <option value="">Khách lẻ</option>
              {customers.map((customer: any) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} {customer.email ? `(${customer.email})` : ''}
                </option>
              ))}
            </select>
            <p className="order-create-hint">Chọn khách hàng hoặc để trống cho khách lẻ</p>
          </div>

          {/* Status */}
          <div className="order-create-form-group">
            <label className="order-create-label">Trạng thái</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="order-create-select"
            >
              <option value="new">🆕 Mới</option>
              <option value="processing">⚙️ Đang xử lý</option>
              <option value="completed">✅ Hoàn thành</option>
              <option value="cancelled">❌ Đã hủy</option>
            </select>
          </div>

          {/* Products */}
          <div className="order-create-form-group">
            <label className="order-create-label">Sản phẩm</label>
            <div className="order-create-items">
              {items.map((item, index) => (
                <div key={index} className="order-create-item">
                  <select
                    value={item.product_id || ''}
                    onChange={(e) => updateItem(index, 'product_id', e.target.value)}
                    className="order-create-item-input"
                  >
                    <option value="">Chọn sản phẩm</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Tên sản phẩm"
                    value={item.product_name}
                    onChange={(e) => updateItem(index, 'product_name', e.target.value)}
                    className="order-create-item-input"
                    required
                  />
                  <input
                    type="number"
                    placeholder="SL"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                    className="order-create-item-input"
                    min="1"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Giá"
                    value={item.price}
                    onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                    className="order-create-item-input"
                    min="0"
                    step="1000"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="order-create-item-remove"
                    disabled={items.length === 1}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addItem}
              className="order-create-add-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Thêm sản phẩm
            </button>
          </div>

          {/* Total */}
          <div className="order-create-total">
            <span className="order-create-total-label">Tổng tiền:</span>
            <span className="order-create-total-value">{formatPrice(total)}</span>
          </div>

          {/* Note */}
          <div className="order-create-form-group">
            <label className="order-create-label">Ghi chú</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="order-create-textarea"
              placeholder="Nhập ghi chú cho đơn hàng..."
            />
          </div>

          {/* Actions */}
          <div className="order-create-actions">
            <button
              type="button"
              onClick={() => router.back()}
              className="order-create-btn-cancel"
            >
              ❌ Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={loading}
              className="order-create-btn-submit"
            >
              {loading ? (
                <>
                  <span className="order-create-spinner"></span>
                  Đang xử lý...
                </>
              ) : (
                '💾 Tạo đơn hàng'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}