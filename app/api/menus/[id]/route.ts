// ============================================================================
// DineOS - Menu by ID API Proxy Route
// ============================================================================
// Server-side route for single menu operations (PATCH, DELETE)
// Follows the same pattern as tenant-login route
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { updateMenuOnBackend, deleteMenuOnBackend } from '@/lib/services/menus.service';
import { isValidToken } from '@/lib/utils/token';

/**
 * PATCH /api/menus/[id]
 * Update an existing menu
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log('[Menus API] PATCH request received');
  
  try {
    const { id } = await params;
    const menuId = parseInt(id, 10);
    
    if (isNaN(menuId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid menu ID' },
        { status: 400 }
      );
    }
    
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

    // Update menu on backend using service layer
    const menu = await updateMenuOnBackend(tenantSlug, menuId, menuData, token);
    
    console.log('[Menus API] Successfully updated menu');
    return NextResponse.json({
      success: true,
      data: menu,
      message: 'Menu updated successfully',
    });

  } catch (error) {
    console.error('[Menus API] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      {
        success: false,
        message: `Failed to update menu: ${errorMessage}`,
        debug: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/menus/[id]
 * Delete a menu
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log('[Menus API] DELETE request received');
  
  try {
    const { id } = await params;
    const menuId = parseInt(id, 10);
    
    if (isNaN(menuId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid menu ID' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    console.log('[Menus API] Request body:', body);
    
    const { tenantSlug, token } = body;

    if (!tenantSlug || !isValidToken(token)) {
      console.error('[Menus API] Missing fields:', { tenantSlug: !!tenantSlug, token: !!token });
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Delete menu on backend using service layer
    await deleteMenuOnBackend(tenantSlug, menuId, token);
    
    console.log('[Menus API] Successfully deleted menu');
    return NextResponse.json({
      success: true,
      message: 'Menu deleted successfully',
    });

  } catch (error) {
    console.error('[Menus API] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      {
        success: false,
        message: `Failed to delete menu: ${errorMessage}`,
        debug: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}
