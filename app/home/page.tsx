// ============================================================================
// DineOS - Marketing Home Page
// ============================================================================

import Link from 'next/link';

export default function MarketingHomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-800 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Transform Your Restaurant
              <br />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                with Digital Menus
              </span>
            </h1>
            <p className="mt-6 text-xl text-purple-100 max-w-3xl mx-auto">
              DineOS is the complete multi-tenant SaaS platform for restaurants.
              Create digital menus, enable QR ordering, manage tables, and grow your business.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/home#demo"
                className="px-8 py-4 bg-white text-purple-900 font-semibold rounded-xl hover:bg-purple-50 transition-colors shadow-lg"
              >
                Request a Demo
              </Link>
              <Link
                href="/home#features"
                className="px-8 py-4 bg-purple-700/50 text-white font-semibold rounded-xl hover:bg-purple-700/70 transition-colors border border-purple-500"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Demo Tenants */}
          <div className="mt-16 text-center">
            <p className="text-purple-200 text-sm mb-4">Try our demo restaurants:</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="http://burgerhouse.dineos.localhost:3000"
                className="px-4 py-2 bg-purple-800/50 rounded-lg text-sm hover:bg-purple-700/50 transition-colors"
              >
                🍔 burgerhouse.dineos.localhost:3000
              </a>
              <a
                href="http://pizzahut.dineos.localhost:3000"
                className="px-4 py-2 bg-purple-800/50 rounded-lg text-sm hover:bg-purple-700/50 transition-colors"
              >
                🍕 pizzahut.dineos.localhost:3000
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Everything You Need
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
              A complete platform to digitize and grow your restaurant business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '📱',
                title: 'Digital QR Menus',
                description: 'Customers scan a QR code to view your menu on their phones. No app download required.',
              },
              {
                icon: '🛒',
                title: 'Online Ordering',
                description: 'Accept orders directly from the digital menu. Integrated with your kitchen display.',
              },
              {
                icon: '🏪',
                title: 'Multi-Tenant Architecture',
                description: 'Each restaurant gets their own subdomain with isolated data and branding.',
              },
              {
                icon: '📊',
                title: 'Analytics Dashboard',
                description: 'Track orders, revenue, popular items, and customer behavior in real-time.',
              },
              {
                icon: '🎨',
                title: 'Custom Branding',
                description: 'Customize colors, logos, and themes to match your restaurant brand.',
              },
              {
                icon: '🔐',
                title: 'Secure & Reliable',
                description: 'Enterprise-grade security with data isolation between tenants.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              How It Works
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
              Get started in minutes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Sign Up',
                description: 'Create your restaurant account and choose your subdomain.',
              },
              {
                step: '2',
                title: 'Add Your Menu',
                description: 'Upload your menu items, categories, and prices through the dashboard.',
              },
              {
                step: '3',
                title: 'Start Serving',
                description: 'Print QR codes for your tables and start accepting digital orders.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Simple Pricing
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
              No hidden fees. Cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Starter',
                price: 'Free',
                description: 'Perfect for small restaurants',
                features: ['1 Location', 'Digital Menu', 'QR Codes', 'Basic Analytics'],
              },
              {
                name: 'Professional',
                price: '$29/mo',
                description: 'For growing restaurants',
                features: ['3 Locations', 'Online Ordering', 'Table Management', 'Advanced Analytics', 'Custom Branding'],
                popular: true,
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                description: 'For restaurant chains',
                features: ['Unlimited Locations', 'API Access', 'Dedicated Support', 'Custom Integrations', 'SLA'],
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`p-8 rounded-2xl border-2 ${
                  plan.popular
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                {plan.popular && (
                  <span className="inline-block px-3 py-1 bg-purple-600 text-white text-xs font-semibold rounded-full mb-4">
                    Most Popular
                  </span>
                )}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-4">{plan.price}</p>
                <p className="text-gray-600 dark:text-gray-400 mt-2">{plan.description}</p>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center text-gray-600 dark:text-gray-400">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={`w-full mt-8 py-3 rounded-lg font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-24 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Ready to Transform Your Restaurant?
          </h2>
          <p className="mt-4 text-xl text-purple-100">
            Join hundreds of restaurants already using DineOS
          </p>
          <div className="mt-8">
            <Link
              href="/admin/login"
              className="inline-block px-8 py-4 bg-white text-purple-600 font-semibold rounded-xl hover:bg-purple-50 transition-colors shadow-lg"
            >
              Get Started Today
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
