import React, { useState, useEffect } from 'react';

const QuickViewModal = ({ product, onClose, onAddToCart }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Закрытие по Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Блокировка скролла body
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const images = product.images || [product.imageUrl || '/placeholder-product.jpg'];
  const hasDiscount = product.oldPrice && product.oldPrice > product.price;
  const discountPercent = hasDiscount 
    ? Math.round((1 - product.price / product.oldPrice) * 100) 
    : 0;

  const handleAddToCart = () => {
    onAddToCart();
    onClose();
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slideUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors duration-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-8 p-8 overflow-y-auto max-h-[90vh]">
          {/* Left: Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-gray-50 rounded-2xl overflow-hidden aspect-square">
              {hasDiscount && (
                <div className="absolute top-4 right-4 z-10 bg-bardahl-red text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  -{discountPercent}%
                </div>
              )}
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-contain p-8"
              />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage === index
                        ? 'border-bardahl-yellow scale-105'
                        : 'border-gray-200 hover:border-bardahl-yellow/50'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="flex flex-col">
            {/* Category */}
            {product.categoryName && (
              <p className="text-sm text-gray-500 uppercase tracking-wider mb-2 font-semibold">
                {product.categoryName}
              </p>
            )}

            {/* Title */}
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {product.name}
            </h2>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-bardahl-yellow">
                  {product.price}
                </span>
                <span className="text-2xl font-bold text-bardahl-yellow">грн</span>
              </div>
              {hasDiscount && (
                <div className="flex flex-col">
                  <span className="text-xl text-gray-400 line-through">
                    {product.oldPrice} грн
                  </span>
                  <span className="text-sm text-green-600 font-bold">
                    Економія {product.oldPrice - product.price} грн
                  </span>
                </div>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-600 font-semibold">
                    В наявності ({product.stock} шт)
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-red-600 font-semibold">
                    Немає в наявності
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-2">Опис</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description || product.shortDescription || 'Опис відсутній'}
              </p>
            </div>

            {/* Features */}
            {product.features && Object.keys(product.features).length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-3">Характеристики</h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(product.features).map(([key, value]) => (
                    <div key={key} className="flex flex-col p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-500 mb-1">{key}</span>
                      <span className="font-semibold text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SKU */}
            <div className="mb-6">
              <p className="text-sm text-gray-500">
                Артикул: <span className="font-mono font-semibold text-gray-700">{product.sku || product.id}</span>
              </p>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="mt-auto space-y-4">
              {/* Quantity Selector */}
              {product.stock > 0 && (
                <div className="flex items-center gap-4">
                  <span className="font-semibold">Кількість:</span>
                  <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="px-4 py-2 bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        setQuantity(Math.min(Math.max(1, val), product.stock));
                      }}
                      className="w-16 text-center font-bold text-lg border-x-2 border-gray-200 focus:outline-none"
                    />
                    <button
                      onClick={incrementQuantity}
                      disabled={quantity >= product.stock}
                      className="px-4 py-2 bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg uppercase tracking-wider transition-all duration-300 ${
                  product.stock === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-bardahl-yellow text-black hover:bg-bardahl-gold hover:scale-105 shadow-lg hover:shadow-xl'
                }`}
              >
                {product.stock === 0 ? 'Немає в наявності' : 'Додати в кошик'}
              </button>

              {/* Additional Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button className="py-3 px-4 border-2 border-gray-300 rounded-xl font-semibold hover:border-bardahl-yellow hover:bg-bardahl-yellow/10 transition-all duration-300 flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  В обране
                </button>
                <button className="py-3 px-4 border-2 border-gray-300 rounded-xl font-semibold hover:border-bardahl-yellow hover:bg-bardahl-yellow/10 transition-all duration-300 flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Поділитись
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default QuickViewModal;