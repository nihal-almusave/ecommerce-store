import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAdminTokenLightweight } from './lib/admin-auth-lightweight';

// Routes that require admin authentication
const adminProtectedRoutes = [
  '/admin/dashboard',
  '/admin/products',
  '/admin/categories',
  '/admin/orders',
  '/admin/users',
  '/admin/settings',
];

// API routes that require admin authentication (exclude auth endpoints)
const adminProtectedApiRoutes = [
  '/api/admin',
];

// Public admin API routes (don't require authentication)
const publicAdminApiRoutes = [
  '/api/admin/auth/login',
  '/api/admin/auth/verify',
  '/api/admin/auth/logout',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if it's a public admin API route
  const isPublicAdminApi = publicAdminApiRoutes.some(route => pathname.startsWith(route));
  if (isPublicAdminApi) {
    return NextResponse.next();
  }

  // Check if it's an admin protected route
  const isAdminRoute = adminProtectedRoutes.some(route => pathname.startsWith(route));
  const isAdminApiRoute = adminProtectedApiRoutes.some(route => pathname.startsWith(route));

  // Allow access to login page
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Protect admin routes
  if (isAdminRoute || isAdminApiRoute) {
    const admin = await verifyAdminTokenLightweight(request);

    if (!admin) {
      // Redirect to login for pages, return 401 for API routes
      if (isAdminRoute) {
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      } else {
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }

    // Add admin info to request headers for API routes
    if (isAdminApiRoute) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-admin-id', admin._id);
      requestHeaders.set('x-admin-email', admin.email);
      
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};

