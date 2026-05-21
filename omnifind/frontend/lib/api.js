const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `API error ${res.status}`);
  }

  return res.json();
}

async function authFetch(path, token, options = {}) {
  return apiFetch(path, {
    ...options,
    headers: { Authorization: `Bearer ${token}`, ...options.headers },
  });
}

export const api = {
  // Search
  search: (params) => apiFetch(`/api/search?${new URLSearchParams(params)}`),
  suggestions: (q) => apiFetch(`/api/search/suggestions?q=${encodeURIComponent(q)}`),
  categories: () => apiFetch('/api/search/categories'),

  // Products
  getProduct: (id) => apiFetch(`/api/products/${id}`),
  getProducts: (params) => apiFetch(`/api/products?${new URLSearchParams(params)}`),
  createProduct: (token, data) => authFetch('/api/products', token, { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (token, id, data) => authFetch(`/api/products/${id}`, token, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteProduct: (token, id) => authFetch(`/api/products/${id}`, token, { method: 'DELETE' }),

  // Stores
  getStore: (slug) => apiFetch(`/api/stores/${slug}`),
  getMyStores: (token) => authFetch('/api/stores/mine', token),
  createStore: (token, data) => authFetch('/api/stores', token, { method: 'POST', body: JSON.stringify(data) }),
  updateStore: (token, id, data) => authFetch(`/api/stores/${id}`, token, { method: 'PATCH', body: JSON.stringify(data) }),

  // Orders
  getMyOrders: (token) => authFetch('/api/orders', token),
  getStoreOrders: (token, storeId, params) => authFetch(`/api/orders/store/${storeId}?${new URLSearchParams(params)}`, token),
  updateOrderStatus: (token, id, status) => authFetch(`/api/orders/${id}/status`, token, { method: 'PATCH', body: JSON.stringify({ status }) }),

  // Analytics
  getAnalytics: (token, storeId, period) => authFetch(`/api/analytics/${storeId}?period=${period}`, token),

  // Checkout
  createCheckout: (token, data) => authFetch('/api/stripe/checkout', token, { method: 'POST', body: JSON.stringify(data) }),

  // Auth
  getMe: (token) => authFetch('/api/auth/me', token),
};
