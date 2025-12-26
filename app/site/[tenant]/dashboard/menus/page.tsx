// ============================================================================
// DineOS - Menus Page
// ============================================================================
// Manage restaurant menus
// ============================================================================

import React from 'react';
import MenusContent from '../../../../components/tenant/menu/MenusContent';

interface MenusPageProps {
  params: Promise<{
    tenant: string;
  }>;
}

export default async function MenusPage({ params }: MenusPageProps) {
  const { tenant: tenantSlug } = await params;


  return <MenusContent tenantSlug={tenantSlug} />;
}
