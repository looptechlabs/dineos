// ============================================================================
// DineOS - Root Page (Redirects to marketing home)
// ============================================================================

import { redirect } from 'next/navigation';

export default function RootPage() {
  // Root domain without path goes to marketing home
  // The middleware handles this, but as a fallback:
  redirect('/home');
}
