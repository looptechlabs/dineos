// ============================================================================
// DineOS - Dashboard Sidebar Component
// ============================================================================
// Navigation sidebar for tenant dashboard
// ============================================================================

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  MenuSquare, 
  ShoppingBag,
  QrCode,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useTenant } from '@/context/TenantContext';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { tenant } = useTenant();

  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      label: 'Menus',
      href: '/dashboard/menus',
      icon: <MenuSquare className="w-5 h-5" />,
    },
    {
      label: 'Orders',
      href: '/dashboard/orders',
      icon: <ShoppingBag className="w-5 h-5" />,
    },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname?.startsWith(href);
  };

  return (
    <div 
      className={`fixed left-0 top-0 h-screen bg-zinc-900 border-r border-zinc-800 transition-all duration-300 flex flex-col z-40 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo Section */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-zinc-800">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: tenant?.branding?.primaryColor || '#6366F1' }}
            >
              <QrCode className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-semibold text-sm">
                {tenant?.branding?.name || 'DineOS'}
              </span>
              <span className="text-zinc-500 text-xs">Admin Panel</span>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white mx-auto"
            style={{ backgroundColor: tenant?.branding?.primaryColor || '#6366F1' }}
          >
            <QrCode className="w-6 h-6" />
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                active
                  ? 'bg-white/10 text-white'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <span className={active ? 'text-white' : 'text-zinc-400 group-hover:text-white'}>
                {item.icon}
              </span>
              {!isCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}
              {active && !isCollapsed && (
                <div 
                  className="ml-auto w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: tenant?.branding?.primaryColor || '#6366F1' }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Toggle Button */}
      <div className="p-4 border-t border-zinc-800">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">Collapse</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
