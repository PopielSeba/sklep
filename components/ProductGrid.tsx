
'use client';

import { useState, useEffect } from 'react';
import { ProductDatabase } from '../lib/database';

interface ProductGridProps {
  selectedCategory: string;
}

interface Product {
  id: number;
  name: string;
  model: string;
  category: string;
  price: string;
  image: string;
  available: boolean;
  images?: string[];
  description?: string;
  stock?: number;
}

export default function ProductGrid({ selectedCategory }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('+48571294344');

  // Funkcja konwertująca kategorie
  const convertCategoryName = (categoryName: string): string => {
    const categoryMap: { [key: string]: string } = {
      'Klimatyzacja': 'klimatyzacja',
      'Agregaty Prądotwórcze': 'agregaty',
      'Masety Cementowe': 'masety',
      'Narzędzia': 'narzędzia',
      'Zbiorniki': 'zbiorniki'
    };
    return categoryMap[categoryName] || categoryName.toLowerCase().replace(/\\s+/g, '_');
  };

  const loadData = () => {
    // Załaduj numer telefonu z globalnej bazy
    setPhoneNumber(ProductDatabase.getPhoneNumber());

    // Załaduj produkty z globalnej bazy
    const dbProducts = ProductDatabase.getAllProducts();
    
    // Konwertuj produkty na format używany w siatce
    const convertedProducts = dbProducts.map((product) => ({
      id: product.id,
      name: product.name,
      model: `Model: ${product.model}`,
      category: convertCategoryName(product.category),
      price: `${product.price.toLocaleString()} PLN`,
      image: (product.images && product.images.length > 0) ? product.images[0] : '/api/placeholder/400/300',
      available: product.status === 'active',
      images: product.images || [],
      description: product.description || 'Brak opisu produktu',
      stock: product.stock || 0
    }));
    
    setProducts(convertedProducts);
  };

  useEffect(() => {
    loadData();

    // Nasłuchuj zmian w globalnej bazie danych
    const handleGlobalDataChange = () => {
      loadData();
    };

    window.addEventListener('globalDataChanged', handleGlobalDataChange);
    
    return () => {
      window.removeEventListener('globalDataChanged', handleGlobalDataChange);
    };
  }, []);

  const filteredProducts = selectedCategory === 'wszystko' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const openProductDetail = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeProductDetail = () => {
    setSelectedProduct(null);
  };

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg p-8 shadow-lg">
          <i className="ri-inbox-line text-6xl text-gray-300 mb-4"></i>
          <p className="text-gray-500 text-lg">Brak produktów w wybranej kategorii</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div 
            key={product.id} 
            className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => openProductDetail(product)}
          >
            <div className="aspect-video overflow-hidden">
              <img 
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-2">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{product.model}</p>
              <p className="text-sm font-medium text-blue-600 mb-3">Kategoria: {product.category}</p>
              {product.stock !== undefined && (
                <p className="text-xs text-gray-500 mb-3">Dostępność: {product.stock} szt.</p>
              )}
              <div className="text-center">
                <button className="w-full bg-blue-500 text-white py-3 rounded-lg whitespace-nowrap cursor-default font-semibold text-lg">
                  {product.price}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Popup z detalami produktu */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header popup */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">{selectedProduct.name}</h2>
              <button
                onClick={closeProductDetail}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Galeria zdjęć */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Galeria zdjęć</h3>
                  {selectedProduct.images && selectedProduct.images.length > 0 ? (
                    <div className="space-y-4">
                      {/* Główne zdjęcie */}
                      <div className="aspect-video overflow-hidden rounded-lg border">
                        <img 
                          src={selectedProduct.images[0]}
                          alt={`${selectedProduct.name} - główne zdjęcie`}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      
                      {/* Miniaturki pozostałych zdjęć */}
                      {selectedProduct.images.length > 1 && (
                        <div className="grid grid-cols-3 gap-2">
                          {selectedProduct.images.slice(1, 4).map((image, index) => (
                            <div key={index + 1} className="aspect-square overflow-hidden rounded-lg border">
                              <img 
                                src={image}
                                alt={`${selectedProduct.name} - zdjęcie ${index + 2}`}
                                className="w-full h-full object-cover object-top"
                              />
                            </div>
                          ))}
                          {selectedProduct.images.length > 4 && (
                            <div className="aspect-square bg-gray-100 rounded-lg border flex items-center justify-center">
                              <span className="text-gray-600 font-medium">
                                +{selectedProduct.images.length - 4}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="aspect-video bg-gray-100 rounded-lg border flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <i className="ri-image-line text-4xl mb-2"></i>
                        <p>Brak zdjęć</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Informacje o produkcie */}
                <div>
                  <div className="space-y-6">
                    {/* Podstawowe informacje */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-gray-800">Informacje podstawowe</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Model:</span>
                          <span className="font-medium">{selectedProduct.model.replace('Model: ', '')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Kategoria:</span>
                          <span className="font-medium capitalize">{selectedProduct.category.replace('_', ' ')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Cena:</span>
                          <span className="font-bold text-lg text-blue-600">{selectedProduct.price}</span>
                        </div>
                        {selectedProduct.stock !== undefined && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Dostępność:</span>
                            <span className={`font-medium ${selectedProduct.stock > 10 ? 'text-green-600' : selectedProduct.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                              {selectedProduct.stock} szt.
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${selectedProduct.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {selectedProduct.available ? 'Dostępny' : 'Niedostępny'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Opis */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-gray-800">Opis produktu</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700 leading-relaxed">
                          {selectedProduct.description || 'Brak opisu produktu'}
                        </p>
                      </div>
                    </div>

                    {/* Kontakt */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-gray-800">Kontakt</h3>
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center text-green-700">
                          <i className="ri-phone-line text-xl mr-3"></i>
                          <div>
                            <p className="font-medium">Zadzwoń, aby uzyskać więcej informacji</p>
                            <p className="text-lg font-bold">{phoneNumber}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
