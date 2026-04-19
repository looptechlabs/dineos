// ============================================================================
// DineOS - Orders API Proxy Route
// ============================================================================
// Server-side route that proxies order requests to the tenant backend
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createOrderOnBackend, fetchOrdersFromBackend, updateOrderStatusOnBackend } from '@/lib/services/orders/orders.service';
import { isValidToken } from '@/lib/utils/token';

/**
 * GET /api/orders
 * Fetch all orders for a tenant
 */
export async function GET(request: NextRequest) {
    console.log('[Orders API] GET request received');

    try {
        const { searchParams } = request.nextUrl;
        const tenantSlug = searchParams.get('tenantSlug');
        const token = searchParams.get('token');

        if (!tenantSlug || !isValidToken(token)) {
            console.error('[Orders API] Missing fields:', { tenantSlug: !!tenantSlug, token: !!token });
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Fetch orders from backend using service layer
        const orders = await fetchOrdersFromBackend(tenantSlug, token);

        console.log('[Orders API] Successfully fetched orders');
        return NextResponse.json({
            success: true,
            data: orders,
        });

    } catch (error) {
        console.error('[Orders API] Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        return NextResponse.json(
            {
                success: false,
                message: `Failed to fetch orders: ${errorMessage}`,
                debug: process.env.NODE_ENV === 'development' ? errorMessage : undefined
            },
            { status: 500 }
        );
    }
}

/**
 * POST /api/orders
 * Create a new order
 */
export async function POST(request: NextRequest) {
    console.log('[Orders API] POST request received');

    try {
        const body = await request.json();
        console.log('[Orders API] Request body:', body);

        const { tenantSlug, token, orderData } = body;

        if (!tenantSlug || !isValidToken(token) || !orderData) {
            console.error('[Orders API] Missing fields:', { tenantSlug: !!tenantSlug, token: !!token, orderData: !!orderData });
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Validate order data fields
        if (!orderData.invoiceId || !orderData.itemId || !orderData.quantity || !orderData.tableNumber) {
            return NextResponse.json(
                { success: false, message: 'Invalid order data: invoiceId, itemId, quantity, and tableNumber are required' },
                { status: 400 }
            );
        }

        // Create order on backend using service layer
        const order = await createOrderOnBackend(tenantSlug, orderData, token);

        console.log('[Orders API] Successfully created order');
        return NextResponse.json({
            success: true,
            data: order,
            message: 'Order created successfully',
        });

    } catch (error) {
        console.error('[Orders API] Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        return NextResponse.json(
            {
                success: false,
                message: `Failed to create order: ${errorMessage}`,
                debug: process.env.NODE_ENV === 'development' ? errorMessage : undefined
            },
            { status: 500 }
        );
    }
}

/**
 * PATCH /api/orders
 * Update order status
 */
export async function PATCH(request: NextRequest) {
    console.log('[Orders API] PATCH request received');

    try {
        const body = await request.json();
        console.log('[Orders API] Request body:', body);

        const { tenantSlug, token, orderId, status } = body;

        if (!tenantSlug || !isValidToken(token) || !orderId || !status) {
            console.error('[Orders API] Missing fields:', { tenantSlug: !!tenantSlug, token: !!token, orderId: !!orderId, status: !!status });
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Update order status on backend using service layer
        const order = await updateOrderStatusOnBackend(tenantSlug, orderId, status, token);

        console.log('[Orders API] Successfully updated order status');
        return NextResponse.json({
            success: true,
            data: order,
            message: 'Order status updated successfully',
        });

    } catch (error) {
        console.error('[Orders API] Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        return NextResponse.json(
            {
                success: false,
                message: `Failed to update order: ${errorMessage}`,
                debug: process.env.NODE_ENV === 'development' ? errorMessage : undefined
            },
            { status: 500 }
        );
    }
}
