import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import logger from '../utils/logger';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [cart, setCart] = useState(null);

  const loadCart = async () => {
    try {
      const response = await cartAPI.get();
      // Safely access response shape and provide defaults
      const cartData = response.data?.data?.cart || { items: [], total: 0 };
      setCart(cartData);

      // Обновляем счетчик (защищено на случай пустого массива items)
      const totalItems = (cartData.items || []).reduce((sum, item) => sum + (item.quantity || 0), 0);
      setCartCount(totalItems);
    } catch (error) {
      logger.error('Error loading cart:', error);
    }
  };

   const addToCart = async (product) => {
    try {
      logger.info('Adding to cart:', product);
      
      // Вызов API для добавления
      await cartAPI.add(product.id, 1);
      
      // Обновить корзину
      await loadCart();
      
      // Показать уведомление
      toast.success(`${product.name} додано в кошик!`);
    } catch (error) {
      logger.error('Error adding to cart:', error);
      toast.error('Помилка при додаванні в кошик');
    }
  };

  const updateCartCount = (newCount) => {
    setCartCount(newCount);
  };

  const refreshCart = () => {
    loadCart();
  };

  useEffect(() => {
    loadCart();
  }, []);

  return (
    <CartContext.Provider value={{
      cartCount,
      cart,
      addToCart,
      updateCartCount,
      refreshCart,
      loadCart
    }}>
      {children}
    </CartContext.Provider>
  );
};