// src/api/endpoints.js

export const ENDPOINTS = {
  // Auth
  REGISTER: 'auth/register/',
  LOGIN: 'auth/login/',
  GOOGLE_LOGIN: 'auth/google/',
  REFRESH: 'auth/refresh/',
  PROFILE: 'auth/profile/',
  ME: 'auth/me/',

  // Products
  PRODUCTS: 'products/',
  HOMEPAGEPRODUCTS: 'products/homepageproducts/',
  PRODUCT_ID: (id) => `products/${id}/`,
  SEARCH_PRODUCTS: 'products/search/',

  // Cart
  CART: 'cart/',
  DELETE_CART: 'cart/delete/',
  QUANTITY: 'cart/quantity/',
  CLEAR_CART: 'cart/clear/',

  // Wishlista
  WISHLIST: 'wishlist/',
  DEL_WISHLIST: 'wishlist/delete/',

  // Orders
  CHECKOUT: 'orders/checkout/preview/',
  ORDER_CREATE: 'orders/create/',
  ORDER_CONFIRM: 'orders/confirm-stripe/',
  ORDER_DET: (order_id) => `orders/${order_id}/`,

  // Admin
  ADMIN_PRODUCTS: 'admin/products/',
  CATEGORIES: 'admin/categories/',
  ADMIN_USERS: 'admin/users/',
  ADMIN_ORDERS: 'admin/orders/',
  ADMIN_SINGLE_PRODUCT: (id) => `admin/${id}/`,
};
