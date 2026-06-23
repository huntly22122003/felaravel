'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getProducts, createOrder } from '@/services/adminApi';

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

  // ✅ Sửa hàm updateItem an toàn, không dùng newItems[index][field] = value
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

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '20px' }}>Tạo đơn hàng mới</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Khách hàng</label>
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          >
            <option value="">Khách lẻ</option>
            {customers.map((customer: any) => (
              <option key={customer.id} value={customer.id}>
                {customer.name} {customer.email ? `(${customer.email})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Trạng thái</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          >
            <option value="new">Mới</option>
            <option value="processing">Đang xử lý</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Sản phẩm</label>
          {items.map((item, index) => (
            <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <select
                value={item.product_id || ''}
                onChange={(e) => updateItem(index, 'product_id', e.target.value)}
                style={{ flex: '1', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', minWidth: '150px' }}
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
                style={{ flex: '1', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', minWidth: '120px' }}
                required
              />
              <input
                type="number"
                placeholder="SL"
                value={item.quantity}
                onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                style={{ width: '80px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                min="1"
                required
              />
              <input
                type="number"
                placeholder="Giá"
                value={item.price}
                onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                style={{ width: '120px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                min="0"
                step="1000"
                required
              />
              <button
                type="button"
                onClick={() => removeItem(index)}
                style={{ padding: '6px 12px', background: '#f44336', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                disabled={items.length === 1}
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            style={{ padding: '8px 16px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            + Thêm sản phẩm
          </button>
        </div>

        <div style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 'bold', textAlign: 'right' }}>
          Tổng tiền: {total.toLocaleString('vi-VN')} ₫
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Ghi chú</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="submit"
            disabled={loading}
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
            {loading ? 'Đang xử lý...' : 'Tạo đơn hàng'}
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
    </div>
  );
}