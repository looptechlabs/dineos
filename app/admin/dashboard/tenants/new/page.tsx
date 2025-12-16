// ============================================================================
// DineOS - Create New Tenant Page (Superadmin)
// ============================================================================

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateTenantPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [checkingSlug, setCheckingSlug] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    ownerEmail: '',
    ownerName: '',
    currency: 'NPR',
    timezone: 'Asia/Kathmandu',
    primaryColor: '#6366F1',
    secondaryColor: '#1F2937',
    accentColor: '#F59E0B',
  });

  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '')
      .substring(0, 30);
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
    setSlugAvailable(null);
  };

  const handleSlugChange = (slug: string) => {
    const sanitizedSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setFormData((prev) => ({ ...prev, slug: sanitizedSlug }));
    setSlugAvailable(null);
  };

  const checkSlugAvailability = async () => {
    if (!formData.slug || formData.slug.length < 3) {
      setError('Slug must be at least 3 characters');
      return;
    }

    setCheckingSlug(true);
    setError('');

    try {
      // TODO: Replace with actual API call
      // const response = await apiClient.superadmin.checkSlugAvailability(formData.slug);
      
      // Simulated check
      const reservedSlugs = ['www', 'app', 'api', 'admin', 'static', 'cdn'];
      const existingSlugs = ['burgerhouse', 'pizzahut', 'momohouse'];
      
      const isAvailable =
        !reservedSlugs.includes(formData.slug) &&
        !existingSlugs.includes(formData.slug);

      setSlugAvailable(isAvailable);
      
      if (!isAvailable) {
        setError('This subdomain is already taken or reserved');
      }
    } catch (err) {
      setError('Failed to check slug availability');
    } finally {
      setCheckingSlug(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (slugAvailable !== true) {
      setError('Please verify subdomain availability first');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // TODO: Replace with actual API call
      // const response = await apiClient.superadmin.createTenant({
      //   name: formData.name,
      //   slug: formData.slug,
      //   ownerEmail: formData.ownerEmail,
      //   ownerName: formData.ownerName,
      //   settings: {
      //     currency: formData.currency,
      //     timezone: formData.timezone,
      //   },
      //   branding: {
      //     primaryColor: formData.primaryColor,
      //     secondaryColor: formData.secondaryColor,
      //     accentColor: formData.accentColor,
      //   },
      // });

      // Simulated success
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Show success and redirect
      alert(`Tenant "${formData.name}" created successfully!\n\nAccess URL: ${formData.slug}.dineos.localhost:3000`);
      router.push('/admin/dashboard/tenants');
    } catch (err) {
      setError('Failed to create tenant. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRootDomain = () => 'dineos.localhost:3000';

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/dashboard/tenants"
          className="text-purple-600 hover:text-purple-700 text-sm mb-2 inline-block"
        >
          ← Back to Tenants
        </Link>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Create New Tenant
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Onboard a new restaurant to the DineOS platform
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Basic Information */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Basic Information
          </h2>

          <div className="space-y-4">
            {/* Restaurant Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Restaurant Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                placeholder="e.g., Burger House Nepal"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Subdomain/Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Subdomain (slug) *
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    required
                    minLength={3}
                    maxLength={30}
                    placeholder="burgerhouse"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                  {slugAvailable === true && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                      ✓
                    </span>
                  )}
                  {slugAvailable === false && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                      ✗
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={checkSlugAvailability}
                  disabled={checkingSlug || formData.slug.length < 3}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
                >
                  {checkingSlug ? 'Checking...' : 'Check'}
                </button>
              </div>
              {formData.slug && (
                <p className="text-sm text-gray-500 mt-1">
                  URL will be:{' '}
                  <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">
                    {formData.slug}.{getRootDomain()}
                  </code>
                </p>
              )}
            </div>

            {/* Owner Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Owner Email *
              </label>
              <input
                type="email"
                value={formData.ownerEmail}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, ownerEmail: e.target.value }))
                }
                required
                placeholder="owner@restaurant.com"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <p className="text-sm text-gray-500 mt-1">
                An invitation will be sent to this email
              </p>
            </div>

            {/* Owner Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Owner Name *
              </label>
              <input
                type="text"
                value={formData.ownerName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, ownerName: e.target.value }))
                }
                required
                placeholder="John Doe"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Settings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Currency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Currency
              </label>
              <select
                value={formData.currency}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, currency: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="NPR">NPR - Nepalese Rupee</option>
                <option value="USD">USD - US Dollar</option>
                <option value="INR">INR - Indian Rupee</option>
                <option value="EUR">EUR - Euro</option>
              </select>
            </div>

            {/* Timezone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Timezone
              </label>
              <select
                value={formData.timezone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, timezone: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="Asia/Kathmandu">Asia/Kathmandu (NPT)</option>
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York (EST)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Branding */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Branding (Optional)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Primary Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Primary Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, primaryColor: e.target.value }))
                  }
                  className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.primaryColor}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, primaryColor: e.target.value }))
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm"
                />
              </div>
            </div>

            {/* Secondary Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Secondary Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.secondaryColor}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, secondaryColor: e.target.value }))
                  }
                  className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.secondaryColor}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, secondaryColor: e.target.value }))
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm"
                />
              </div>
            </div>

            {/* Accent Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Accent Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.accentColor}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, accentColor: e.target.value }))
                  }
                  className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.accentColor}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, accentColor: e.target.value }))
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm"
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Preview:</p>
            <div className="flex gap-2">
              <div
                className="w-8 h-8 rounded"
                style={{ backgroundColor: formData.primaryColor }}
                title="Primary"
              />
              <div
                className="w-8 h-8 rounded"
                style={{ backgroundColor: formData.secondaryColor }}
                title="Secondary"
              />
              <div
                className="w-8 h-8 rounded"
                style={{ backgroundColor: formData.accentColor }}
                title="Accent"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Link
            href="/admin/dashboard/tenants"
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading || slugAvailable !== true}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating...' : 'Create Tenant'}
          </button>
        </div>
      </form>
    </div>
  );
}
