// ============================================================================
// DineOS - Tenant Root Page
// ============================================================================
// Routes: [tenant].dineos.localhost:3000
// Redirects to admin login for now
// ============================================================================

import { redirect } from 'next/navigation';

export default function TenantRootPage() {
  // For now, redirect to admin login
  redirect('/admin/login');
}
