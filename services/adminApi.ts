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

// ===== Banners =====
export const getBanners = async (params?: any) => {
  const token = getToken();
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/banners?${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch banners');
  return res.json();
};

export const getBanner = async (id: number) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/banners/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch banner');
  return res.json();
};

export const createBanner = async (data: FormData) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/banners`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: data,
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw { response: { data: errorData }, message: errorData.message || 'Failed to create banner' };
  }
  return res.json();
};

export const updateBanner = async (id: number, data: FormData) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/banners/${id}`, {
    method: 'POST',
    headers: { 
      Authorization: `Bearer ${token}`,
      'X-HTTP-Method-Override': 'PUT'
    },
    body: data,
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw { response: { data: errorData }, message: errorData.message || 'Failed to update banner' };
  }
  return res.json();
};

export const deleteBanner = async (id: number) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/banners/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete banner');
  return res.json();
};

// ===== Categories (Admin) =====
export const getCategories = async (params?: any) => {
  const token = getToken();
  const query = new URLSearchParams(params || {}).toString();
  const url = query ? `${API_BASE}/categories?${query}` : `${API_BASE}/categories`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
};

export const getCategory = async (id: number) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/categories/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch category');
  return res.json();
};

export const createCategory = async (data: any) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/categories`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw { response: { data: errorData }, message: errorData.message || 'Failed to create category' };
  }
  return res.json();
};

export const updateCategory = async (id: number, data: any) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/categories/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw { response: { data: errorData }, message: errorData.message || 'Failed to update category' };
  }
  return res.json();
};

export const deleteCategory = async (id: number) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/categories/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete category');
  return res.json();
};

// ===== Users (Admin) =====
export const getUsers = async (params?: any) => {
  const token = getToken();
  const query = new URLSearchParams(params || {}).toString();
  const url = query ? `${API_BASE}/users?${query}` : `${API_BASE}/users`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
};

export const getUser = async (id: number) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
};

export const createUser = async (data: any) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw { response: { data: errorData }, message: errorData.message || 'Failed to create user' };
  }
  return res.json();
};

export const updateUser = async (id: number, data: any) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw { response: { data: errorData }, message: errorData.message || 'Failed to update user' };
  }
  return res.json();
};

export const deleteUser = async (id: number) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete user');
  return res.json();
};

// ============================================
// ===== POSTS (Tin tức) =====
// ============================================

export const getPosts = async (params?: any) => {
  const token = getToken();
  const query = new URLSearchParams(params || {}).toString();
  const url = query ? `${API_BASE}/posts?${query}` : `${API_BASE}/posts`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
};

export const getPost = async (id: number) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/posts/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch post');
  return res.json();
};

export const createPost = async (data: FormData) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/posts`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: data,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: 'Unknown error' }));
    throw { response: { data: errorData }, message: errorData.message || 'Failed to create post' };
  }
  // Nếu response ok, nhưng body rỗng hoặc không parse được
  try {
    const json = await res.json();
    return json;
  } catch (e) {
    throw new Error('Response không hợp lệ (không phải JSON)');
  }
};

export const updatePost = async (id: number, data: FormData) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/posts/${id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'X-HTTP-Method-Override': 'PUT',
    },
    body: data,
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw { response: { data: errorData }, message: errorData.message || 'Failed to update post' };
  }
  return res.json();
};

export const deletePost = async (id: number) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/posts/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete post');
  return res.json();
};

// ===== Galleries =====
export const getGalleries = async (params?: any) => {
  const token = getToken();
  const query = new URLSearchParams(params || {}).toString();
  const url = query ? `${API_BASE}/galleries?${query}` : `${API_BASE}/galleries`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch galleries');
  return res.json();
};

export const getGallery = async (id: number) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/galleries/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch gallery');
  return res.json();
};

export const createGallery = async (data: FormData) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/galleries`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: data,
  });

  const responseData = await res.json();

  if (!res.ok) {
    let errorMessage = responseData.message || 'Tạo ảnh thất bại';
    if (responseData.errors) {
      const errorDetails = Object.values(responseData.errors).flat().join(', ');
      errorMessage = `${errorMessage}: ${errorDetails}`;
    }
    throw new Error(errorMessage);
  }

  return responseData;
};

export const updateGallery = async (id: number, data: FormData) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/galleries/${id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'X-HTTP-Method-Override': 'PUT',
    },
    body: data,
  });

  const responseData = await res.json();

  if (!res.ok) {
    let errorMessage = responseData.message || 'Cập nhật ảnh thất bại';
    if (responseData.errors) {
      const errorDetails = Object.values(responseData.errors).flat().join(', ');
      errorMessage = `${errorMessage}: ${errorDetails}`;
    }
    throw new Error(errorMessage);
  }

  return responseData;
};

export const deleteGallery = async (id: number) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/galleries/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete gallery');
  return res.json();
};

// ===== Contacts =====
export const getContacts = async (params?: any) => {
  const token = getToken();
  const query = new URLSearchParams(params || {}).toString();
  const url = query ? `${API_BASE}/contacts?${query}` : `${API_BASE}/contacts`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch contacts');
  return res.json();
};

export const getContact = async (id: number) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/contacts/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch contact');
  return res.json();
};

export const createContact = async (data: any) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/contacts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const responseData = await res.json();

  if (!res.ok) {
    let errorMessage = responseData.message || 'Tạo liên hệ thất bại';
    if (responseData.errors) {
      const errorDetails = Object.values(responseData.errors).flat().join(', ');
      errorMessage = `${errorMessage}: ${errorDetails}`;
    }
    throw new Error(errorMessage);
  }

  return responseData;
};

export const updateContact = async (id: number, data: any) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/contacts/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const responseData = await res.json();

  if (!res.ok) {
    let errorMessage = responseData.message || 'Cập nhật liên hệ thất bại';
    if (responseData.errors) {
      const errorDetails = Object.values(responseData.errors).flat().join(', ');
      errorMessage = `${errorMessage}: ${errorDetails}`;
    }
    throw new Error(errorMessage);
  }

  return responseData;
};

export const deleteContact = async (id: number) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/contacts/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete contact');
  return res.json();
};

// ===== FAQs =====
export const getFaqs = async (params?: any) => {
  const token = getToken();
  const query = new URLSearchParams(params || {}).toString();
  const url = query ? `${API_BASE}/faqs?${query}` : `${API_BASE}/faqs`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch faqs');
  return res.json();
};

export const getFaq = async (id: number) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/faqs/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch faq');
  return res.json();
};

export const createFaq = async (data: any) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/faqs`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const responseData = await res.json();

  if (!res.ok) {
    let errorMessage = responseData.message || 'Tạo câu hỏi thất bại';
    if (responseData.errors) {
      const errorDetails = Object.values(responseData.errors).flat().join(', ');
      errorMessage = `${errorMessage}: ${errorDetails}`;
    }
    throw new Error(errorMessage);
  }

  return responseData;
};

export const updateFaq = async (id: number, data: any) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/faqs/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const responseData = await res.json();

  if (!res.ok) {
    let errorMessage = responseData.message || 'Cập nhật câu hỏi thất bại';
    if (responseData.errors) {
      const errorDetails = Object.values(responseData.errors).flat().join(', ');
      errorMessage = `${errorMessage}: ${errorDetails}`;
    }
    throw new Error(errorMessage);
  }

  return responseData;
};

export const deleteFaq = async (id: number) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/faqs/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete faq');
  return res.json();
};


// ===== Pages (Introductions) =====
export const getPages = async (params?: any) => {
  const token = getToken();
  const query = new URLSearchParams(params || {}).toString();
  const url = query ? `${API_BASE}/pages?${query}` : `${API_BASE}/pages`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch pages');
  return res.json();
};

export const getPage = async (id: number) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/pages/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch page');
  return res.json();
};

export const createPage = async (data: any) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/pages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const responseData = await res.json();

  if (!res.ok) {
    let errorMessage = responseData.message || 'Tạo trang thất bại';
    if (responseData.errors) {
      const errorDetails = Object.values(responseData.errors).flat().join(', ');
      errorMessage = `${errorMessage}: ${errorDetails}`;
    }
    throw new Error(errorMessage);
  }

  return responseData;
};

export const updatePage = async (id: number, data: any) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/pages/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const responseData = await res.json();

  if (!res.ok) {
    let errorMessage = responseData.message || 'Cập nhật trang thất bại';
    if (responseData.errors) {
      const errorDetails = Object.values(responseData.errors).flat().join(', ');
      errorMessage = `${errorMessage}: ${errorDetails}`;
    }
    throw new Error(errorMessage);
  }

  return responseData;
};

export const deletePage = async (id: number) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/pages/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete page');
  return res.json();
};