// ============================================================================
// DineOS - Dashboard Header Component
// ============================================================================
// Top header with notifications and profile
// ============================================================================

'use client';

import React, { useState } from 'react';
import { Bell, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useTenant } from '@/context/TenantContext';
import { useAuth } from '@/lib/hooks/useAuth';

export function Header() {
  const { tenant, tenantSlug } = useTenant();
  const { logout } = useAuth(tenantSlug);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notificationCount] = useState(3); // Mock notification count

  return (
    <header className="fixed top-0 right-0 left-0 h-16 bg-white border-b border-zinc-200 z-30">
      <div className="h-full flex items-center justify-between px-6">
        {/* Left side - could add breadcrumbs or search here */}
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-zinc-900">
            {tenant?.branding?.name || 'Dashboard'}
          </h1>
        </div>

        {/* Right side - Notifications & Profile */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button 
            className="relative p-2 rounded-lg hover:bg-zinc-100 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5 text-zinc-600" />
            {notificationCount > 0 && (
              <span 
                className="absolute top-1 right-1 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-semibold"
                style={{ backgroundColor: tenant?.branding?.primaryColor || '#6366F1' }}
              >
                {notificationCount}
              </span>
            )}
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 p-2 pr-3 rounded-lg hover:bg-zinc-100 transition-colors"
            >
              <div 
                className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: tenant?.branding?.primaryColor || '#6366F1' }}
              >
                <User className="w-5 h-5" />
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-semibold text-zinc-900">Admin</p>
                <p className="text-xs text-zinc-500">{tenant?.slug}</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showProfileMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowProfileMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-zinc-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-zinc-100">
                    <p className="text-sm font-semibold text-zinc-900">Admin Account</p>
                    <p className="text-xs text-zinc-500 mt-1">
                      {tenant?.branding?.name}
                    </p>
                  </div>
                  
                  <button
                    className="w-full px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 flex items-center gap-3 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  
                  <div className="border-t border-zinc-100 my-1" />
                  
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
