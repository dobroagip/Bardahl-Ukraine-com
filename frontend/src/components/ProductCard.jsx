import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, onAddToCart }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Защита от undefined/null product
  if (!product) {
    return null;
  }

  const handleAddToCart = () => {
    onAddToCart(product);
    // Показать временное уведомление
    const button = document.activeElement;
    button.textContent = '✓ Додано';
    setTimeout(() => {
      button.textContent = 'В кошик';
    }, 2000);
  };

  const getStockBadge = () => {
    // Проверка наличия свойства stock
    const stock = product.stock ?? 0;
    
    if (stock > 10) {
      return {
        text: 'В наявності',
        bgColor: 'bg-green-500',
        textColor: 'text-white'
      };
    } else if (stock > 5) {
      return {
        text: 'Залишок мало',
        bgColor: 'bg-yellow-500',
        textColor: 'text-black'
      };
    } else if (stock > 0) {
      return {
        text: 'Останні',
        bgColor: 'bg-orange-500',
        textColor: 'text-white'
      };
    } else {
      return {
        text: 'Немає в наявності',
        bgColor: 'bg-red-500',
        textColor: 'text-white'
      };
    }
  };

  const stockBadge = getStockBadge();
  const hasDiscount = product.oldPrice && product.oldPrice > product.price;
  const discountPercent = hasDiscount 
    ? Math.round((1 - product.price / product.oldPrice) * 100) 
    : 0;

  return (
    <div 
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        {/* Stock Badge */}
        <span className={`${stockBadge.bgColor} ${stockBadge.textColor} px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg`}>
          {stockBadge.text}
        </span>

        {/* Discount Badge */}
        {hasDiscount && (
          <span className="bg-bardahl-red text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
            -{discountPercent}%
          </span>
        )}

        {/* New Badge (если товар новый) */}
        {product.isNew && (
          <span className="bg-bardahl-yellow text-black px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
            Новинка
          </span>
        )}
      </div>

      {/* Product Image */}
      <div className="relative bg-gray-50 h-72 flex items-center justify-center p-6 overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent"></div>
          </div>
        )}
        <img
          src={product.imageUrl || product.images?.[0] || 'https://placehold.co/400x400/f8f9fa/333333?text=No+Image'}
          alt={product.name || 'Product'}
          className={`max-w-full max-h-full object-contain transition-all duration-500 ${
            isHovered ? 'scale-110' : 'scale-100'
          } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Quick View on Hover */}
        <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
          <button className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-yellow-400 transition-colors duration-300">
            Швидкий перегляд
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 sm:p-6">
        {/* Category */}
        {product.categoryName && (
          <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider mb-2 font-semibold">
            {product.categoryName}
          </p>
        )}

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3 line-clamp-2 min-h-[3rem] sm:min-h-[3.5rem] group-hover:text-yellow-500 transition-colors duration-300">
          {product.name || 'Без назви'}
        </h3>

        {/* Description */}
        {product.shortDescription && (
          <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4line-clamp-2">
            {product.shortDescription}
          </p>
        )}

        {/* SKU */}
        {product.sku && (
          <p className="text-xs text-gray-400 mb-4 font-mono">
            Артикул: {product.sku}
          </p>
        )}

        {/* Divider */}
        <div className="border-t border-gray-100 mb-3 sm:mb-4"></div>

        {/* Price & Action */}
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Price */}
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1 sm:gap-2">
              <span className=" text-2xl sm:text-3xl font-black text-yellow-500">
                {product.price || 0}
              </span>
              <span className="text-base sm:text-lg font-bold text-yellow-500">₴</span>
            </div>
            {hasDiscount && (
              <span className=" text-xs sm:text-sm text-gray-400 line-through">
                {product.oldPrice} ₴
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!product.stock || product.stock === 0}
            className={`flex-1 py-2 px-3 sm:py-3 sm:px-4 rounded-xl font-bold uppercase text-xs sm:text-sm tracking-wider transition-all duration-300 ${
              !product.stock || product.stock === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-yellow-400 text-black hover:bg-yellow-500 hover:scale-105 active:scale-95 shadow-md hover:shadow-xl'
            }`}
          >
            {!product.stock || product.stock === 0 ? 'Немає' : 'В кошик'}
          </button>
        </div>

        {/* Features (if available) */}
        {product.features && Object.keys(product.features).length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(product.features).slice(0, 4).map(([key, value]) => (
                <div key={key} className="flex flex-col">
                  <span className="text-gray-500 font-medium">{key}:</span>
                  <span className="text-gray-900 font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Hover Glow Effect */}
      <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="absolute inset-0 rounded-2xl shadow-[0_0_30px_rgba(255,204,0,0.3)]"></div>
      </div>
    </div>
  );
};

export default ProductCard;