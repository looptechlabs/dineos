// ============================================================================
// DineOS - Invoices API Proxy Route
// ============================================================================
// Server-side route that proxies invoice requests to the tenant backend
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createInvoiceOnBackend, fetchInvoicesFromBackend } from '@/lib/services/orders/invoices.service';
import { isValidToken } from '@/lib/utils/token';

/**
 * GET /api/invoices
 * Fetch all invoices for a tenant
 */
export async function GET(request: NextRequest) {
    console.log('[Invoices API] GET request received');

    try {
        const { searchParams } = request.nextUrl;
        const tenantSlug = searchParams.get('tenantSlug');
        const token = searchParams.get('token');
        const tableId = searchParams.get('tableId');

        if (!tenantSlug || !isValidToken(token)) {
            console.error('[Invoices API] Missing fields:', { tenantSlug: !!tenantSlug, token: !!token });
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Fetch invoices from backend using service layer
        const invoices = await fetchInvoicesFromBackend(
            tenantSlug, 
            token, 
            tableId || undefined
        );

        console.log('[Invoices API] Successfully fetched invoices');
        return NextResponse.json({
            success: true,
            data: invoices,
        });

    } catch (error) {
        console.error('[Invoices API] Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        return NextResponse.json(
            {
                success: false,
                message: `Failed to fetch invoices: ${errorMessage}`,
                debug: process.env.NODE_ENV === 'development' ? errorMessage : undefined
            },
            { status: 500 }
        );
    }
}

/**
 * POST /api/invoices
 * Create a new invoice
 */
export async function POST(request: NextRequest) {
    console.log('[Invoices API] POST request received');

    try {
        const body = await request.json();
        console.log('[Invoices API] Request body:', body);

        const { tenantSlug, token, invoiceData } = body;

        if (!tenantSlug || !isValidToken(token) || !invoiceData) {
            console.error('[Invoices API] Missing fields:', { tenantSlug: !!tenantSlug, token: !!token, invoiceData: !!invoiceData });
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Validate invoice data fields
        if (!invoiceData.tableNumber || invoiceData.total === undefined) {
            return NextResponse.json(
                { success: false, message: 'Invalid invoice data: tableNumber and total are required' },
                { status: 400 }
            );
        }

        // Create invoice on backend using service layer
        const invoice = await createInvoiceOnBackend(tenantSlug, invoiceData, token);

        console.log('[Invoices API] Successfully created invoice');
        return NextResponse.json({
            success: true,
            data: invoice,
            message: 'Invoice created successfully',
        });

    } catch (error) {
        console.error('[Invoices API] Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        return NextResponse.json(
            {
                success: false,
                message: `Failed to create invoice: ${errorMessage}`,
                debug: process.env.NODE_ENV === 'development' ? errorMessage : undefined
            },
            { status: 500 }
        );
    }
}
