// ============================================================================
// DineOS - Tenant Login API Proxy Route
// ============================================================================
// This server-side route proxies login requests to the tenant backend
// Avoids CORS issues by making the call from Next.js server
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('[Tenant Login API] POST request received');
  
  try {
    const body = await request.json();
    console.log('[Tenant Login API] Request body:', body);
    
    const { tenantSlug, email, password } = body;

    if (!tenantSlug || !email || !password) {
      console.error('[Tenant Login API] Missing fields:', { tenantSlug: !!tenantSlug, email: !!email, password: !!password });
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Make request to tenant backend
    // Try both .menuly domain and direct IP with subdomain
    const backendUrls = [
      `http://${tenantSlug}.menuly:8080/api/v1/users/login`,
      `http://${tenantSlug}.52.63.95.108:8080/api/v1/users/login`,
    ];
    
    let backendResponse;
    let lastError;
    
    for (const backendUrl of backendUrls) {
      try {
        console.log(`[Tenant Login API] Trying: ${backendUrl}`);
        backendResponse = await fetch(backendUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-tenant-id': tenantSlug,
          },
          body: JSON.stringify({ email, password }),
        });
        console.log(`[Tenant Login API] Response status: ${backendResponse.status}`);
        break; // Success, exit loop
      } catch (err) {
        console.error(`[Tenant Login API] Failed to reach ${backendUrl}:`, err instanceof Error ? err.message : 'Unknown error');
        lastError = err;
        // Continue to next URL
      }
    }
    
    if (!backendResponse) {
      throw new Error(`Failed to connect to backend after trying all URLs. Last error: ${lastError instanceof Error ? lastError.message : 'Unknown'}`);
    }

    console.log(`[Tenant Login API] Backend response status: ${backendResponse.status}`);

    // Check if response has JSON content
    const contentType = backendResponse.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await backendResponse.text();
      console.error('[Tenant Login API] Non-JSON response:', text.substring(0, 200));
      throw new Error(`Backend returned non-JSON response: ${text.substring(0, 100)}`);
    }

    const data = await backendResponse.json();
    console.log('[Tenant Login API] Backend response data:', data);

    if (!backendResponse.ok) {
      console.error('[Tenant Login API] Backend error:', data);
      return NextResponse.json(
        {
          success: false,
          message: data.message || 'Login failed',
        },
        { status: backendResponse.status }
      );
    }

    console.log('[Tenant Login API] Login successful');
    return NextResponse.json({
      success: true,
      access_token: data.accessToken || data.access_token,
      refresh_token: data.refreshToken || data.refresh_token,
      message: 'Login successful',
    });

  } catch (error) {
    console.error('[Tenant Login API] Error details:', error);
    console.error('[Tenant Login API] Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('[Tenant Login API] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      {
        success: false,
        message: `Backend connection failed: ${errorMessage}`,
        debug: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}
