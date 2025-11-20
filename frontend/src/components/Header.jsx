import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Header = () => {
  const { cartCount } = useCart();
  const location = useLocation();

  // Функция для проверки активной ссылки
  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-bardahl-carbon border-b-2 border-bardahl-yellow sticky top-0 z-50 shadow-xl">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo - КОМБИНИРОВАННЫЙ С ЛОГОТИПОМ */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src="/images/bardahl-top-logo.png" 
              alt="Bardahl Ukraine"
              className="h-12 w-auto transition-opacity duration-300 group-hover:opacity-90"
            />
            <div className="hidden sm:block border-l-2 border-bardahl-metal-gray pl-3">
              <h1 className="text-white font-display font-bold text-xl group-hover:text-bardahl-yellow transition-colors duration-300">
                BARDAHL
              </h1>
              <p className="text-white text-xs uppercase tracking-wider">UKRAINE</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link 
              to="/" 
              className={`px-6 py-2 rounded-lg font-semibold text-base uppercase tracking-wide transition-all duration-200 ${
                isActive('/') 
                  ? 'text-black bg-bardahl-yellow' 
                  : 'text-white hover:text-bardahl-yellow hover:bg-bardahl-dark-gray'
              }`}
            >
              Головна
            </Link>
            <Link 
              to="/products" 
              className={`px-6 py-2 rounded-lg font-semibold text-base uppercase tracking-wide transition-all duration-200 ${
                isActive('/products') 
                  ? 'text-black bg-bardahl-yellow' 
                  : 'text-white hover:text-bardahl-yellow hover:bg-bardahl-dark-gray'
              }`}
            >
              Товари
            </Link>
            <Link 
              to="/categories" 
              className={`px-6 py-2 rounded-lg font-semibold text-base uppercase tracking-wide transition-all duration-200 ${
                isActive('/categories') 
                  ? 'text-black bg-bardahl-yellow' 
                  : 'text-white hover:text-bardahl-yellow hover:bg-bardahl-dark-gray'
              }`}
            >
              Категорії
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link 
              to="/cart" 
              className="relative p-3 text-white hover:text-bardahl-yellow transition-all duration-200 hover:bg-bardahl-dark-gray rounded-lg group"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m0 0L17 21" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-bardahl-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {/* Admin Button */}
            <Link 
              to="/admin" 
              className="bg-bardahl-yellow text-black font-black text-sm uppercase tracking-wider py-3 px-6 rounded-full hover:bg-bardahl-gold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-bardahl-yellow/50"
            >
              Адмін
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;