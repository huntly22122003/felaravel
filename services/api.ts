// D:\TongLaravel\frontend\services\api.ts

const API_BASE = '/api';

export const fetchCategories = async () => {
  const res = await fetch(`${API_BASE}/categories`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
};

export const fetchProducts = async (params?: Record<string, any>) => {
  const query = new URLSearchParams(params || {}).toString();
  const url = query ? `${API_BASE}/products?${query}` : `${API_BASE}/products`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
};

export const fetchPosts = async () => {
  const res = await fetch(`${API_BASE}/posts`);
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
};

export const fetchBanners = async () => {
  const res = await fetch(`${API_BASE}/banners`);
  if (!res.ok) throw new Error('Failed to fetch banners');
  return res.json();
};

export const fetchMenus = async () => {
  const res = await fetch(`${API_BASE}/menus`);
  if (!res.ok) throw new Error('Failed to fetch menus');
  return res.json();
};

export const fetchGalleries = async () => {
  const res = await fetch(`${API_BASE}/galleries`);
  if (!res.ok) throw new Error('Failed to fetch galleries');
  return res.json();
};

export const login = async (email: string, password: string) => {
  // Tạm thời dùng member API để login (có thể thay bằng route riêng sau)
  // Vì BE chưa có auth, ta sẽ gửi request lên /api/members để test
  const res = await fetch(`${API_BASE}/members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, fullname: 'Test', username: email }),
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
};

export const register = async (data: {
  fullname: string;
  email: string;
  username: string;
  password: string;
  phone?: string;
  address?: string;
}) => {
  const res = await fetch(`${API_BASE}/members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Registration failed');
  return res.json();
};

// Contact
export const sendContact = async (data: {
  fullname: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}) => {
  const res = await fetch(`${API_BASE}/contacts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Send contact failed');
  return res.json();
};

// Order
export const createOrder = async (data: {
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_address?: string;
  items: { product_id?: number; product_name: string; quantity: number; price: number }[];
}) => {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Create order failed');
  return res.json();
};