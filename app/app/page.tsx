// ============================================================================
// DineOS - App Dashboard Index (Redirect to Login)
// ============================================================================

import { redirect } from 'next/navigation';

export default function AppIndexPage() {
  redirect('/app/login');
}
