// ============================================================================
// DineOS - Superadmin Login Page
// ============================================================================
// Access: dineos.localhost:3000/admin/login
// ============================================================================

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginPage from '@/app/components/tenant/login/LoginPage';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // TODO: Replace with actual API call
      // const response = await apiClient.auth.superadminLogin({ email, password });
      
      // Simulated login for development
      if (email === 'admin@dineos.com' && password === 'admin123') {
        // Store token in localStorage/cookie (use httpOnly cookies in production)
        localStorage.setItem('adminToken', 'mock-admin-token');
        router.push('/admin/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginPage/>
  );
}
