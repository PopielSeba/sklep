
'use client';

import { useState, useEffect } from 'react';
import AdminLogin from '../../components/AdminLogin';
import AdminDashboard from '../../components/AdminDashboard';
import { ProductDatabase } from '../../lib/database';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Sprawdź zapamiętane logowanie przy ładowaniu strony
  useEffect(() => {
    const savedAuth = localStorage.getItem('adminAuthenticated');
    const authTimestamp = localStorage.getItem('adminAuthTimestamp');
    
    if (savedAuth === 'true' && authTimestamp) {
      const currentTime = Date.now();
      const authTime = parseInt(authTimestamp);
      
      // Sprawdź czy sesja nie wygasła (24 godziny)
      if (currentTime - authTime < 24 * 60 * 60 * 1000) {
        setIsAuthenticated(true);
      } else {
        // Wyczyść wygasłą sesję
        localStorage.removeItem('adminAuthenticated');
        localStorage.removeItem('adminAuthTimestamp');
      }
    }
    
    setIsLoading(false);
  }, []);

  const handleLogin = (password: string) => {
    if (ProductDatabase.verifyAdminPassword(password)) {
      setIsAuthenticated(true);
      
      // Zapisz stan logowania w localStorage
      localStorage.setItem('adminAuthenticated', 'true');
      localStorage.setItem('adminAuthTimestamp', Date.now().toString());
    } else {
      alert('Nieprawidłowy kod dostępu!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    
    // Usuń stan logowania z localStorage
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminAuthTimestamp');
  };

  // Pokaż spinner ładowania podczas sprawdzania sesji
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-admin-line text-2xl text-blue-600 animate-pulse"></i>
          </div>
          <p className="text-gray-600">Sprawdzanie uprawnień...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <AdminDashboard onLogout={handleLogout} /> : <AdminLogin onLogin={handleLogin} />;
}
