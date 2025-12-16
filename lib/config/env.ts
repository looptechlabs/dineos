// ============================================================================
// DineOS - Environment Configuration
// ============================================================================

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key] ?? defaultValue;
  if (value === undefined) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const env = {
  // API Configuration
  API_BASE_URL: getEnvVar('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:8080/api'),
  
  // Domain Configuration
  ROOT_DOMAIN: getEnvVar('NEXT_PUBLIC_ROOT_DOMAIN', 'dineos.localhost:3000'),
  
  // App URLs (for reference)
  get APP_URL() {
    return `http://app.${this.ROOT_DOMAIN}`;
  },
  get MARKETING_URL() {
    return `http://www.${this.ROOT_DOMAIN}`;
  },
  get ADMIN_URL() {
    return `http://${this.ROOT_DOMAIN}/admin`;
  },
  
  // Feature Flags
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  
  // Reserved Subdomains (not available for tenants)
  RESERVED_SUBDOMAINS: ['www', 'app', 'api', 'admin', 'static', 'assets', 'cdn', 'mail'],
} as const;

export type Env = typeof env;
