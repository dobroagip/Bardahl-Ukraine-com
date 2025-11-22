import React, { useState, useEffect } from 'react';
import { productAPI, categoryAPI } from '../services/api';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:3000/api';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Модалки
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  
  // Форма категории
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: ''
  });

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
      console.error('Error:', error);
      toast.error('Помилка завантаження статистики');
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
      console.error('Error:', error);
      toast.error('Помилка завантаження товарів');
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
      console.error('Error:', error);
      toast.error('Помилка завантаження категорій');
    } finally {
      setLoading(false);
    }
  };

  // ============ КАТЕГОРИИ ============
  
  // Функция транслитерации украинского в латиницу
  const transliterate = (text) => {
    const map = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'h', 'ґ': 'g', 'д': 'd', 'е': 'e', 'є': 'ye',
      'ж': 'zh', 'з': 'z', 'и': 'y', 'і': 'i', 'ї': 'yi', 'й': 'y', 'к': 'k', 'л': 'l',
      'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
      'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ь': '', 'ю': 'yu',
      'я': 'ya',
      'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'H', 'Ґ': 'G', 'Д': 'D', 'Е': 'E', 'Є': 'Ye',
      'Ж': 'Zh', 'З': 'Z', 'И': 'Y', 'І': 'I', 'Ї': 'Yi', 'Й': 'Y', 'К': 'K', 'Л': 'L',
      'М': 'M', 'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
      'Ф': 'F', 'Х': 'Kh', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Shch', 'Ю': 'Yu', 'Я': 'Ya'
    };

    return text
      .split('')
      .map(char => map[char] || char)
      .join('')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Автоматична генерація slug з назви
  const handleNameChange = (name) => {
    setCategoryForm({
      name,
      slug: transliterate(name)
    });
  };

  const handleCategorySubmit = async () => {
    if (!categoryForm.name || !categoryForm.slug) {
      toast.error('Заповніть всі поля!');
      return;
    }

    setLoading(true);
    try {
      if (editingCategory) {
        // Редагування
        await axios.put(`${API_BASE_URL}/categories/${editingCategory.id}`, categoryForm);
        toast.success('Категорію оновлено!');
      } else {
        // Створення
        await axios.post(`${API_BASE_URL}/categories`, categoryForm);
        toast.success('Категорію створено!');
      }
      
      setShowCategoryModal(false);
      resetCategoryForm();
      loadCategories();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Помилка при збереженні категорії');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      slug: category.slug
    });
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm('Видалити цю категорію? Це може вплинути на товари!')) return;
    
    setLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/categories/${id}`);
      toast.success('Категорію видалено!');
      loadCategories();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Помилка при видаленні категорії');
    } finally {
      setLoading(false);
    }
  };

  const resetCategoryForm = () => {
    setCategoryForm({ name: '', slug: '' });
    setEditingCategory(null);
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
                <p className="text-xl">Немає даних</p>
              </div>
            )}
          </div>
        )}

        {/* PRODUCTS */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-black text-white">ТОВАРИ ({products.length})</h2>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-bardahl-yellow border-t-transparent mx-auto"></div>
              </div>
            ) : (
              <div className="bg-bardahl-dark-gray rounded-xl overflow-x-auto border-2 border-bardahl-metal-gray">
                <table className="w-full">
                  <thead className="bg-bardahl-carbon text-bardahl-yellow border-b-2 border-bardahl-yellow">
                    <tr>
                      <th className="px-6 py-4 text-left font-black">ID</th>
                      <th className="px-6 py-4 text-left font-black">НАЗВА</th>
                      <th className="px-6 py-4 text-left font-black">ЦІНА</th>
                      <th className="px-6 py-4 text-left font-black">СКЛАД</th>
                      <th className="px-6 py-4 text-left font-black">КАТЕГОРІЯ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id} className="border-b border-bardahl-metal-gray hover:bg-bardahl-carbon transition-colors">
                        <td className="px-6 py-4 text-bardahl-light-gray">#{product.id}</td>
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
                        <td className="px-6 py-4 text-bardahl-light-gray">{product.category?.name}</td>
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
              <button 
                onClick={() => { resetCategoryForm(); setShowCategoryModal(true); }}
                className="bg-bardahl-yellow text-black px-6 py-3 rounded-xl font-bold hover:bg-bardahl-gold transition-all hover:scale-105 shadow-xl"
              >
                + ДОДАТИ КАТЕГОРІЮ
              </button>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-bardahl-yellow border-t-transparent mx-auto"></div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map(category => (
                  <div key={category.id} className="bg-bardahl-dark-gray rounded-xl p-6 border-2 border-bardahl-metal-gray hover:border-bardahl-yellow transition-all group">
                    <div className="mb-4">
                      <h3 className="text-2xl font-black text-bardahl-yellow mb-2 group-hover:text-white transition-colors">{category.name}</h3>
                      <p className="text-bardahl-light-gray text-sm mb-1">
                        <span className="font-semibold">ID:</span> {category.id}
                      </p>
                      <p className="text-bardahl-light-gray text-sm mb-1">
                        <span className="font-semibold">Slug:</span> {category.slug}
                      </p>
                      <p className="text-white font-semibold">
                        Товарів: <span className="text-bardahl-yellow">{category.products?.length || 0}</span>
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-bold transition-all hover:scale-105"
                      >
                        ✏️ Редагувати
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-bold transition-all hover:scale-105"
                      >
                        🗑️ Видалити
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ORDERS & USERS */}
        {(activeTab === 'orders' || activeTab === 'users') && (
          <div className="text-center py-20 bg-bardahl-dark-gray rounded-xl border-2 border-bardahl-yellow">
            <div className="text-8xl mb-4">🚧</div>
            <h3 className="text-3xl font-black text-bardahl-yellow mb-4 uppercase">Скоро</h3>
            <p className="text-bardahl-light-gray text-xl">Ця секція в розробці</p>
          </div>
        )}
      </div>

      {/* MODAL: Категорія */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-bardahl-dark-gray rounded-2xl p-8 max-w-lg w-full border-4 border-bardahl-yellow shadow-2xl relative">
            {/* Кнопка закрытия */}
            <button
              onClick={() => { setShowCategoryModal(false); resetCategoryForm(); }}
              className="absolute top-4 right-4 w-10 h-10 bg-bardahl-red text-white rounded-full font-bold hover:bg-red-600 transition-all hover:scale-110 flex items-center justify-center"
              title="Закрити"
            >
              ✕
            </button>

            <h2 className="text-3xl font-black text-bardahl-yellow mb-6 uppercase pr-8">
              {editingCategory ? '✏️ Редагувати категорію' : '➕ Нова категорія'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white text-sm font-bold mb-2 uppercase">
                  Назва категорії *
                </label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Моторні масла"
                  className="w-full px-4 py-3 bg-bardahl-carbon border-2 border-bardahl-metal-gray rounded-lg text-white placeholder-bardahl-metal-gray focus:border-bardahl-yellow focus:outline-none text-lg"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-bold mb-2 uppercase">
                  Slug (URL) *
                </label>
                <input
                  type="text"
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm({...categoryForm, slug: e.target.value})}
                  placeholder="motorni-masla"
                  className="w-full px-4 py-3 bg-bardahl-carbon border-2 border-bardahl-metal-gray rounded-lg text-white placeholder-bardahl-metal-gray focus:border-bardahl-yellow focus:outline-none text-lg font-mono"
                />
                <p className="text-bardahl-light-gray text-xs mt-1">
                  💡 Slug генерується автоматично, але ви можете його змінити
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleCategorySubmit}
                  disabled={loading || !categoryForm.name || !categoryForm.slug}
                  className="flex-1 bg-bardahl-yellow text-black px-6 py-3 rounded-xl font-black uppercase hover:bg-bardahl-gold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 shadow-xl"
                >
                  {loading ? '⏳ Збереження...' : '💾 Зберегти'}
                </button>
                <button
                  onClick={() => { setShowCategoryModal(false); resetCategoryForm(); }}
                  disabled={loading}
                  className="px-6 py-3 border-2 border-bardahl-metal-gray rounded-xl font-bold text-white hover:bg-bardahl-carbon transition-all hover:border-bardahl-red disabled:opacity-50"
                >
                  ❌ Скасувати
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;