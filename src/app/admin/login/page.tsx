'use client';

import { useState, useEffect } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, ArrowLeft } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);
  const router = useRouter();

  // Check for existing lockout on component mount
  useEffect(() => {
    const lockoutEnd = localStorage.getItem('adminLockoutEnd');
    if (lockoutEnd) {
      const remaining = parseInt(lockoutEnd) - Date.now();
      if (remaining > 0) {
        setIsBlocked(true);
        setBlockTimeRemaining(Math.ceil(remaining / 1000));
        startCountdown(remaining);
      } else {
        localStorage.removeItem('adminLockoutEnd');
        localStorage.removeItem('adminFailedAttempts');
      }
    }
    
    const stored = localStorage.getItem('adminFailedAttempts');
    if (stored) {
      setFailedAttempts(parseInt(stored));
    }
  }, []);

  const startCountdown = (remaining: number) => {
    const interval = setInterval(() => {
      const timeLeft = parseInt(localStorage.getItem('adminLockoutEnd') || '0') - Date.now();
      if (timeLeft <= 0) {
        setIsBlocked(false);
        setBlockTimeRemaining(0);
        setFailedAttempts(0);
        localStorage.removeItem('adminLockoutEnd');
        localStorage.removeItem('adminFailedAttempts');
        clearInterval(interval);
      } else {
        setBlockTimeRemaining(Math.ceil(timeLeft / 1000));
      }
    }, 1000);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isBlocked) {
      setMessage(`Too many failed attempts. Please wait ${blockTimeRemaining} seconds.`);
      return;
    }
    
    setIsLoading(true);
    setMessage('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        // Success - clear any failed attempts
        localStorage.removeItem('adminFailedAttempts');
        localStorage.removeItem('adminLockoutEnd');
        setFailedAttempts(0);
        router.push('/admin');
      } else {
        // Failed login
        const newFailedAttempts = failedAttempts + 1;
        setFailedAttempts(newFailedAttempts);
        localStorage.setItem('adminFailedAttempts', newFailedAttempts.toString());
        
        if (newFailedAttempts >= 3) {
          // Block for 5 minutes (300 seconds)
          const lockoutEnd = Date.now() + (5 * 60 * 1000);
          localStorage.setItem('adminLockoutEnd', lockoutEnd.toString());
          setIsBlocked(true);
          setBlockTimeRemaining(300);
          startCountdown(5 * 60 * 1000);
          setMessage('Too many failed attempts. Account locked for 5 minutes.');
        } else {
          setMessage(`Invalid credentials. ${3 - newFailedAttempts} attempts remaining.`);
        }
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-700 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Admin Login</h2>
          <p className="mt-2 text-gray-600">
            Sign in to manage Affordable Billiards
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSignIn} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                  placeholder=""
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                  placeholder="Enter admin password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || isBlocked}
              className="w-full bg-green-700 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isBlocked 
                ? `Blocked - Wait ${blockTimeRemaining}s`
                : isLoading 
                ? 'Signing in...' 
                : 'Sign In'}
            </button>
          </form>


          {/* Error/Success Message */}
          {message && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800">
              {message}
            </div>
          )}
        </div>

        {/* Back to Site */}
        <div className="text-center">
          <Link 
            href="/" 
            className="inline-flex items-center text-gray-600 hover:text-green-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Affordable Billiards
          </Link>
        </div>
      </div>
    </div>
  );
}