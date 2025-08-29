'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProductDatabase, Product, Category } from '../lib/database';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('products');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPhone, setIsChangingPhone] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  const [isChangingShopName, setIsChangingShopName] = useState(false);
  const [newShopName, setNewShopName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Ładowanie danych przy starcie
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await ProductDatabase.loadData();
      } catch (error) {
        console.error('Błąd ładowania danych:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handleChangePassword = async () => {
    if (!newPassword.trim()) {
      alert('Proszę wprowadzić nowy kod dostępu');
      return;
    }
    if (newPassword.length < 6) {
      alert('Kod dostępu musi mieć minimum 6 znaków');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('Kody dostępu nie są identyczne');
      return;
    }

    try {
      await ProductDatabase.setAdminPassword(newPassword);
      
      setNewPassword('');
      setConfirmPassword('');
      setIsChangingPassword(false);
      
      alert('Kod dostępu został pomyślnie zmieniony!');
    } catch (error) {
      alert('Błąd podczas zmiany kodu dostępu');
    }
  };

  const handleChangePhone = async () => {
    if (!newPhone.trim()) {
      alert('Proszę wprowadzić numer telefonu');
      return;
    }
    if (newPhone.length < 9) {
      alert('Numer telefonu jest za krótki');
      return;
    }

    try {
      await ProductDatabase.setPhoneNumber(newPhone);
      setNewPhone('');
      setIsChangingPhone(false);
      
      alert('Numer telefonu został pomyślnie zmieniony!');
    } catch (error) {
      alert('Błąd podczas zmiany numeru telefonu');
    }
  };

  const handleChangeShopName = async () => {
    if (!newShopName.trim()) {
      alert('Proszę wprowadzić nazwę sklepu');
      return;
    }
    if (newShopName.length < 2) {
      alert('Nazwa sklepu jest za krótka');
      return;
    }

    try {
      await ProductDatabase.setShopName(newShopName);
      setNewShopName('');
      setIsChangingShopName(false);
      
      alert('Nazwa sklepu została pomyślnie zmieniona!');
    } catch (error) {
      alert('Błąd podczas zmiany nazwy sklepu');
    }
  };

  const handleRefreshData = async () => {
    setIsLoading(true);
    try {
      await ProductDatabase.loadData();
      alert('Dane odświeżone z GitHub!');
    } catch (error) {
      alert('Błąd odświeżania danych');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isChangingPhone) {
      setNewPhone(ProductDatabase.getPhoneNumber());
    }
    if (isChangingShopName) {
      setNewShopName(ProductDatabase.getShopName());
    }
  }, [isChangingPhone, isChangingShopName]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-loading-line text-2xl text-blue-600 animate-spin"></i>
          </div>
          <p className="text-gray-600">Ładowanie danych z GitHub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/" className="flex items-center text-gray-600 hover:text-gray-800 mr-8">
                <i className="ri-arrow-left-line mr-2"></i>
                Powrót do strony głównej
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">Panel Administratora</h1>
              <div className="ml-4 flex items-center text-sm text-gray-500">
                <i className="ri-github-line mr-1"></i>
                Synchronizacja z GitHub
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefreshData}
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
                title="Odśwież dane z GitHub"
              >
                <i className="ri-refresh-line mr-2"></i>
                Odśwież dane
              </button>
              <button
                onClick={() => setIsChangingShopName(true)}
                className="flex items-center text-gray-600 hover:text-purple-600 transition-colors cursor-pointer"
              >
                <i className="ri-store-line mr-2"></i>
                Zmień nazwę sklepu
              </button>
              <button
                onClick={() => setIsChangingPhone(true)}
                className="flex items-center text-gray-600 hover:text-green-600 transition-colors cursor-pointer"
              >
                <i className="ri-phone-line mr-2"></i>
                Zmień numer telefonu
              </button>
              <button
                onClick={() => setIsChangingPassword(true)}
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                <i className="ri-lock-line mr-2"></i>
                Zmień kod dostępu
              </button>
              <button
                onClick={onLogout}
                className="flex items-center text-gray-600 hover:text-red-600 transition-colors cursor-pointer"
              >
                <i className="ri-logout-box-line mr-2"></i>
                Wyloguj się
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white rounded-lg shadow-sm border p-1">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'products'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <i className="ri-shopping-bag-line mr-2"></i>
              Produkty
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'categories'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <i className="ri-apps-2-line mr-2"></i>
              Kategorie
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {activeTab === 'products' && <ProductsManager />}
        {activeTab === 'categories' && <CategoriesManager />}
      </div>

      {/* Change Shop Name Modal */}
      {isChangingShopName && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Zmiana nazwy sklepu</h3>
                <button
                  onClick={() => {
                    setIsChangingShopName(false);
                    setNewShopName('');
                  }}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nazwa sklepu
                  </label>
                  <input
                    type="text"
                    value={newShopName}
                    onChange={(e) => setNewShopName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Wprowadź nazwę sklepu"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Nazwa będzie wyświetlana w nagłówku strony jako: "{newShopName || 'Nazwa'} by PPP :: PROGRAM"
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setIsChangingShopName(false);
                    setNewShopName('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Anuluj
                </button>
                <button
                  onClick={handleChangeShopName}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Zmień nazwę
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Phone Modal */}
      {isChangingPhone && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Zmiana numeru telefonu</h3>
                <button
                  onClick={() => {
                    setIsChangingPhone(false);
                    setNewPhone('');
                  }}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numer telefonu
                  </label>
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Wprowadź numer telefonu"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Numer będzie wyświetlany na stronie głównej i w szczegółach produktów
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setIsChangingPhone(false);
                    setNewPhone('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Anuluj
                </button>
                <button
                  onClick={handleChangePhone}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Zmień numer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isChangingPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Zmiana kodu dostępu</h3>
                <button
                  onClick={() => {
                    setIsChangingPassword(false);
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nowy kod dostępu
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Wprowadź nowy kod dostępu"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Potwierdź kod dostępu
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Potwierdź kod dostępu"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setIsChangingPassword(false);
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Anuluj
                </button>
                <button
                  onClick={handleChangePassword}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Zmień kod
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Products Manager                              */
/* -------------------------------------------------------------------------- */

function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    stock: 0,
    model: '',
    description: '',
    price: 0,
    images: [] as string[]
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');

  // Ładowanie danych z bazy
  const loadData = () => {
    setProducts(ProductDatabase.getAllProducts());
    setCategories(ProductDatabase.getAllCategories());
  };

  useEffect(() => {
    loadData();

    const handleDataChange = () => {
      loadData();
    };

    window.addEventListener('globalDataChanged', handleDataChange);
    return () => {
      window.removeEventListener('globalDataChanged', handleDataChange);
    };
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const result = ev.target?.result as string;
          if (isEdit && editingProduct) {
            if (editingProduct.images.length < 4) {
              setEditingProduct((prev) => ({ ...prev!, images: [...prev!.images, result] }));
            }
          } else {
            if (newProduct.images.length < 4) {
              setNewProduct((prev) => ({ ...prev, images: [...prev.images, result] }));
            }
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index: number, isEdit = false) => {
    if (isEdit && editingProduct) {
      const imgs = [...editingProduct.images];
      imgs.splice(index, 1);
      setEditingProduct({ ...editingProduct, images: imgs });
    } else {
      const imgs = [...newProduct.images];
      imgs.splice(index, 1);
      setNewProduct({ ...newProduct, images: imgs });
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.model.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;

    const matchesStock =
      stockFilter === 'all' ||
      (stockFilter === 'high' && product.stock > 15) ||
      (stockFilter === 'medium' && product.stock >= 5 && product.stock <= 15) ||
      (stockFilter === 'low' && product.stock < 5);

    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleAddProduct = () => {
    if (!newProduct.name.trim()) {
      alert('Proszę wprowadzić nazwę produktu');
      return;
    }
    if (!newProduct.category) {
      alert('Proszę wybrać kategorię produktu');
      return;
    }
    if (newProduct.stock <= 0) {
      alert('Proszę wprowadzić poprawną dostępność produktu (większą niż 0)');
      return;
    }
    if (newProduct.price <= 0) {
      alert('Proszę wprowadzić poprawną cenę produktu (większą niż 0)');
      return;
    }

    ProductDatabase.addProduct({
      name: newProduct.name.trim(),
      category: newProduct.category,
      stock: newProduct.stock,
      status: 'active',
      model: newProduct.model.trim() || 'Brak modelu',
      price: newProduct.price,
      images: newProduct.images,
      description: newProduct.description.trim()
    });

    setNewProduct({ name: '', category: '', stock: 0, model: '', description: '', price: 0, images: [] });
    setIsAddingProduct(false);
    alert('Produkt został pomyślnie dodany!');
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
  };

  const handleUpdateProduct = () => {
    if (!editingProduct) return;
    
    if (!editingProduct.name.trim()) {
      alert('Proszę wprowadzić nazwę produktu');
      return;
    }
    if (!editingProduct.category) {
      alert('Proszę wybrać kategorię produktu');
      return;
    }
    if (editingProduct.stock <= 0) {
      alert('Proszę wprowadzić poprawną dostępność produktu (większą niż 0)');
      return;
    }
    if (editingProduct.price <= 0) {
      alert('Proszę wprowadzić poprawną cenę produktu (większą niż 0)');
      return;
    }

    ProductDatabase.updateProduct(editingProduct.id, {
      name: editingProduct.name.trim(),
      category: editingProduct.category,
      model: editingProduct.model.trim() || 'Brak modelu',
      stock: editingProduct.stock,
      price: editingProduct.price,
      images: editingProduct.images,
      description: editingProduct.description?.trim() || ''
    });

    setEditingProduct(null);
    alert('Produkt został zaktualizowany!');
  };

  const handleCopyProduct = (product: Product) => {
    ProductDatabase.copyProduct(product.id);
    alert('Produkt został skopiowany!');
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm('Czy na pewno chcesz usunąć ten produkt?')) {
      ProductDatabase.deleteProduct(id);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setStockFilter('all');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Produkty</h2>
          <p className="text-sm text-gray-600 mt-1">Zarządzaj produktami dostępnymi w katalogu - wszyscy użytkownicy widzą te same dane</p>
        </div>
        <button
          onClick={() => setIsAddingProduct(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer flex items-center"
        >
          <i className="ri-add-line mr-2"></i>
          Dodaj Produkt
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Wyszukaj produkty</label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Szukaj po nazwie lub modelu..."
              />
              <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kategoria</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
            >
              <option value="all">Wszystkie kategorie</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Stan magazynowy</label>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
            >
              <option value="all">Wszystkie</option>
              <option value="high">Wysoki (&gt;15 szt.)</option>
              <option value="medium">Średni (5-15 szt.)</option>
              <option value="low">Niski (&lt;5 szt.)</option>
            </select>
          </div>
        </div>

        {/* Filter Icons and Clear */}
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex flex-wrap items-center space-x-4 mb-2 lg:mb-0">
            <span className="text-sm text-gray-600">Szybkie filtry:</span>

            {/* Category Icons */}
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-10 h-10 flex items-center justify-center rounded-lg border-2 transition-all cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
                title="Wszystkie"
              >
                <i className="ri-apps-2-line"></i>
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg border-2 transition-all cursor-pointer ${
                    selectedCategory === cat.name
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                  title={cat.name}
                >
                  <i className={cat.icon}></i>
                </button>
              ))}
            </div>

            {/* Stock Level Icons */}
            <div className="flex space-x-2 ml-4">
              <button
                onClick={() => setStockFilter('high')}
                className={`w-10 h-10 flex items-center justify-center rounded-lg border-2 transition-all cursor-pointer ${
                  stockFilter === 'high'
                    ? 'border-green-500 bg-green-50 text-green-600'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
                title="Wysoki stan (&gt;15 szt.)"
              >
                <i className="ri-checkbox-circle-line"></i>
              </button>

              <button
                onClick={() => setStockFilter('medium')}
                className={`w-10 h-10 flex items-center justify-center rounded-lg border-2 transition-all cursor-pointer ${
                  stockFilter === 'medium'
                    ? 'border-yellow-500 bg-yellow-50 text-yellow-600'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
                title="Średni stan (5-15 szt.)"
              >
                <i className="ri-error-warning-line"></i>
              </button>

              <button
                onClick={() => setStockFilter('low')}
                className={`w-10 h-10 flex items-center justify-center rounded-lg border-2 transition-all cursor-pointer ${
                  stockFilter === 'low'
                    ? 'border-red-500 bg-red-50 text-red-600'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
                title="Niski stan (&lt;5 szt.)"
              >
                <i className="ri-close-circle-line"></i>
              </button>
            </div>
          </div>

          {/* Clear Filters */}
          {(searchTerm || selectedCategory !== 'all' || stockFilter !== 'all') && (
            <button
              onClick={clearFilters}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
            >
              <i className="ri-close-line mr-1"></i>
              Wyczyść filtry
            </button>
          )}
        </div>

        {/* Results count */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Znaleziono {filteredProducts.length} z {products.length} produktów
          </p>
        </div>
      </div>

      {/* Add product form */}
      {isAddingProduct && (
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <h3 className="text-lg font-medium mb-4">Nowy Produkt</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nazwa produktu</label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Wprowadź nazwę produktu"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategoria</label>
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
              >
                <option value="">Wybierz kategorię</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
              <input
                type="text"
                value={newProduct.model}
                onChange={(e) => setNewProduct({ ...newProduct, model: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Model produktu"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dostępność (szt.)</label>
              <input
                type="number"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cena (PLN)</label>
              <input
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Images Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zdjęcia produktu ({newProduct.images.length}/4)
            </label>
            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleImageUpload(e)}
                disabled={newProduct.images.length >= 4}
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer disabled:opacity-50"
              />
              <p className="text-xs text-gray-500 mt-2">
                Obsługiwane formaty: JPG, PNG, GIF. Maksymalnie 4 zdjęcia.
              </p>
            </div>

            {/* Images Preview */}
            {newProduct.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                {newProduct.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img src={image} alt={`Zdjęcie ${index + 1}`} className="w-full h-24 object-cover rounded-lg border" />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                    >
                      <i className="ri-close-line"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Opis</label>
            <textarea
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Opisz produkt..."
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setIsAddingProduct(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer"
            >
              Anuluj
            </button>
            <button
              onClick={handleAddProduct}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
            >
              Dodaj Produkt
            </button>
          </div>
        </div>
      )}

      {/* Edit product form */}
      {editingProduct && (
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <h3 className="text-lg font-medium mb-4">Edytuj Produkt</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nazwa produktu</label>
              <input
                type="text"
                value={editingProduct.name}
                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Wprowadź nazwę produktu"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategoria</label>
              <select
                value={editingProduct.category}
                onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
              >
                <option value="">Wybierz kategorię</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
              <input
                type="text"
                value={editingProduct.model}
                onChange={(e) => setEditingProduct({ ...editingProduct, model: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Model produktu"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dostępność (szt.)</label>
              <input
                type="number"
                value={editingProduct.stock}
                onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cena (PLN)</label>
              <input
                type="number"
                value={editingProduct.price}
                onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Images Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zdjęcia produktu ({editingProduct.images.length}/4)
            </label>
            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleImageUpload(e, true)}
                disabled={editingProduct.images.length >= 4}
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer disabled:opacity-50"
              />
              <p className="text-xs text-gray-500 mt-2">
                Obsługiwane formaty: JPG, PNG, GIF. Maksymalnie 4 zdjęcia.
              </p>
            </div>

            {/* Images Preview */}
            {editingProduct.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                {editingProduct.images.map((image: string, index: number) => (
                  <div key={index} className="relative group">
                    <img src={image} alt={`Zdjęcie ${index + 1}`} className="w-full h-24 object-cover rounded-lg border" />
                    <button
                      onClick={() => removeImage(index, true)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                    >
                      <i className="ri-close-line"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Opis</label>
            <textarea
              value={editingProduct.description || ''}
              onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Opisz produkt..."
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setEditingProduct(null)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer"
            >
              Anuluj
            </button>
            <button
              onClick={handleUpdateProduct}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
            >
              Zaktualizuj
            </button>
          </div>
        </div>
      )}

      {/* Products table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <i className="ri-inbox-line text-6xl text-gray-300 mb-4"></i>
            <p className="text-gray-500 text-lg mb-2">Brak produktów</p>
            <p className="text-gray-400">
              {searchTerm || selectedCategory !== 'all' || stockFilter !== 'all'
                ? 'Spróbuj zmienić filtry wyszukiwania'
                : 'Dodaj pierwszy produkt do katalogu'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produkt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cena
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stan magazynowy
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Zdjęcia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Akcje
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">Model: {product.model}</div>
                      <div className="text-xs text-gray-400">Aktualizacja: {product.lastUpdated}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="font-semibold text-green-600">{product.price} PLN</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.stock > 15
                            ? 'bg-green-100 text-green-800'
                            : product.stock >= 5
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.stock} szt.
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-1">
                        {product.images.slice(0, 3).map((img, idx) => (
                          <img key={idx} src={img} alt={`${product.name} ${idx + 1}`} className="w-8 h-8 object-cover rounded border" />
                        ))}
                        {product.images.length > 3 && (
                          <div className="w-8 h-8 bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-600">
                            +{product.images.length - 3}
                          </div>
                        )}
                        {product.images.length === 0 && (
                          <div className="w-8 h-8 bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-400">
                            <i className="ri-image-line"></i>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEditProduct(product)}
                          className="w-8 h-8 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded cursor-pointer"
                          title="Edytuj"
                        >
                          <i className="ri-edit-line"></i>
                        </button>
                        <button 
                          onClick={() => handleCopyProduct(product)}
                          className="w-8 h-8 flex items-center justify-center text-green-600 hover:bg-green-50 rounded cursor-pointer"
                          title="Kopiuj"
                        >
                          <i className="ri-file-copy-line"></i>
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="w-8 h-8 flex items-center justify-center text-red-600 hover:bg-red-50 rounded cursor-pointer"
                          title="Usuń"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                             Categories Manager                             */
/* -------------------------------------------------------------------------- */

function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    icon: 'ri-apps-2-line',
    iconType: 'remix'
  });
  const [customIcons, setCustomIcons] = useState<{[key: string]: string}>({});

  const popularIcons = [
    'ri-apps-2-line',
    'ri-flashlight-line',
    'ri-hammer-line',
    'ri-snowflake-line',
    'ri-car-line',
    'ri-tools-line',
    'ri-building-line',
    'ri-home-line',
    'ri-settings-line',
    'ri-computer-line',
    'ri-phone-line',
    'ri-camera-line',
    'ri-music-line',
    'ri-book-line',
    'ri-shirt-line',
    'ri-heart-line',
    'ri-star-line',
    'ri-fire-line',
    'ri-plant-line',
    'ri-gift-line',
    'ri-trophy-line',
    'ri-rocket-line',
    'ri-map-pin-line',
    'ri-recycle-line',
    'ri-lightbulb-line'
  ];

  const loadData = () => {
    setCategories(ProductDatabase.getAllCategories());
    setCustomIcons(ProductDatabase.getCustomIcons());
  };

  useEffect(() => {
    loadData();

    const handleDataChange = () => {
      loadData();
    };

    window.addEventListener('globalDataChanged', handleDataChange);
    return () => {
      window.removeEventListener('globalDataChanged', handleDataChange);
    };
  }, []);

  const handleCustomIconUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        const iconId = `custom_${Date.now()}`;
        ProductDatabase.addCustomIcon(iconId, result);
        
        if (isEdit && editingCategory) {
          setEditingCategory({
            ...editingCategory,
            icon: iconId,
            iconType: 'custom'
          });
        } else {
          setNewCategory({
            ...newCategory,
            icon: iconId,
            iconType: 'custom'
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const renderIcon = (iconValue: string, iconType: string, size = 'w-6 h-6') => {
    if (iconType === 'custom' && customIcons[iconValue]) {
      return (
        <img 
          src={customIcons[iconValue]} 
          alt="Custom icon" 
          className={`${size} object-contain`}
        />
      );
    }
    return <i className={`${iconValue} text-2xl`}></i>;
  };

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) {
      alert('Proszę wprowadzić nazwę kategorii');
      return;
    }

    ProductDatabase.addCategory({
      name: newCategory.name.trim(),
      icon: newCategory.icon,
      iconType: newCategory.iconType
    });

    setNewCategory({ name: '', icon: 'ri-apps-2-line', iconType: 'remix' });
    setIsAddingCategory(false);
    alert('Kategoria została pomyślnie dodana!');
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory({ ...category });
  };

  const handleUpdateCategory = () => {
    if (!editingCategory) return;
    
    if (!editingCategory.name.trim()) {
      alert('Proszę wprowadzić nazwę kategorii');
      return;
    }

    ProductDatabase.updateCategory(editingCategory.id, {
      name: editingCategory.name.trim(),
      icon: editingCategory.icon,
      iconType: editingCategory.iconType
    });

    setEditingCategory(null);
    alert('Kategoria została zaktualizowana!');
  };

  const handleDeleteCategory = (id: number) => {
    if (confirm('Czy na pewno chcesz usunąć tę kategorię?')) {
      ProductDatabase.deleteCategory(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Kategorie</h2>
          <p className="text-sm text-gray-600 mt-1">Zarządzaj kategoriami produktów - wszyscy użytkownicy widzą te same kategorie</p>
        </div>
        <button
          onClick={() => setIsAddingCategory(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer flex items-center"
        >
          <i className="ri-add-line mr-2"></i>
          Dodaj Kategorię
        </button>
      </div>

      {/* Formularz dodawania kategorii */}
      {isAddingCategory && (
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <h3 className="text-lg font-medium mb-4">Nowa Kategoria</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nazwa kategorii</label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Wprowadź nazwę kategorii"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Podgląd ikony</label>
              <div className="w-full h-10 border border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                {renderIcon(newCategory.icon, newCategory.iconType)}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Typ ikony</label>
            <div className="flex space-x-4 mb-4">
              <button
                onClick={() => setNewCategory({ ...newCategory, iconType: 'remix', icon: 'ri-apps-2-line' })}
                className={`px-4 py-2 rounded-lg border cursor-pointer ${
                  newCategory.iconType === 'remix' 
                    ? 'bg-blue-100 border-blue-500 text-blue-700' 
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Ikony Remix
              </button>
              <button
                onClick={() => setNewCategory({ ...newCategory, iconType: 'custom' })}
                className={`px-4 py-2 rounded-lg border cursor-pointer ${
                  newCategory.iconType === 'custom' 
                    ? 'bg-blue-100 border-blue-500 text-blue-700' 
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Własna ikona
              </button>
            </div>

            {newCategory.iconType === 'remix' && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Wybierz ikonę</h4>
                <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                  {popularIcons.map((iconClass) => (
                    <button
                      key={iconClass}
                      onClick={() => setNewCategory({ ...newCategory, icon: iconClass })}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg border-2 transition-all cursor-pointer ${
                        newCategory.icon === iconClass
                          ? 'border-blue-500 bg-blue-50 text-blue-600'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      <i className={iconClass}></i>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {newCategory.iconType === 'custom' && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Wgraj własną ikonę</h4>
                <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleCustomIconUpload(e)}
                    className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Obsługiwane formaty: JPG, PNG, GIF. Zalecany rozmiar: 64x64px
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setIsAddingCategory(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer"
            >
              Anuluj
            </button>
            <button
              onClick={handleAddCategory}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
            >
              Dodaj Kategorię
            </button>
          </div>
        </div>
      )}

      {/* Formularz edycji kategorii */}
      {editingCategory && (
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <h3 className="text-lg font-medium mb-4">Edytuj Kategorię</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nazwa kategorii</label>
              <input
                type="text"
                value={editingCategory.name}
                onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Podgląd ikony</label>
              <div className="w-full h-10 border border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                {renderIcon(editingCategory.icon, editingCategory.iconType)}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Typ ikony</label>
            <div className="flex space-x-4 mb-4">
              <button
                onClick={() => setEditingCategory({ ...editingCategory, iconType: 'remix', icon: 'ri-apps-2-line' })}
                className={`px-4 py-2 rounded-lg border cursor-pointer ${
                  editingCategory.iconType === 'remix' 
                    ? 'bg-blue-100 border-blue-500 text-blue-700' 
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Ikony Remix
              </button>
              <button
                onClick={() => setEditingCategory({ ...editingCategory, iconType: 'custom' })}
                className={`px-4 py-2 rounded-lg border cursor-pointer ${
                  editingCategory.iconType === 'custom' 
                    ? 'bg-blue-100 border-blue-500 text-blue-700' 
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Własna ikona
              </button>
            </div>

            {editingCategory.iconType === 'remix' && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Wybierz ikonę</h4>
                <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                  {popularIcons.map((iconClass) => (
                    <button
                      key={iconClass}
                      onClick={() => setEditingCategory({ ...editingCategory, icon: iconClass })}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg border-2 transition-all cursor-pointer ${
                        editingCategory.icon === iconClass
                          ? 'border-blue-500 bg-blue-50 text-blue-600'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      <i className={iconClass}></i>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {editingCategory.iconType === 'custom' && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Wgraj własną ikonę</h4>
                <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleCustomIconUpload(e, true)}
                    className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Obsługiwane formaty: JPG, PNG, GIF. Zalecany rozmiar: 64x64px
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setEditingCategory(null)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer"
            >
              Anuluj
            </button>
            <button
              onClick={handleUpdateCategory}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
            >
              Zaktualizuj
            </button>
          </div>
        </div>
      )}

      {/* Lista kategorii */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <i className="ri-apps-2-line text-6xl text-gray-300 mb-4"></i>
            <p className="text-gray-500 text-lg mb-2">Brak kategorii</p>
            <p className="text-gray-400">Dodaj pierwszą kategorię do systemu</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ikona
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nazwa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Typ ikony
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Akcje
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-8 h-8 flex items-center justify-center">
                        {renderIcon(category.icon, category.iconType, 'w-8 h-8')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{category.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        category.iconType === 'custom' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {category.iconType === 'custom' ? 'Własna ikona' : 'Remix Icon'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="w-8 h-8 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded cursor-pointer"
                        >
                          <i className="ri-edit-line"></i>
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="w-8 h-8 flex items-center justify-center text-red-600 hover:bg-red-50 rounded cursor-pointer"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
