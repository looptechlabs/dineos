// ============================================================================
// DineOS - Tenants List Page (Superadmin)
// ============================================================================

'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Tenant, TenantStatus } from '@/lib/types';

// Mock data for development
const mockTenants: Tenant[] = [
  {
    id: '1',
    slug: 'burgerhouse',
    name: 'Burger House Nepal',
    ownerEmail: 'owner@burgerhouse.com',
    status: 'active',
    settings: {
      currency: 'NPR',
      timezone: 'Asia/Kathmandu',
      language: 'en',
      orderingEnabled: true,
      reservationsEnabled: true,
      deliveryEnabled: false,
      taxRate: 13,
    },
    branding: {
      primaryColor: '#FF6B00',
      secondaryColor: '#1A1A1A',
      accentColor: '#FFD700',
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
  },
  {
    id: '2',
    slug: 'pizzahut',
    name: 'Pizza Hut Nepal',
    ownerEmail: 'manager@pizzahut.np',
    status: 'active',
    settings: {
      currency: 'NPR',
      timezone: 'Asia/Kathmandu',
      language: 'en',
      orderingEnabled: true,
      reservationsEnabled: true,
      deliveryEnabled: true,
      taxRate: 13,
    },
    branding: {
      primaryColor: '#E31837',
      secondaryColor: '#006341',
      accentColor: '#FFD700',
    },
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-22T11:45:00Z',
  },
  {
    id: '3',
    slug: 'momohouse',
    name: 'Momo House',
    ownerEmail: 'info@momohouse.np',
    status: 'pending',
    settings: {
      currency: 'NPR',
      timezone: 'Asia/Kathmandu',
      language: 'ne',
      orderingEnabled: false,
      reservationsEnabled: false,
      deliveryEnabled: false,
      taxRate: 13,
    },
    branding: {
      primaryColor: '#2E7D32',
      secondaryColor: '#FFFFFF',
      accentColor: '#FF5722',
    },
    createdAt: '2024-01-25T14:00:00Z',
    updatedAt: '2024-01-25T14:00:00Z',
  },
];

const statusColors: Record<TenantStatus, string> = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-700',
  suspended: 'bg-red-100 text-red-700',
  pending: 'bg-yellow-100 text-yellow-700',
};

export default function TenantsListPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TenantStatus | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    // const response = await apiClient.superadmin.listTenants({ status: statusFilter });
    setTimeout(() => {
      setTenants(mockTenants);
      setIsLoading(false);
    }, 500);
  }, []);

  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch =
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || tenant.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getRootDomain = () => {
    if (typeof window !== 'undefined') {
      // Extract root domain from current location
      return 'dineos.localhost:3000';
    }
    return 'dineos.localhost:3000';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Tenants
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage all restaurant tenants on the platform
          </p>
        </div>
        <Link
          href="/admin/dashboard/tenants/new"
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
        >
          + Create Tenant
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, slug, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TenantStatus | 'all')}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Tenants Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading tenants...</p>
          </div>
        ) : filteredTenants.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No tenants found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr className="text-left text-gray-500 dark:text-gray-400 text-sm">
                  <th className="px-6 py-4 font-medium">Restaurant</th>
                  <th className="px-6 py-4 font-medium">Subdomain URL</th>
                  <th className="px-6 py-4 font-medium">Owner Email</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Created</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredTenants.map((tenant) => (
                  <tr key={tenant.id} className="text-gray-800 dark:text-gray-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold mr-3"
                          style={{ backgroundColor: tenant.branding.primaryColor }}
                        >
                          {tenant.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{tenant.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {tenant.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={`http://${tenant.slug}.${getRootDomain()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-700 hover:underline"
                      >
                        <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          {tenant.slug}.{getRootDomain()}
                        </code>
                      </a>
                    </td>
                    <td className="px-6 py-4 text-sm">{tenant.ownerEmail}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          statusColors[tenant.status]
                        }`}
                      >
                        {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(tenant.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/admin/dashboard/tenants/${tenant.id}`}
                          className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/dashboard/tenants/${tenant.id}/edit`}
                          className="px-3 py-1 text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 rounded-lg transition-colors"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
          💡 Local Development Access
        </h3>
        <p className="text-sm text-blue-700 dark:text-blue-400">
          To access tenant subdomains locally, each subdomain URL (e.g.,{' '}
          <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">
            burgerhouse.dineos.localhost:3000
          </code>
          ) should resolve to your local machine. Modern browsers handle{' '}
          <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">*.localhost</code>{' '}
          automatically. See the README for alternative setups using hosts file or localtest.me.
        </p>
      </div>
    </div>
  );
}
