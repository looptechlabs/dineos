// ============================================================================
// DineOS - Menus API Proxy Route
// ============================================================================
// Server-side route that proxies menu requests to the tenant backend
// Follows the same pattern as tenant-login route
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { fetchMenusFromBackend, createMenuOnBackend } from '@/lib/services/menus.service';
import { getTenantFromBody, isValidToken } from '@/lib/utils/token';

/**
 * GET /api/menus
 * Fetch all menus for a tenant
 */
export async function GET(request: NextRequest) {
  console.log('[Menus API] GET request received');
  
  try {
    const { searchParams } = request.nextUrl;
    const tenantSlug = searchParams.get('tenantSlug');
    const token = searchParams.get('token');

    if (!tenantSlug || !isValidToken(token)) {
      console.error('[Menus API] Missing fields:', { tenantSlug: !!tenantSlug, token: !!token });
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Fetch menus from backend using service layer
    const menus = await fetchMenusFromBackend(tenantSlug, token);
    
    console.log('[Menus API] Successfully fetched menus');
    return NextResponse.json({
      success: true,
      data: menus,
    });

  } catch (error) {
    console.error('[Menus API] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      {
        success: false,
        message: `Failed to fetch menus: ${errorMessage}`,
        debug: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/menus
 * Create a new menu
 */
export async function POST(request: NextRequest) {
  console.log('[Menus API] POST request received');
  
  try {
    const body = await request.json();
    console.log('[Menus API] Request body:', body);
    
    const { tenantSlug, token, menuData } = body;

    if (!tenantSlug || !isValidToken(token) || !menuData) {
      console.error('[Menus API] Missing fields:', { tenantSlug: !!tenantSlug, token: !!token, menuData: !!menuData });
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate menu data fields
    if (!menuData.name || !menuData.description || typeof menuData.isActive !== 'boolean') {
      return NextResponse.json(
        { success: false, message: 'Invalid menu data: name, description, and isActive are required' },
        { status: 400 }
      );
    }

    // Create menu on backend using service layer
    const menu = await createMenuOnBackend(tenantSlug, menuData, token);
    
    console.log('[Menus API] Successfully created menu');
    return NextResponse.json({
      success: true,
      data: menu,
      message: 'Menu created successfully',
    });

  } catch (error) {
    console.error('[Menus API] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      {
        success: false,
        message: `Failed to create menu: ${errorMessage}`,
        debug: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}
