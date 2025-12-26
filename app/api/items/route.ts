// ============================================================================
// DineOS - Items API Proxy Route
// ============================================================================
// Server-side route that proxies item requests to the tenant backend
// Follows the same pattern as tenant-login route
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { fetchItemsFromBackend, createItemOnBackend } from '@/lib/services/items.service';
import { isValidToken } from '@/lib/utils/token';

/**
 * GET /api/items?menuId=123&tenantSlug=pizzahut&token=xxx
 * Fetch all items for a specific menu
 */
export async function GET(request: NextRequest) {
  console.log('[Items API] GET request received');
  
  try {
    const { searchParams } = request.nextUrl;
    const tenantSlug = searchParams.get('tenantSlug');
    const token = searchParams.get('token');
    const menuIdParam = searchParams.get('menuId');

    if (!tenantSlug || !isValidToken(token) || !menuIdParam) {
      console.error('[Items API] Missing fields:', { tenantSlug: !!tenantSlug, token: !!token, menuId: !!menuIdParam });
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const menuId = parseInt(menuIdParam, 10);
    if (isNaN(menuId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid menuId' },
        { status: 400 }
      );
    }

    // Fetch items from backend using service layer
    const items = await fetchItemsFromBackend(tenantSlug, menuId, token);
    
    console.log('[Items API] Successfully fetched items');
    return NextResponse.json({
      success: true,
      data: items,
    });

  } catch (error) {
    console.error('[Items API] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      {
        success: false,
        message: `Failed to fetch items: ${errorMessage}`,
        debug: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/items
 * Create a new item
 */
export async function POST(request: NextRequest) {
  console.log('[Items API] POST request received');
  
  try {
    const body = await request.json();
    console.log('[Items API] Request body:', body);
    
    const { tenantSlug, token, itemData } = body;

    if (!tenantSlug || !isValidToken(token) || !itemData) {
      console.error('[Items API] Missing fields:', { tenantSlug: !!tenantSlug, token: !!token, itemData: !!itemData });
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate item data fields
    if (!itemData.menu_id || !itemData.name || !itemData.description || 
        typeof itemData.price !== 'number' || typeof itemData.isAvailable !== 'boolean' || 
        !itemData.type) {
      return NextResponse.json(
        { success: false, message: 'Invalid item data: menu_id, name, description, price, isAvailable, and type are required' },
        { status: 400 }
      );
    }

    // Create item on backend using service layer
    const item = await createItemOnBackend(tenantSlug, itemData, token);
    
    console.log('[Items API] Successfully created item');
    return NextResponse.json({
      success: true,
      data: item,
      message: 'Item created successfully',
    });

  } catch (error) {
    console.error('[Items API] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      {
        success: false,
        message: `Failed to create item: ${errorMessage}`,
        debug: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}
