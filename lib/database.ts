'use client';

// Interfejsy danych
export interface Product {
  id: number;
  name: string;
  category: string;
  model: string;
  price: number;
  stock: number;
  status: string;
  lastUpdated: string;
  images: string[];
  description?: string;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  iconType: string;
}

export interface DatabaseSchema {
  settings: {
    shopName: string;
    phoneNumber: string;
    adminPassword: string;
  };
  categories: Category[];
  products: Product[];
  customIcons: {[key: string]: string};
  nextId: {
    product: number;
    category: number;
  };
}

// Cache dla danych z GitHub
class DataCache {
  private static cache: DatabaseSchema | null = null;
  private static lastFetch: number = 0;
  private static readonly CACHE_DURATION = 60 * 1000; // 60 sekund

  static isExpired(): boolean {
    return Date.now() - this.lastFetch > this.CACHE_DURATION;
  }

  static get(): DatabaseSchema | null {
    if (this.isExpired()) {
      return null;
    }
    return this.cache;
  }

  static set(data: DatabaseSchema): void {
    this.cache = data;
    this.lastFetch = Date.now();
  }

  static clear(): void {
    this.cache = null;
    this.lastFetch = 0;
  }
}

// API do zarządzania produktami z synchronizacją GitHub
export class ProductDatabase {
  private static data: DatabaseSchema = {
    settings: {
      shopName: 'Prosty Sklep',
      phoneNumber: '+48571294344',
      adminPassword: '0500600525'
    },
    categories: [
      { id: 1, name: 'Agregaty Prądotwórcze', icon: 'ri-flashlight-line', iconType: 'remix' },
      { id: 2, name: 'Masety Cementowe', icon: 'ri-map-pin-line', iconType: 'remix' },
      { id: 3, name: 'Klimatyzacja', icon: 'ri-snowflake-line', iconType: 'remix' },
      { id: 4, name: 'Narzędzia', icon: 'ri-hammer-line', iconType: 'remix' },
      { id: 5, name: 'Zbiorniki', icon: 'ri-recycle-line', iconType: 'remix' }
    ],
    products: [],
    customIcons: {},
    nextId: {
      product: 1,
      category: 6
    }
  };

  // Ładowanie danych z GitHub
  static async loadData(): Promise<void> {
    try {
      // Sprawdź cache
      const cachedData = DataCache.get();
      if (cachedData) {
        this.data = cachedData;
        return;
      }

      console.log('Ładowanie danych z GitHub...');
      const response = await fetch('https://raw.githubusercontent.com/PopielSeba/prostysklep-data/main/data.json', {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });

      if (!response.ok) {
        throw new Error(`GitHub API błąd: ${response.status}`);
      }

      const githubData = await response.json();
      
      // Walidacja schematu
      this.validateSchema(githubData);
      
      this.data = githubData;
      DataCache.set(githubData);
      
      console.log('Dane załadowane z GitHub:', {
        produkty: this.data.products.length,
        kategorie: this.data.categories.length,
        sklep: this.data.settings.shopName
      });

      // Powiadom o zmianach
      this.notifyChange();
      
    } catch (error) {
      console.error('Błąd ładowania danych:', error);
      
      // W przypadku błędu użyj domyślnych danych
      if (!this.data.products.length && !this.data.categories.length) {
        console.log('Używanie domyślnych danych...');
        this.loadDefaultData();
      }
    }
  }

  // Zapisywanie danych przez Netlify Function
  static async saveData(): Promise<void> {
    try {
      console.log('Zapisywanie danych przez Netlify Function...');
      
      const response = await fetch('/.netlify/functions/save-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.data)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Błąd sieci' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('Dane zapisane:', result);

      // Wyczyść cache aby wymusić ponowne pobranie
      DataCache.clear();

      // Pokaż powiadomienie
      if (typeof window !== 'undefined') {
        this.showToast('Zapisano! Publikacja w toku...', 'success');
      }

    } catch (error) {
      console.error('Błąd zapisywania danych:', error);
      
      if (typeof window !== 'undefined') {
        const errorMessage = error instanceof Error ? error.message : 'Nieznany błąd';
        this.showToast(`Błąd zapisu: ${errorMessage}`, 'error');
      }
      
      throw error;
    }
  }

  // Walidacja schematu danych
  private static validateSchema(data: any): void {
    if (!data || typeof data !== 'object') {
      throw new Error('Nieprawidłowy format danych');
    }

    if (!data.settings || !data.settings.shopName || !data.settings.phoneNumber || !data.settings.adminPassword) {
      throw new Error('Brak wymaganych ustawień');
    }

    if (!Array.isArray(data.categories)) {
      throw new Error('Kategorie muszą być tablicą');
    }

    if (!Array.isArray(data.products)) {
      throw new Error('Produkty muszą być tablicą');
    }
  }

  // Ładowanie domyślnych danych
  private static loadDefaultData(): void {
    this.data.products = [
      {
        id: 1,
        name: 'Klimatyzacja Carrier SRC-U09',
        category: 'Klimatyzacja',
        model: 'SRC-U09',
        price: 2450,
        stock: 20,
        status: 'active',
        lastUpdated: '2024-01-15',
        images: ['https://readdy.ai/api/search-image?query=Professional%20industrial%20air%20conditioning%20unit%20Carrier%20model%20in%20warehouse%2C%20multiple%20white%20and%20metallic%20units%20stacked%2C%20industrial%20environment%20with%20concrete%20walls%2C%20professional%20equipment%20photography%2C%20clean%20organized%20storage%20facility&width=400&height=300&seq=carrier1&orientation=landscape'],
        description: 'Profesjonalna klimatyzacja przemysłowa Carrier SRC-U09. Wysoka wydajność chłodzenia, niezawodność i trwałość. Idealna do zastosowań przemysłowych i komercyjnych.'
      },
      {
        id: 2,
        name: 'Agregat Honda EU2200i',
        category: 'Agregaty Prądotwórcze',
        model: 'EU2200i',
        price: 4200,
        stock: 15,
        status: 'active',
        lastUpdated: '2024-01-14',
        images: ['https://readdy.ai/api/search-image?query=Honda%20portable%20power%20generators%20in%20industrial%20warehouse%2C%20red%20Honda%20branded%20generators%2C%20professional%20equipment%20storage%2C%20concrete%20floor%20warehouse%20environment%2C%20organized%20equipment%20display%2C%20industrial%20lighting&width=400&height=300&seq=honda1&orientation=landscape'],
        description: 'Honda EU2200i - przenośny agregat prądotwórczy o mocy 2200W. Cichy, ekonomiczny i niezawodny. Idealny do prac mobilnych i awaryjnego zasilania.'
      }
    ];
  }

  // Toast notifications
  private static showToast(message: string, type: 'success' | 'error'): void {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white transform transition-all duration-300 ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  }

  // Gettery dla danych
  static getAllProducts(): Product[] {
    return [...this.data.products];
  }

  static getProductById(id: number): Product | null {
    return this.data.products.find(p => p.id === id) || null;
  }

  static getAllCategories(): Category[] {
    return [...this.data.categories];
  }

  static getPhoneNumber(): string {
    return this.data.settings.phoneNumber;
  }

  static getShopName(): string {
    return this.data.settings.shopName;
  }

  static getAdminPassword(): string {
    return this.data.settings.adminPassword;
  }

  static getCustomIcons(): {[key: string]: string} {
    return { ...this.data.customIcons };
  }

  // Operacje na produktach
  static async addProduct(product: Omit<Product, 'id' | 'lastUpdated'>): Promise<Product> {
    const newProduct: Product = {
      ...product,
      id: this.data.nextId.product++,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    this.data.products.push(newProduct);
    await this.saveData();
    this.notifyChange();
    return newProduct;
  }

  static async updateProduct(id: number, updates: Partial<Product>): Promise<boolean> {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    this.data.products[index] = {
      ...this.data.products[index],
      ...updates,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    await this.saveData();
    this.notifyChange();
    return true;
  }

  static async deleteProduct(id: number): Promise<boolean> {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    this.data.products.splice(index, 1);
    await this.saveData();
    this.notifyChange();
    return true;
  }

  static async copyProduct(id: number): Promise<Product | null> {
    const product = this.getProductById(id);
    if (!product) return null;
    
    return await this.addProduct({
      ...product,
      name: `${product.name} (kopia)`
    });
  }

  // Operacje na kategoriach
  static async addCategory(category: Omit<Category, 'id'>): Promise<Category> {
    const newCategory: Category = {
      ...category,
      id: this.data.nextId.category++
    };
    
    this.data.categories.push(newCategory);
    await this.saveData();
    this.notifyChange();
    return newCategory;
  }

  static async updateCategory(id: number, updates: Partial<Category>): Promise<boolean> {
    const index = this.data.categories.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    this.data.categories[index] = { ...this.data.categories[index], ...updates };
    await this.saveData();
    this.notifyChange();
    return true;
  }

  static async deleteCategory(id: number): Promise<boolean> {
    const index = this.data.categories.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    this.data.categories.splice(index, 1);
    await this.saveData();
    this.notifyChange();
    return true;
  }

  // Operacje na ustawieniach
  static async setPhoneNumber(phone: string): Promise<void> {
    this.data.settings.phoneNumber = phone;
    await this.saveData();
    this.notifyChange();
  }

  static async setShopName(name: string): Promise<void> {
    this.data.settings.shopName = name;
    await this.saveData();
    this.notifyChange();
  }

  static async setAdminPassword(password: string): Promise<void> {
    this.data.settings.adminPassword = password;
    await this.saveData();
    this.notifyChange();
  }

  // Operacje na ikonach
  static async addCustomIcon(id: string, data: string): Promise<void> {
    this.data.customIcons[id] = data;
    await this.saveData();
    this.notifyChange();
  }

  // Weryfikacja hasła administratora
  static verifyAdminPassword(password: string): boolean {
    return password === this.data.settings.adminPassword;
  }

  // Powiadomienia o zmianach
  private static notifyChange(): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('globalDataChanged'));
    }
  }

  // Statystyki
  static getStats() {
    const totalProducts = this.data.products.length;
    const activeProducts = this.data.products.filter(p => p.status === 'active').length;
    const totalStock = this.data.products.reduce((sum, p) => sum + p.stock, 0);
    const lowStockProducts = this.data.products.filter(p => p.stock < 5).length;
    
    return {
      totalProducts,
      activeProducts,
      totalStock,
      lowStockProducts
    };
  }
}