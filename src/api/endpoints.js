// src/api/endpoints.js

export const ENDPOINTS = {
  // Auth
  REGISTER: 'api/auth/register/',
  LOGIN: 'api/auth/login/',
  GOOGLE_LOGIN: 'api/auth/google/',
  REFRESH: 'api/auth/refresh/',
  PROFILE: 'api/auth/profile/',
  ME: 'api/auth/me/',

  // Products
  PRODUCTS: 'api/products/',
  HOMEPAGEPRODUCTS: 'api/products/homepageproducts/',
  PRODUCT_ID: (id) => `api/products/${id}/`,
  SEARCH_PRODUCTS: 'api/products/search/',

  // Cart
  CART: 'api/cart/',
  DELETE_CART: 'api/cart/delete/',
  QUANTITY: 'api/cart/quantity/',
  CLEAR_CART: 'api/cart/clear/',

  // Wishlista
  WISHLIST: 'api/wishlist/',
  DEL_WISHLIST: 'api/wishlist/delete/',

  // Orders
  CHECKOUT: 'api/orders/checkout/preview/',
  ORDER_CREATE: 'api/orders/create/',
  ORDER_CONFIRM: 'api/orders/confirm-stripe/',
  ORDER_DET: (order_id) => `api/orders/${order_id}/`,

  // Admin
  ADMIN_PRODUCTS: 'api/admin/products/',
  CATEGORIES: 'api/admin/categories/',
  ADMIN_USERS: 'api/admin/users/',
  ADMIN_ORDERS: 'api/admin/orders/',
  ADMIN_SINGLE_PRODUCT: (id) => `api/admin/${id}/`,
};
