// ============================================================================
// DineOS - Menu Items Page
// ============================================================================
// Display and manage items for a specific menu
// ============================================================================

import React from 'react';
import ItemsContent from '../../../../../components/tenant/menu/ItemsContent';

interface ItemsPageProps {
  params: Promise<{
    tenant: string;
    menuId: string;
  }>;
}

export default async function ItemsPage({ params }: ItemsPageProps) {
  const { tenant: tenantSlug, menuId } = await params;

  return <ItemsContent tenantSlug={tenantSlug} menuId={parseInt(menuId)} />;
}
