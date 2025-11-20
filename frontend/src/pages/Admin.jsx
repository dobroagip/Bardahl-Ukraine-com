import React, { useState, useEffect } from 'react';
import { productAPI, categoryAPI } from '../services/api';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (activeTab === 'dashboard') loadDashboard();
    if (activeTab === 'products') loadProducts();
    if (activeTab === 'categories') loadCategories();
  }, [activeTab]);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/dashboard`);
      setStats(res.data.data.stats);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await productAPI.getAll();
      setProducts(res.data.data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await categoryAPI.getAll();
      setCategories(res.data.data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bardahl-carbon to-bardahl-dark-gray">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-bardahl-dark-gray text-white p-8 rounded-2xl mb-8 shadow-2xl border-2 border-bardahl-yellow">
          <h1 className="text-4xl font-black uppercase text-bardahl-yellow mb-2">АДМІН ПАНЕЛЬ</h1>
          <p className="text-bardahl-light-gray text-lg">Керування магазином Bardahl Ukraine</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-bardahl-dark-gray p-2 rounded-xl border-2 border-bardahl-metal-gray">
          {[
            { id: 'dashboard', icon: '📊', name: 'ДАШБОРД' },
            { id: 'products', icon: '📦', name: 'ТОВАРИ' },
            { id: 'categories', icon: '📁', name: 'КАТЕГОРІЇ' },
            { id: 'orders', icon: '🛒', name: 'ЗАМОВЛЕННЯ' },
            { id: 'users', icon: '👥', name: 'КОРИСТУВАЧІ' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 rounded-lg font-black uppercase text-xs md:text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-bardahl-yellow text-black shadow-lg scale-105'
                  : 'bg-bardahl-carbon text-white hover:bg-bardahl-metal-gray hover:text-bardahl-yellow'
              }`}
            >
              {tab.icon} {tab.name}
            </button>
          ))}
        </div>

        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div>
            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-bardahl-yellow border-t-transparent mx-auto"></div>
                <p className="text-white mt-4 text-xl">Завантаження...</p>
              </div>
            ) : stats ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-bardahl-dark-gray rounded-xl p-6 border-2 border-bardahl-metal-gray hover:border-bardahl-yellow transition-all">
                  <div className="text-bardahl-light-gray text-sm mb-2 font-semibold uppercase">Всього товарів</div>
                  <div className="text-5xl font-black text-bardahl-yellow">{stats.totalProducts}</div>
                </div>
                <div className="bg-bardahl-dark-gray rounded-xl p-6 border-2 border-bardahl-metal-gray hover:border-bardahl-yellow transition-all">
                  <div className="text-bardahl-light-gray text-sm mb-2 font-semibold uppercase">Всього замовлень</div>
                  <div className="text-5xl font-black text-bardahl-yellow">{stats.totalOrders}</div>
                </div>
                <div className="bg-bardahl-dark-gray rounded-xl p-6 border-2 border-bardahl-metal-gray hover:border-bardahl-yellow transition-all">
                  <div className="text-bardahl-light-gray text-sm mb-2 font-semibold uppercase">Користувачів</div>
                  <div className="text-5xl font-black text-bardahl-yellow">{stats.totalUsers}</div>
                </div>
                <div className="bg-bardahl-dark-gray rounded-xl p-6 border-2 border-bardahl-metal-gray hover:border-bardahl-yellow transition-all">
                  <div className="text-bardahl-light-gray text-sm mb-2 font-semibold uppercase">Дохід</div>
                  <div className="text-5xl font-black text-bardahl-yellow">{stats.totalRevenue?.toFixed(2)} ₴</div>
                </div>
              </div>
            ) : (
              <div className="text-center text-white py-20">
                <p className="text-xl">Немає даних для відображення</p>
              </div>
            )}
          </div>
        )}

        {/* PRODUCTS */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-black text-white">ТОВАРИ ({products.length})</h2>
              <button className="bg-bardahl-yellow text-black px-6 py-3 rounded-xl font-bold hover:bg-bardahl-gold transition-all">
                + ДОДАТИ ТОВАР
              </button>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-bardahl-yellow border-t-transparent mx-auto"></div>
              </div>
            ) : (
              <div className="bg-bardahl-dark-gray rounded-xl overflow-hidden border-2 border-bardahl-metal-gray">
                <table className="w-full">
                  <thead className="bg-bardahl-carbon text-bardahl-yellow border-b-2 border-bardahl-yellow">
                    <tr>
                      <th className="px-6 py-4 text-left font-black">НАЗВА</th>
                      <th className="px-6 py-4 text-left font-black">ЦІНА</th>
                      <th className="px-6 py-4 text-left font-black">СКЛАД</th>
                      <th className="px-6 py-4 text-left font-black">КАТЕГОРІЯ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id} className="border-b border-bardahl-metal-gray hover:bg-bardahl-carbon transition-colors">
                        <td className="px-6 py-4 text-white font-semibold">{product.name}</td>
                        <td className="px-6 py-4 text-bardahl-yellow font-bold">{product.price} ₴</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            product.stock > 20 ? 'bg-green-500/20 text-green-400' :
                            product.stock > 5 ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {product.stock} шт
                          </span>
                        </td>
                        <td className="px-6 py-4 text-white">{product.category?.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* CATEGORIES */}
        {activeTab === 'categories' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-black text-white">КАТЕГОРІЇ ({categories.length})</h2>
              <button className="bg-bardahl-yellow text-black px-6 py-3 rounded-xl font-bold hover:bg-bardahl-gold transition-all">
                + ДОДАТИ КАТЕГОРІЮ
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map(category => (
                <div key={category.id} className="bg-bardahl-dark-gray rounded-xl p-6 border-2 border-bardahl-metal-gray hover:border-bardahl-yellow transition-all">
                  <h3 className="text-2xl font-black text-bardahl-yellow mb-2">{category.name}</h3>
                  <p className="text-bardahl-light-gray text-sm mb-1">Slug: {category.slug}</p>
                  <p className="text-white font-semibold">Товарів: {category.products?.length || 0}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ORDERS & USERS - Soon */}
        {(activeTab === 'orders' || activeTab === 'users') && (
          <div className="text-center py-20 bg-bardahl-dark-gray rounded-xl border-2 border-bardahl-yellow">
            <div className="text-8xl mb-4">🚧</div>
            <h3 className="text-3xl font-black text-bardahl-yellow mb-4 uppercase">Скоро</h3>
            <p className="text-bardahl-light-gray text-xl">Ця секція в розробці</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;