export const publicRoutes = ['/', '/auth/new-verification', '/courses'];

/*
 If user are logged in and trying to access these pages, then he would be redirected to DEFAULT_LOGIN_REDIRECT
 */
export const authRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/error',
  '/auth/reset-password',
  '/auth/new-password',
];

export const apiAuthPrefix = ['/api/auth', '/api/upload/video'];

//export const apiAuthPrefix = '/api/auth'

export const DEFAULT_LOGIN_REDIRECT = '/dashboard';
