// ============================================================================
// DineOS - Tenant Exists API Route (Proxy)
// ============================================================================
// This API route proxies tenant existence checks to avoid CORS issues
// Route: GET /api/tenants/exists?slug=looptech
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/config/env';

const API_BASE_URL = `${env.API_BASE_URL}`;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      );
    }

    console.log(`[API Route] Checking tenant existence: ${slug}`);
    
    const apiUrl = `${API_BASE_URL}/tenants/exists?slug=${slug}`;
    console.log(`[API Route] Proxying to: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-API-Key': 'dVJOZclvTjIkVrz3CHp3vgYgyAreoyNLTg3zL24tbfvk'

      },
    });

    console.log(`[API Route] Backend response status: ${response.status}`);

    // Return the same status code as the backend
    if (response.status === 200) {
      return NextResponse.json({ exists: true }, { status: 200 });
    } else {
      return NextResponse.json({ exists: false }, { status: 404 });
    }
  } catch (error) {
    console.error('[API Route] Error checking tenant:', error);
    return NextResponse.json(
      { error: 'Failed to check tenant existence', exists: false },
      { status: 500 }
    );
  }
}
