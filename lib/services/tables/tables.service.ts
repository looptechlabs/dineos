import { getBackendBaseUrl, getBackendHeaders, handleBackendResponse } from "../backend-client";

export interface Table{
    id: string;
    capacity?: number; 
    menuQRCode: string;
    paymentQrCode: string;
    tableNumber?: number;
    tenantId?: number
}

export async function getAllTables(tenantSlug: string, token:string): Promise<Table[]>{
    const backendUrl = `${getBackendBaseUrl(tenantSlug)}/seating-tables`;
    console.log(`[getAllTables] Fetching tables for tenant: ${tenantSlug} from ${backendUrl}`);

    const response = await fetch(backendUrl, {
        method: 'GET',
        headers: getBackendHeaders(token, tenantSlug),
    });

    return handleBackendResponse<Table[]>(response);
}

export async function createTable(tenantSlug: string, tableData: {tableNumber: number; capacity: number}, token:string): Promise<Table>{
    const backendUrl = `${getBackendBaseUrl(tenantSlug)}/seating-tables`;
    console.log(`[createTable] Creating table for tenant: ${tenantSlug} at ${backendUrl}`);

    const response = await fetch(backendUrl, {
        method: 'POST',
        headers: getBackendHeaders(token, tenantSlug),
        body: JSON.stringify(tableData),
    })

    return handleBackendResponse<Table>(response);
}