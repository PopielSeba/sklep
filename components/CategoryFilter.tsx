
'use client';

import { useState, useEffect } from 'react';
import { ProductDatabase } from '../lib/database';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const [categories, setCategories] = useState([
    { id: 'wszystko', name: 'WSZYSTKO', icon: 'ri-apps-2-line', iconType: 'remix', count: 0 }
  ]);
  const [customIcons, setCustomIcons] = useState<{[key: string]: string}>({});

  // Funkcja konwertująca nazwy kategorii
  const convertCategoryName = (categoryName: string): string => {
    const categoryMap: { [key: string]: string } = {
      'Klimatyzacja': 'klimatyzacja',
      'Agregaty Prądotwórcze': 'agregaty',
      'Masety Cementowe': 'masety',
      'Narzędzia': 'narzędzia',
      'Zbiorniki': 'zbiorniki'
    };
    return categoryMap[categoryName] || categoryName.toLowerCase().replace(/\s+/g, '_');
  };

  // Funkcja licząca produkty w każdej kategorii
  const countProductsInCategories = () => {
    const products = ProductDatabase.getAllProducts();

    // Policz produkty dla każdej kategorii
    const categoryCounts: {[key: string]: number} = {};
    let totalCount = 0;

    products.forEach((product) => {
      const categoryKey = convertCategoryName(product.category);
      categoryCounts[categoryKey] = (categoryCounts[categoryKey] || 0) + 1;
      totalCount++;
    });

    return { categoryCounts, totalCount };
  };

  const updateCategories = () => {
    // Load custom icons
    setCustomIcons(ProductDatabase.getCustomIcons());

    // Policz produkty
    const { categoryCounts, totalCount } = countProductsInCategories();

    // Load categories from database
    const adminCategories = ProductDatabase.getAllCategories();
    
    // Filtruj tylko kategorie które mają produkty
    const categoriesWithProducts = adminCategories.filter((cat) => {
      const categoryKey = convertCategoryName(cat.name);
      return categoryCounts[categoryKey] > 0;
    });

    const formattedCategories = [
      { id: 'wszystko', name: 'WSZYSTKO', icon: 'ri-apps-2-line', iconType: 'remix', count: totalCount },
      ...categoriesWithProducts.map((cat) => {
        const categoryKey = convertCategoryName(cat.name);
        return {
          id: categoryKey,
          name: cat.name.toUpperCase(),
          icon: cat.icon,
          iconType: cat.iconType || 'remix',
          count: categoryCounts[categoryKey] || 0
        };
      })
    ];
    setCategories(formattedCategories);
  };

  useEffect(() => {
    updateCategories();

    const handleGlobalDataChange = () => {
      updateCategories();
    };

    window.addEventListener('globalDataChanged', handleGlobalDataChange);
    
    return () => {
      window.removeEventListener('globalDataChanged', handleGlobalDataChange);
    };
  }, []);

  const renderIcon = (iconValue: string, iconType: string) => {
    if (iconType === 'custom' && customIcons[iconValue]) {
      return (
        <img 
          src={customIcons[iconValue]} 
          alt="Custom icon" 
          className="w-6 h-6 object-contain"
        />
      );
    }
    return <i className={`${iconValue} text-2xl text-blue-600`}></i>;
  };

  return (
    <div className="mb-8">
      <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 shadow-lg">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`flex flex-col items-center p-4 rounded-lg transition-all hover:bg-blue-50 cursor-pointer ${
                selectedCategory === category.id ? 'bg-blue-100 ring-2 ring-blue-400' : 'bg-gray-50'
              }`}
            >
              <div className="w-8 h-8 flex items-center justify-center mb-2">
                {renderIcon(category.icon, category.iconType)}
              </div>
              <span className="text-xs font-medium text-center text-gray-700 leading-tight mb-1">
                {category.name}
              </span>
              <span className="text-xs text-gray-500">
                {category.count} {category.count === 1 ? 'produkt' : category.count >= 2 && category.count <= 4 ? 'produkty' : 'produktów'}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
