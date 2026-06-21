const API_BASE = '/api/admin';

// Helper lấy token
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('admin_token');
  }
  return null;
};

// ---- Auth ----
export const loginAdmin = async (username: string, password: string) => {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Login failed');
  }
  return res.json();
};

export const logoutAdmin = async () => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/logout`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Logout failed');
  return res.json();
};

// ✅ SỬA: không nhận token, tự lấy trong hàm
export const getAdminUser = async () => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
};

// ---- Products ----
export const getProducts = async (params?: any) => {
  const token = getToken();
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/products?${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
};

export const getProduct = async (id: number) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
};

export const createProduct = async (data: FormData) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: data,
  });
  if (!res.ok) {
    const errorData = await res.json();
    // Ném lỗi với response để component bắt được
    throw { response: { data: errorData }, message: errorData.message || 'Failed to create product' };
  }
  return res.json();
};

export const updateProduct = async (id: number, data: FormData) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'POST',
    headers: { 
      Authorization: `Bearer ${token}`,
      'X-HTTP-Method-Override': 'PUT'
    },
    body: data,
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw { response: { data: errorData }, message: errorData.message || 'Failed to update product' };
  }
  return res.json();
};

export const deleteProduct = async (id: number) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete product');
  return res.json();
};

export const updateProductOrder = async (ids: number[], orders: number[]) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/products/update-order`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ids, orders }),
  });
  if (!res.ok) throw new Error('Failed to update order');
  return res.json();
};