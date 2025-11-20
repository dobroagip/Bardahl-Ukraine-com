import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productAPI, categoryAPI } from '../services/api';
import logger from '../utils/logger';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [loading, setLoading] = useState(true);
  const [cartUpdate, setCartUpdate] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsResponse, categoriesResponse] = await Promise.all([
        productAPI.getAll(),
        categoryAPI.getAll()
      ]);
      
  // API returns { success, data } where data for products endpoint is the array of products
  setProducts(productsResponse.data.data || []);
  // Categories endpoint also returns array in data
  setCategories(categoriesResponse.data.data || []);
    } catch (error) {
      logger.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products
    .filter(product => 
      selectedCategory ? product.categoryId === parseInt(selectedCategory) : true
    )
    .filter(product => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        product.name?.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.category?.name?.toLowerCase().includes(searchLower)
      );
    });

  // Debug logs removed for production; keep optional chaining for safety above

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'name':
      default: return a.name.localeCompare(b.name);
    }
  });
  const handleAddToCart = (product) => {
    setCartUpdate(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bardahl-carbon to-bardahl-dark-gray flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-bardahl-yellow mx-auto mb-4"></div>
          <p className="text-bardahl-yellow font-display text-xl">Завантаження товарів...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bardahl-carbon to-bardahl-dark-gray">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gradient-bardahl mb-4 font-display">
            Каталог товарів
          </h1>
          <p className="text-bardahl-metal-gray text-lg max-w-2xl mx-auto">
            Широкий вибір якісної автохімії та мастильних матеріалів Bardahl
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-bardahl-dark-gray rounded-bardahl-lg p-6 mb-8 border border-bardahl-metal-gray">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Search */}
<div className="mb-6">
  <label className="block text-bardahl-metal-gray text-sm font-semibold mb-2 font-display">
    Пошук товарів
  </label>
  <div className="relative">
    <input
      type="text"
      placeholder="Введіть назву, опис або категорію..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full px-4 py-2 pl-12 pr-10 bg-bardahl-carbon border border-bardahl-metal-gray rounded-bardahl text-white placeholder-bardahl-metal-gray focus:outline-none focus:border-bardahl-yellow focus:ring-2 focus:ring-bardahl-yellow focus:ring-opacity-20 transition-all duration-200"
    />
    
    {/* Иконка поиска слева */}
    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-bardahl-metal-gray">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
    
    {/* Кнопка очистки справа */}
    {searchTerm && (
      <button
        onClick={() => setSearchTerm('')}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-bardahl-metal-gray hover:text-bardahl-yellow transition-colors duration-200"
        title="Очистити пошук"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    )}
  </div>
  
  {/* Подсказка */}
  <p className="text-xs text-bardahl-metal-gray mt-2 flex items-center">
    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    Пошук працює по назві, опису та категорії товару
  </p>
</div>

            {/* Sort */}
            <div>
              <label className="block text-bardahl-metal-gray text-sm font-medium mb-2">
                Сортування
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 bg-bardahl-carbon border border-bardahl-metal-gray rounded-bardahl text-white focus:outline-none focus:border-bardahl-yellow transition-colors duration-200"
              >
                <option value="name">За назвою</option>
                <option value="price-low">Від дешевших</option>
                <option value="price-high">Від дорожчих</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-bardahl-metal-gray">
            Знайдено товарів: <span className="text-bardahl-yellow font-semibold">{filteredProducts.length}</span>
          </p>
          <div className="flex space-x-2">
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory('')}
                className="bg-bardahl-red text-white px-3 py-1 rounded-full text-sm hover:bg-red-600 transition-colors duration-200"
              >
                Очистити фільтр
              </button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {sortedProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-bardahl-dark-gray rounded-bardahl-lg p-12 max-w-2xl mx-auto">
              <svg className="w-24 h-24 text-bardahl-metal-gray mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-2xl font-bold text-white mb-4 font-display">Товари не знайдені</h3>
              <p className="text-bardahl-metal-gray mb-6">
                Спробуйте змінити параметри пошуку або вибрати іншу категорію
              </p>
              <button
                onClick={() => { setSelectedCategory(''); setSearchTerm(''); }}
                className="btn-bardahl px-6 py-3"
              >
                Скинути фільтри
              </button>
            </div>
          </div>
        )}

        {/* Back to Home */}
        <div className="text-center">
          <Link 
            to="/" 
            className="inline-flex items-center text-bardahl-yellow hover:text-bardahl-gold transition-colors duration-200 font-display"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Повернутися на головну
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Products;