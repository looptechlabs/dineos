// ============================================================================
// DineOS - Tenant Dashboard Layout (App Subdomain)
// ============================================================================
// Routes: app.dineos.localhost:3000/*
// This is where restaurant owners/admins manage their restaurant
// ============================================================================

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DineOS Dashboard',
  description: 'Manage your restaurant with DineOS',
};

export default function AppLayout({
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
