import React from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext'; 
import Header from './components/Header';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import './index.css';
import Admin from './pages/Admin';

function App() {
  return (
       <CartProvider>
    <Router>
      <div className="App min-h-screen bg-gray-50">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/categories" element={<div className="container mx-auto px-4 py-8 text-center">Категорії - скоро!</div>} />
            <Route path="/cart" element={<Cart />} /> 
            <Route path="/orders" element={<div className="container mx-auto px-4 py-8 text-center">Заказы - скоро!</div>} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        
        {/* Footer */}
       <footer className="bg-bardahl-carbon text-white py-8 mt-12 border-t-2 border-bardahl-yellow">
          <div className="container mx-auto px-4 text-center">
             <p className="text-bardahl-light-gray mb-2">&copy; 2024 Bardahl Ukraine. Всі права захищені.</p>
            <p className="text-bardahl-light-gray mb-2">Якісна продукція для вашого автомобіля</p>
          </div>
        </footer>
      </div>
    </Router>
       </CartProvider>
  );
}

export default App;