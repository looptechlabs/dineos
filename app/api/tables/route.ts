import { NextRequest, NextResponse } from "next/server";
import { createTable, getAllTables } from "@/lib/services/tables/tables.service";
import { isValidToken } from "@/lib/utils/token";

export async function GET(request: NextRequest){
    console.log("[tables/route.ts] GET request received");
    try{
        const {searchParams} = request.nextUrl;
        const tenantSlug = searchParams.get('tenantSlug');
        const token = request.headers.get('Authorization')?.split(' ')[1];

        if(!tenantSlug || !isValidToken(token)){
            console.error("[tables/route.ts] Missing or invalid tenantSlug/token");
            return NextResponse.json({message: "Unauthorized"}, {status: 401});
    }

    const tables = await getAllTables(tenantSlug, token);
    console.log(`[tables/route.ts] Retrieved ${tables.length} tables for tenant: ${tenantSlug}`);
    return NextResponse.json({success: true, data: tables});
    }catch(error){
        console.error("[tables/route.ts] Error fetching tables:", error);
        const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json({message: errorMessage}, {status: 500});
    }
}

export async function POST(request: NextRequest){
    console.log("[tables/route.ts] GET request received");
    try{
      const {searchParams} = request.nextUrl;  //NextURL Object Structure
// {
//   href: "http://pizzahut.dineos.localhost:3000/dashboard/tables",
//   origin: "http://pizzahut.dineos.localhost:3000",
//   protocol: "http:",
//   username: "",
//   password: "",
//   host: "pizzahut.dineos.localhost:3000",
//   hostname: "pizzahut.dineos.localhost",
//   port: "3000",
//   pathname: "/dashboard/tables",
//   search: "",
//   searchParams: URLSearchParams { }, // Empty if no ?query=...
//   hash: ""
// }
        const tenantSlug = searchParams.get('tenantSlug');
        const token = request.headers.get('Authorization')?.split(' ')[1];
        const body = await request.json();
        const {tableData} = body;
        if(!tenantSlug || !isValidToken(token)){
            console.error("[tables/route.ts] Missing or invalid tenantSlug/token");
            return NextResponse.json({message: "Unauthorized"}, {status: 401});
        }

        if(typeof tableData.tableNumber !== "number" || tableData.tableNumber=== null || typeof tableData.capacity !== "number" || tableData.capacity === null){ 
            return NextResponse.json(
            { success: false, message: 'Invalid table data: tableNumber and capacity must be numbers' },
            { status: 400 }
          );
        }

      const tables = await createTable(tenantSlug, tableData, token);
         console.log('[Tables API] Successfully created table');
    return NextResponse.json({
      success: true,
      data: tableData,
      message: 'Table created successfully',
    });
    
      return NextResponse.json({success: true, data: tables});
    }catch(error){
        console.error("[tables/route.ts] Error creating table:", error);
        const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json({message: errorMessage}, {status: 500});
    }
}