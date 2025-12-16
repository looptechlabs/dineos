// ============================================================================
// DineOS - Tenant Not Found Page
// ============================================================================

export default function TenantNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md">
        <div className="text-6xl mb-4">🍽️</div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Restaurant Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          We couldn&apos;t find the restaurant you&apos;re looking for. 
          The restaurant may have moved or doesn&apos;t exist.
        </p>
        <a
          href="http://dineos.localhost:3000"
          className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
        >
          Go to DineOS Home
        </a>
      </div>
    </div>
  );
}
