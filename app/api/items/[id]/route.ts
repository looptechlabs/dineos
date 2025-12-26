// ============================================================================
// DineOS - Item by ID API Proxy Route
// ============================================================================
// Server-side route for single item operations (PATCH, DELETE)
// Follows the same pattern as tenant-login route
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { updateItemOnBackend, deleteItemOnBackend } from '@/lib/services/items.service';
import { isValidToken } from '@/lib/utils/token';

/**
 * PATCH /api/items/[id]
 * Update an existing item
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log('[Items API] PATCH request received');
  
  try {
    const { id } = await params;
    const itemId = parseInt(id, 10);
    
    if (isNaN(itemId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid item ID' },
        { status: 400 }
      );
    }
    
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

    // Update item on backend using service layer
    const item = await updateItemOnBackend(tenantSlug, itemId, itemData, token);
    
    console.log('[Items API] Successfully updated item');
    return NextResponse.json({
      success: true,
      data: item,
      message: 'Item updated successfully',
    });

  } catch (error) {
    console.error('[Items API] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      {
        success: false,
        message: `Failed to update item: ${errorMessage}`,
        debug: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/items/[id]
 * Delete an item
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log('[Items API] DELETE request received');
  
  try {
    const { id } = await params;
    const itemId = parseInt(id, 10);
    
    if (isNaN(itemId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid item ID' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    console.log('[Items API] Request body:', body);
    
    const { tenantSlug, token } = body;

    if (!tenantSlug || !isValidToken(token)) {
      console.error('[Items API] Missing fields:', { tenantSlug: !!tenantSlug, token: !!token });
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Delete item on backend using service layer
    await deleteItemOnBackend(tenantSlug, itemId, token);
    
    console.log('[Items API] Successfully deleted item');
    return NextResponse.json({
      success: true,
      message: 'Item deleted successfully',
    });

  } catch (error) {
    console.error('[Items API] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      {
        success: false,
        message: `Failed to delete item: ${errorMessage}`,
        debug: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}
