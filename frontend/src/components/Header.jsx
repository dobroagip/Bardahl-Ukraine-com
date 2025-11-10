import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cartAPI } from '../services/api';

const Header = () => {
  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    loadCartCount();
  }, []);

  const loadCartCount = async () => {
    try {
      const response = await cartAPI.get();
      const itemsCount = response.data.data.cart.items.reduce((total, item) => total + item.quantity, 0);
      setCartItemsCount(itemsCount);
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  return (
    <header className="bg-bardahl-carbon border-b border-bardahl-metal-gray sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-bardahl-gradient w-10 h-10 rounded-full flex items-center justify-center shadow-bardahl">
              <span className="text-bardahl-black font-bold font-display text-lg">B</span>
            </div>
            <div>
              <h1 className="text-white font-display font-bold text-xl group-hover:text-bardahl-yellow transition-colors duration-300">
                BARDAHL
              </h1>
              <p className="text-bardahl-metal-gray text-xs">UKRAINE</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="nav-link-bardahl text-white font-medium text-lg hover:text-bardahl-yellow transition-colors duration-200"
            >
              Головна
            </Link>
            <Link 
              to="/products" 
              className="nav-link-bardahl text-bardahl-metal-gray font-medium text-lg hover:text-bardahl-yellow transition-colors duration-200"
            >
              Товари
            </Link>
            <Link 
              to="/categories" 
              className="nav-link-bardahl text-bardahl-metal-gray font-medium text-lg hover:text-bardahl-yellow transition-colors duration-200"
            >
              Категорії
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Link 
              to="/cart" 
              className="relative p-2 text-bardahl-metal-gray hover:text-bardahl-yellow transition-colors duration-200 group"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m0 0L17 21" />
              </svg>
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-bardahl-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            
            <Link 
              to="/admin" 
              className="btn-bardahl text-sm py-2 px-4"
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