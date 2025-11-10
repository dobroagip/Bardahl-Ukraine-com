import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gray-50">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<div className="container mx-auto px-4 py-8 text-center">Товары - скоро!</div>} />
            <Route path="/categories" element={<div className="container mx-auto px-4 py-8 text-center">Категории - скоро!</div>} />
            <Route path="/cart" element={<div className="container mx-auto px-4 py-8 text-center">Корзина - скоро!</div>} />
            <Route path="/admin" element={<div className="container mx-auto px-4 py-8 text-center">Админ панель - скоро!</div>} />
          </Routes>
        </main>
        
        {/* Footer */}
        <footer className="bg-bardahl-carbon text-bardahl-metal-gray py-8 mt-12 border-t border-bardahl-dark-gray">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; 2024 Bardahl Ukraine. Всі права захищені.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;