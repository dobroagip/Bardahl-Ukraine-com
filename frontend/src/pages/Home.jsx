import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { productAPI, categoryAPI } from '../services/api';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
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
      
      setProducts(productsResponse.data.data.products || []);
      setCategories(categoriesResponse.data.data.categories || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = selectedCategory
    ? products.filter(product => product.categoryId === parseInt(selectedCategory))
    : products;

  const handleAddToCart = (product) => {
    setCartUpdate(prev => prev + 1);
    // Здесь можно добавить анимацию или уведомление
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bardahl-carbon to-bardahl-dark-gray flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-bardahl-yellow mx-auto mb-4"></div>
          <p className="text-bardahl-yellow font-display text-xl">Завантаження...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bardahl-carbon to-bardahl-dark-gray">
      {/* Hero Section */}
      <section className="relative bg-racing-gradient py-20 overflow-hidden">
        <div className="absolute inset-0 bg-carbon-fiber opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient-bardahl font-display">
            BARDAHL UKRAINE
          </h1>
          <p className="text-xl text-bardahl-metal-gray mb-8 max-w-2xl mx-auto">
            Якісна автохімія та мастильні матеріали для вашого автомобіля
          </p>
          <button className="btn-bardahl text-lg px-8 py-4">
            Перейти до товарів
          </button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-bardahl-carbon">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-8 font-display">
            Категорії товарів
          </h2>
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-6 py-3 rounded-bardahl font-medium transition-all duration-300 ${
                selectedCategory === '' 
                  ? 'btn-bardahl shadow-bardahl-lg' 
                  : 'bg-bardahl-dark-gray text-bardahl-metal-gray hover:bg-bardahl-metal-gray hover:text-white'
              }`}
            >
              Всі товари
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-bardahl font-medium transition-all duration-300 ${
                  selectedCategory === category.id.toString()
                    ? 'btn-bardahl shadow-bardahl-lg'
                    : 'bg-bardahl-dark-gray text-bardahl-metal-gray hover:bg-bardahl-metal-gray hover:text-white'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-bardahl-metal-gray text-lg">Товари не знайдені</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;