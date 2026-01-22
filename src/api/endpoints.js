// src/api/endpoints.js
export const ENDPOINTS = {
  // Auth (matches your Django URLs)
  REGISTER: 'auth/register/',      
  LOGIN: 'auth/login/',          
  GOOGLE_LOGIN: "/auth/google/",  
  REFRESH: 'auth/refresh/',       
  PROFILE: 'auth/profile/',         
  ME: 'auth/me/',                   
  PRODUCTS: 'products/',                   
  HOMEPAGEPRODUCTS: 'products/homepageproducts',  
  PRODUCT_ID:'products/${id}'  ,
  CART:'cart/',
  DELETE_CART:'cart/delete/',
  QUANTITY:'cart/quantity/',
  CLEAR_CART:'cart/clear/',
  WISHLIST:'wishlist/',
  DEL_WISHLIST:'wishlist/delete/',
  CHECKOUT:'orders/checkout/preview/',
  ORDER_CREATE:'orders/create/',
  ORDER_CONFIRM:'orders/confirm-stripe/',
  ORDER_DET:'orders/${order_id}/',
  FORGOT_PASSWORD: 'auth/password_reset/',
  CONFIRM_PASSWORD:'auth/password_reset_confirm/',
  ADMIN_PRODUCTS:'admin/products/',
  CATEGORIES:'admin/categories/',
  ADMIN_USERS:'admin/users/',
  ADMIN_ORDERS:'admin/orders/',
  ADMIN_SINGLE_PRODUCT:'admin/${id}/'

//   // Future endpoints
//   USERS: 'users/',
//   DASHBOARD: 'dashboard/'
};
