import React from 'react';
import { cartAPI } from '../services/api';

const ProductCard = ({ product, onAddToCart }) => {
  const handleAddToCart = async () => {
    try {
      await cartAPI.add(product.id, 1);
      if (onAddToCart) onAddToCart(product);
      // Можно добавить toast уведомление вместо alert
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div className="card-bardahl group hover:scale-105 transition-transform duration-300">
      <div className="relative overflow-hidden">
        <img 
          src={product.images?.[0] || '/placeholder-product.jpg'} 
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          {product.stock > 0 ? (
            <span className="badge-bardahl animate-pulse-gold">
              В наявності
            </span>
          ) : (
            <span className="bg-bardahl-red text-white px-3 py-1 rounded-full text-sm font-semibold">
              Немає
            </span>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-bardahl-yellow transition-colors duration-200">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex justify-between items-center mb-3">
          <span className="text-2xl font-bold text-bardahl-yellow font-display">
            {product.price} ₴
          </span>
          <span className="text-sm text-gray-500">
            Код: {product.id}
          </span>
        </div>
        
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full py-3 px-4 rounded-bardahl font-semibold font-display transition-all duration-200 ${
            product.stock > 0 
              ? 'btn-bardahl hover:scale-105' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {product.stock > 0 ? 'В кошик' : 'Немає в наявності'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;