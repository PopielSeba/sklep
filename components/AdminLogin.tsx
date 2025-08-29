'use client';

import { useState } from 'react';
import Link from 'next/link';

interface AdminLoginProps {
  onLogin: (password: string) => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Back button */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-gray-300 hover:text-white transition-colors">
            <i className="ri-arrow-left-line mr-2"></i>
            Powrót do katalogu
          </Link>
        </div>

        {/* Login form */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-admin-line text-2xl text-blue-600"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Panel Administratora</h1>
            <p className="text-gray-600">Wprowadź hasło aby kontynuować</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hasło
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Wprowadź hasło"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
            >
              Zaloguj się
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Dostęp tylko dla autoryzowanych użytkowników
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}