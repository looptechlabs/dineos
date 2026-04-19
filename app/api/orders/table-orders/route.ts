import {NextRequest, NextResponse} from 'next/server';
import { fetchOrdersBasedOnTable } from '@/lib/services/orders/orders.service';
import { isValidToken } from '@/lib/utils/token';

export async function GET(request: NextRequest){

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
        const orders = await fetchOrdersBasedOnTable(tenantSlug, token);

        console.log('[Table based Orders API] Successfully fetched table based orders');
        return NextResponse.json({
            success: true,
            data: orders,
        });

    } catch (error) {
        console.error('[Table based Orders API] Error:', error);
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