import { getAccessToken, handleTokenRefresh } from "./auth";

export interface Table{
    id: string;
    capacity?: number; 
    menuQRCode: string;
    paymentQrCode: string;
    tableNumber?: number;
    tenantId?: number
}

export async function getAllTables(tenantSlug:string): Promise<Table[]>{
    try{
        let token = getAccessToken(tenantSlug);
        console.log(`[getAllTables] Fetching tables for tenant: ${tenantSlug} with token: ${token}`);

        if(!token){
            throw new Error("No authentication token found");
        }

        const apiUrl = `/api/tables?tenantSlug=${tenantSlug}`;
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'content-type': 'application/json'
            },
        });

    if(response.status === 401){
        console.log('[getAllTables] Token expired, attempting to refresh');
        const newToken = await handleTokenRefresh(tenantSlug);
        if(newToken){
            token = newToken;
            const retryResponse = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
            });
        }
    }
    const result = await response.json();
    if(!response.ok){
        throw new Error(result.message || 'Failed to fetch tables');
    }
    return result.data as Table[];

    }catch(error){
    console.error('[fetchTables] Error:', error);
    throw error;
    }
}


export async function createTable(
  tenantSlug: string, 
  tableData: { tableNumber: number; capacity: number }
): Promise<Table> {
  try {
    let token = getAccessToken(tenantSlug);
    console.log(`[createTable] Creating table for tenant: ${tenantSlug}`, tableData);
    
    if (!token) {
      throw new Error('No authentication token found. Please login again.');
    }
    const apiUrl = `/api/tables?tenantSlug=${tenantSlug}`;
    // Call Next.js API proxy route
    let response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ tenantSlug, token, tableData }),
    });

     // Handle 401 - try refreshing token
    if (response.status === 401) {
      console.log('[createTable] Got 401, attempting token refresh...');
      const newToken = await handleTokenRefresh(tenantSlug);
      if (newToken) {
        token = newToken;
        response = await fetch('/api/tables', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tenantSlug, token, tableData }),
        });
      }
    }

        const result = await response.json();
    
    if (!result.success) {
      // Extract the actual error message from the response
      const errorMsg = result.message || 'Failed to create table';
      throw new Error(errorMsg);
    }
    
    return result.data;
    
  } catch (error) {
    console.error('[createTable] Error:', error);
    throw error;
  }
}