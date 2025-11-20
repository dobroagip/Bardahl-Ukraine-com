import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { productAPI, categoryAPI } from '../services/api';
import logger from '../utils/logger';

const Home = () => {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Загрузка данных при монтировании
  useEffect(() => {
    loadInitialData();
  }, []);

  // Перезагрузка товаров при смене категории
  useEffect(() => {
    if (categories.length > 0) {
      loadProducts();
    }
  }, [selectedCategory]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      // Загружаем категории
      const categoriesRes = await categoryAPI.getAll();
      const categoriesData = categoriesRes.data.data || [];
      
      setCategories([
        { id: 'all', name: 'Всі товари', slug: 'all' },
        ...categoriesData
      ]);
      
      // Загружаем товары
      const productsRes = await productAPI.getAll();
      const productsData = productsRes.data.data || [];
      setProducts(productsData);
      
      logger.info('Данные загружены:', { products: productsData.length, categories: categoriesData.length });
    } catch (err) {
      logger.error('Ошибка загрузки данных:', err);
      // Устанавливаем пустые массивы при ошибке
      setCategories([{ id: 'all', name: 'Всі товари', slug: 'all' }]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    if (selectedCategory === 'all') {
      // Показать все товары
      try {
        const res = await productAPI.getAll();
        setProducts(res.data.data || []);
      } catch (err) {
        logger.error('Ошибка загрузки товаров:', err);
      }
    } else {
      // Фильтрация по категории (используем categoryId из вашей Prisma схемы)
      try {
        const res = await productAPI.getAll();
        const allProducts = res.data.data || [];
        // Фильтруем по categoryId
        const filtered = allProducts.filter(p => p.categoryId === parseInt(selectedCategory));
        setProducts(filtered);
      } catch (err) {
        logger.error('Ошибка фильтрации товаров:', err);
      }
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const scrollToProducts = () => {
    document.getElementById('products-section')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-bardahl-carbon via-bardahl-dark-gray to-black overflow-hidden min-h-[300px] md:min-h-[400px] flex items-center">
        {/* Diagonal Stripes Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              #ffcc00 0px,
              #ffcc00 3px,
              transparent 3px,
              transparent 12px
            )`
          }}
        ></div>

        <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-bardahl-yellow mb-4 md:mb-6 tracking-tight uppercase drop-shadow-2xl leading-tight">
              BARDAHL UKRAINE
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white mb-6 md:mb-10 font-medium leading-relaxed max-w-3xl mx-auto px-4">
              Якісна автохімія та мастильні матеріали для вашого автомобіля
            </p>
            <button 
              onClick={scrollToProducts}
              className="bg-bardahl-yellow text-black px-8 py-3 sm:px-10 sm:py-4 md:px-12 md:py-5 rounded-full text-base sm:text-lg md:text-xl font-black uppercase tracking-wider hover:bg-bardahl-gold transition-all duration-300 hover:scale-110 shadow-2xl hover:shadow-bardahl-yellow/50 border-2 md:border-4 border-bardahl-gold"
            >
              ПЕРЕЙТИ ДО ТОВАРІВ
            </button>
          </div>
        </div>

        {/* Decorative Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0 h-16 md:h-24">
          <svg className="w-full h-full" viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 50L60 45C120 40 240 30 360 35C480 40 600 60 720 65C840 70 960 60 1080 50C1200 40 1320 30 1380 25L1440 20V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0V50Z" fill="#1a1a1a"/>
          </svg>
        </div>
      </section>

      {/* Categories Section */}
      <section id="products-section" className="bg-bardahl-carbon py-8 md:py-16 border-t-4 border-bardahl-yellow">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white text-center mb-6 md:mb-12 uppercase tracking-wider">
            КАТЕГОРІЇ ТОВАРІВ
          </h2>
          
          {/* Category Pills */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-8">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id === 'all' ? 'all' : category.id.toString())}
                className={`px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-full font-black uppercase text-xs sm:text-sm md:text-base tracking-wider transition-all duration-300 ${
                  selectedCategory === (category.id === 'all' ? 'all' : category.id.toString())
                    ? 'bg-bardahl-yellow text-black border-2 border-bardahl-gold shadow-2xl scale-105 md:scale-110 shadow-bardahl-yellow/50'
                    : 'bg-transparent text-white border-2 border-bardahl-metal-gray hover:bg-bardahl-metal-gray hover:border-bardahl-yellow hover:scale-105 hover:text-bardahl-yellow'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="bg-gradient-to-b from-gray-50 to-gray-100 py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex flex-col justify-center items-center py-32">
              <div className="animate-spin rounded-full h-20 w-20 border-8 border-bardahl-yellow border-t-transparent mb-6"></div>
              <p className="text-xl text-bardahl-carbon font-bold">Завантаження товарів...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-32">
              <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl mx-auto border-4 border-bardahl-yellow">
                <div className="text-8xl mb-6">📦</div>
                <p className="text-3xl text-gray-800 font-black mb-4 uppercase">
                  Товари не знайдено
                </p>
                <p className="text-gray-500 mb-8 text-lg">
                  Спробуйте вибрати іншу категорію або зверніться до адміністратора
                </p>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="bg-bardahl-yellow text-black px-10 py-4 rounded-full font-black text-lg hover:bg-bardahl-gold transition-all hover:scale-110 uppercase shadow-xl"
                >
                  Показати всі товари
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-10 text-center">
                <div className="inline-block bg-bardahl-yellow text-black px-8 py-3 rounded-full shadow-xl">
                  <p className="text-lg font-black uppercase">
                    Знайдено товарів: <span className="text-2xl">{products.length}</span>
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-20 border-t-4 border-bardahl-yellow">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-16 uppercase text-bardahl-carbon">
            Наші переваги
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-bardahl-yellow">
              <div className="w-20 h-20 bg-gradient-to-br from-bardahl-yellow to-bardahl-gold rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-black mb-4 uppercase text-bardahl-carbon">Оригінальна продукція</h3>
              <p className="text-gray-600 text-lg leading-relaxed">Всі товари сертифіковані та мають гарантію якості від виробника</p>
            </div>

            <div className="text-center p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-bardahl-yellow">
              <div className="w-20 h-20 bg-gradient-to-br from-bardahl-yellow to-bardahl-gold rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black mb-4 uppercase text-bardahl-carbon">Швидка доставка</h3>
              <p className="text-gray-600 text-lg leading-relaxed">Відправка в день замовлення по всій території України</p>
            </div>

            <div className="text-center p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-bardahl-yellow">
              <div className="w-20 h-20 bg-gradient-to-br from-bardahl-yellow to-bardahl-gold rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black mb-4 uppercase text-bardahl-carbon">Підтримка 24/7</h3>
              <p className="text-gray-600 text-lg leading-relaxed">Професійні консультації та допомога в будь-який час доби</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;