import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PROXY_FILENAME } from 'next/dist/lib/constants';

// Backend API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://52.63.95.108:8080/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, slug } = body;

    if (!email || !password || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log(`[Auth API] Attempting login for ${email} on tenant ${slug}`);

    // Construct tenant-specific URL: http://{slug}.52.63.95.108:8080/api/users/login
    // Parse the base URL and reconstruct with slug subdomain
    const baseUrl = API_BASE_URL.endsWith('/api') 
      ? API_BASE_URL.slice(0, -4)  // Remove '/api' if present
      : API_BASE_URL;
    
    // Extract protocol, host, and port
    const urlMatch = baseUrl.match(/^(https?:\/\/)([^:\/]+)(:\d+)?/);
    if (!urlMatch) {
      throw new Error('Invalid API_BASE_URL format');
    }
    
    const [, protocol, host, port] = urlMatch;
    const loginUrl = `${protocol}${slug}.${host}${port || ''}/api/users/login`;

    console.log(`[Auth API] Calling backend: ${loginUrl}`);

    // Call Backend API
    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-id': slug,
      },
      body: JSON.stringify({ email, password }),
    });

    console.log(`[Auth API] Response status: ${response.status}`);
    console.log(`[Auth API] Response headers:`, Object.fromEntries(response.headers.entries()));

    // Check if response has content before parsing
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error(`[Auth API] Non-JSON response:`, text);
      throw new Error(`Backend returned non-JSON response: ${text.substring(0, 100)}`);
    }

    const data = await response.json();

    if (!response.ok) {
      console.error(`[Auth API] Login failed: ${response.status}`, data);
      return NextResponse.json(
        { error: data.message || 'Login failed' },
        { status: response.status }
      );
    }

    // Login successful - Set cookies
    // We expect data to contain { accessToken, refreshToken, user, ... }
    // Adjust based on your actual backend response structure
    const { accessToken, refreshToken, user } = data.data || data;

    const cookieStore = await cookies();

    // Set Access Token (Short lived, e.g., 1 hour)
    if (accessToken) {
      cookieStore.set('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60, // 1 hour
      });
    }

    // Set Refresh Token (Long lived, e.g., 7 days)
    if (refreshToken) {
      cookieStore.set('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    return NextResponse.json({ success: true, user });

  } catch (error) {
    console.error('[Auth API] Internal error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
