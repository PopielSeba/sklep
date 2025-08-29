'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CategoryFilter from '../components/CategoryFilter';
import ProductGrid from '../components/ProductGrid';
import { ProductDatabase, Product } from '../lib/database';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+48571294344');
  const [shopName, setShopName] = useState('Prosty Sklep');
  const [isLoading, setIsLoading] = useState(true);

  // Ładowanie danych przy starcie
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await ProductDatabase.loadData();
        setPhoneNumber(ProductDatabase.getPhoneNumber());
        setShopName(ProductDatabase.getShopName());
      } catch (error) {
        console.error('Błąd ładowania danych:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();

    // Nasłuchiwanie zmian globalnych
    const handleDataChange = async () => {
      setPhoneNumber(ProductDatabase.getPhoneNumber());
      setShopName(ProductDatabase.getShopName());
    };

    window.addEventListener('globalDataChanged', handleDataChange);
    return () => {
      window.removeEventListener('globalDataChanged', handleDataChange);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-loading-line text-2xl text-blue-600 animate-spin"></i>
          </div>
          <p className="text-gray-600">Ładowanie katalogu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-800 font-['Pacifico']">
                {shopName} by PPP :: PROGRAM
              </h1>
            </div>
            <div className="flex items-center space-x-6">
              <a
                href={`tel:${phoneNumber}`}
                className="flex items-center text-gray-600 hover:text-green-600 transition-colors"
              >
                <i className="ri-phone-line mr-2"></i>
                <span className="font-medium">{phoneNumber}</span>
              </a>
              <Link
                href="/admin"
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
              >
                <i className="ri-admin-line mr-2"></i>
                <span>Admin</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Szukaj produktów..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Category Filter - Sidebar */}
          <aside className="lg:w-64">
            <CategoryFilter
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </aside>

          {/* Product Grid - Main Content */}
          <div className="flex-1">
            <ProductGrid
              selectedCategory={selectedCategory}
              searchTerm={searchTerm}
            />
          </div>
        </div>
      </main>

      {/* Floating Phone Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href={`tel:${phoneNumber}`}
          className="w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border-2 border-white group relative"
          title={`Zadzwoń: ${phoneNumber}`}
        >
          <i className="ri-phone-fill text-lg"></i>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="bg-gray-800 text-white text-xs rounded-lg py-1 px-2 whitespace-nowrap">
              Zadzwoń: {phoneNumber}
            </div>
            <div className="w-2 h-2 bg-gray-800 rotate-45 absolute top-full right-3 -mt-1"></div>
          </div>
        </a>
      </div>

      {/* GitHub sync indicator */}
      <div className="fixed bottom-6 left-6 z-40">
        <div className="bg-white rounded-lg shadow-lg px-3 py-2 flex items-center space-x-2 text-xs text-gray-500">
          <i className="ri-github-line"></i>
          <span>Sync z GitHub</span>
        </div>
      </div>
    </div>
  );
}