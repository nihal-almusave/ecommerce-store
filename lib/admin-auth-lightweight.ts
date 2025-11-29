import { NextRequest } from 'next/server';

export interface AdminUser {
  _id: string;
  email: string;
  name: string;
  role: 'admin';
}

/**
 * Decode base64url string (Edge Runtime compatible)
 */
function base64UrlDecode(str: string): string {
  // Replace URL-safe characters
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  
  // Add padding if needed
  while (str.length % 4) {
    str += '=';
  }
  
  // Decode using atob (available in Edge Runtime)
  try {
    return atob(str);
  } catch (e) {
    return '';
  }
}

/**
 * Decode JWT token without verification (Edge Runtime compatible)
 * This is used in middleware for routing decisions only.
 * Full verification with signature check happens in API routes.
 */
function decodeJWT(token: string): any | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];
    const decodedStr = base64UrlDecode(payload);
    const decoded = JSON.parse(decodedStr);

    // Check if token is expired
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return null;
    }

    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Lightweight token verification for middleware (Edge Runtime compatible)
 * Only decodes JWT token without signature verification (for routing)
 * Full verification happens in API routes
 * Use this in middleware.ts
 */
export async function verifyAdminTokenLightweight(
  request: NextRequest
): Promise<AdminUser | null> {
  try {
    const token = request.cookies.get('adminToken')?.value;

    if (!token) {
      return null;
    }

    // Decode token (no signature verification in middleware)
    const decoded = decodeJWT(token);

    if (!decoded) {
      return null;
    }

    // Check if role is admin
    if (decoded.role !== 'admin') {
      return null;
    }

    return {
      _id: decoded.userId || decoded._id || '',
      email: decoded.email || '',
      name: decoded.name || decoded.email?.split('@')[0] || 'Admin',
      role: 'admin',
    };
  } catch (error) {
    return null;
  }
}

