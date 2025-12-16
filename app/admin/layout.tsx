// ============================================================================
// DineOS - Superadmin Layout
// ============================================================================

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DineOS Admin',
  description: 'DineOS Superadmin Panel',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {children}
    </div>
  );
}
