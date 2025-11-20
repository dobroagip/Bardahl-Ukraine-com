import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cartAPI } from '../services/api';
import { useCart } from '../context/CartContext'; 
import logger from '../utils/logger';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { refreshCart } = useCart();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const response = await cartAPI.get();
      setCart(response.data.data.cart);
    } catch (error) {
      logger.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdating(true);
    try {
      await cartAPI.update(itemId, newQuantity);
      await loadCart(); // Reload cart data
      refreshCart(); // Обновляем контекст корзины
    } catch (error) {
      logger.error('Error updating quantity:', error);
    } finally {
      setUpdating(false);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await cartAPI.remove(itemId);
      await loadCart();
      refreshCart(); // Обновляем контекст корзины
    } catch (error) {
      logger.error('Error removing item:', error);
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clear();
      await loadCart();
      refreshCart(); // Обновляем контекст корзины
    } catch (error) {
      logger.error('Error clearing cart:', error);
    }
  };

  // СОРТИРОВКА для стабильного порядка
  const sortedCartItems = cart ? [...cart.items].sort((a, b) => a.id - b.id) : [];

  // Для debug - посмотрим порядок элементов
  useEffect(() => {
    if (cart) {
      // Debug logs removed for production
    }
  }, [cart]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bardahl-carbon to-bardahl-dark-gray flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-bardahl-yellow mx-auto mb-4"></div>
          <p className="text-bardahl-yellow font-display text-xl">Завантаження кошика...</p>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bardahl-carbon to-bardahl-dark-gray">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="bg-bardahl-dark-gray rounded-bardahl-lg p-12 max-w-2xl mx-auto">
              <div className="text-bardahl-metal-gray mb-6">
                <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m0 0L17 21" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4 font-display">Кошик порожній</h2>
              <p className="text-bardahl-metal-gray mb-8">Додайте товари до кошика, щоб продовжити покупки</p>
              <Link 
                to="/" 
                className="btn-bardahl inline-block px-8 py-3 text-lg"
              >
                Перейти до товарів
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bardahl-carbon to-bardahl-dark-gray">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8 font-display text-center">Кошик покупок</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-bardahl-dark-gray rounded-bardahl-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white font-display">
                  Товари в кошику ({cart.items.length})
                </h2>
                <button
                  onClick={clearCart}
                  className="text-bardahl-red hover:text-red-400 transition-colors duration-200 text-sm font-medium"
                >
                  Очистити кошик
                </button>
              </div>

              <div className="space-y-4">
                {sortedCartItems.map((item) => (
                  <div 
                    key={`cart-item-${item.id}-${item.product.id}`} 
                    className="bg-bardahl-carbon rounded-bardahl p-4 flex items-center space-x-4 min-h-[120px]"
                  >
                    <img 
                      src={item.product.images?.[0] || '/placeholder-product.jpg'} 
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded flex-shrink-0"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium mb-1">{item.product.name}</h3>
                      <p className="text-bardahl-yellow font-bold text-lg">{item.product.price} грн</p>
                    </div>

                    <div className="flex items-center space-x-3 flex-shrink-0">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || updating}
                        className="w-8 h-8 bg-bardahl-metal-gray text-white rounded-full flex items-center justify-center disabled:opacity-50 transition-colors duration-150"
                      >
                        -
                      </button>
                      
                      <span className="text-white font-medium w-8 text-center">
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={updating}
                        className="w-8 h-8 bg-bardahl-metal-gray text-white rounded-full flex items-center justify-center disabled:opacity-50 transition-colors duration-150"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right flex-shrink-0 min-w-[100px]">
                      <p className="text-white font-bold text-lg mb-2">
                        {(item.product.price * item.quantity).toFixed(2)} грн
                      </p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-bardahl-red hover:text-red-400 transition-colors duration-150 text-sm"
                      >
                        Видалити
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-bardahl-dark-gray rounded-bardahl-lg p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-white mb-4 font-display">Підсумок замовлення</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-bardahl-metal-gray">
                  <span>Товари ({cart.items.reduce((sum, item) => sum + item.quantity, 0)} шт.)</span>
                  <span>{cart.total.toFixed(2)} грн</span>
                </div>
                <div className="flex justify-between text-bardahl-metal-gray">
                  <span>Доставка</span>
                  <span>Безкоштовно</span>
                </div>
                <div className="border-t border-bardahl-metal-gray pt-3">
                  <div className="flex justify-between text-white font-bold text-lg">
                    <span>Всього</span>
                    <span>{cart.total.toFixed(2)} грн</span>
                  </div>
                </div>
              </div>

              <button className="btn-bardahl w-full py-4 text-lg font-display mb-4">
                Оформити замовлення
              </button>
              
              <Link 
                to="/" 
                className="block text-center text-bardahl-metal-gray hover:text-bardahl-yellow transition-colors duration-200"
              >
                Продовжити покупки
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;