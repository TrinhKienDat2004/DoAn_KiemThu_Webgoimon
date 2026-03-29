import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductModal from './ProductModal';
import { Search, Flame, Leaf, Award } from 'lucide-react';

const MenuScreen = () => {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/menu');
        setCategories(res.data.categories);
        setItems(res.data.items);
        if (res.data.categories.length > 0) {
          setSelectedCategory(res.data.categories[0].id);
        }
      } catch (error) {
        console.error("Lỗi lấy dữ liệu menu", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const filteredItems = items.filter(item => 
    item.category_id === selectedCategory && 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderTags = (tagsString) => {
    if (!tagsString) return null;
    const tags = tagsString.split(',');
    return (
      <div className="flex gap-2 mb-2">
        {tags.includes('bestseller') && <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-md font-bold flex items-center gap-1"><Award className="w-3 h-3"/> Best</span>}
        {tags.includes('cay') && <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-md font-bold flex items-center gap-1"><Flame className="w-3 h-3"/> Cay</span>}
        {tags.includes('chay') && <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-md font-bold flex items-center gap-1"><Leaf className="w-3 h-3"/> Chay</span>}
      </div>
    );
  };

  if (loading) return <div className="flex justify-center items-center h-full"><div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="w-full max-w-5xl mx-auto h-full flex flex-col space-y-6 pt-4 animate-slide-up">
      
      {/* Search Bar */}
      <div className="relative px-4">
        <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Tìm kiếm món ăn..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border-2 border-transparent shadow-sm rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-orange-500 transition-colors text-sm font-medium text-gray-700"
        />
      </div>

      {/* Categories Tabs */}
      <div className="flex w-full overflow-x-auto gap-3 px-4 pb-2 hide-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex-shrink-0 px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
              selectedCategory === cat.id 
                ? 'bg-gray-900 text-white shadow-md transform scale-105' 
                : 'bg-white text-gray-500 hover:bg-gray-100'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Item Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 pb-24">
        {filteredItems.map(item => (
          <div 
            key={item.id} 
            onClick={() => setSelectedItem(item)}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1 group"
          >
            <div className="h-48 overflow-hidden relative">
              <img 
                src={item.image_url} 
                alt={item.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-white font-semibold flex items-center gap-2">Chọn món này <Flame className="w-4 h-4"/></span>
              </div>
            </div>
            <div className="p-5">
              {renderTags(item.tags)}
              <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{item.name}</h3>
              <p className="text-gray-500 text-xs mt-1 line-clamp-2 h-8">{item.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-orange-500 font-extrabold text-lg">{formatPrice(item.price)}</span>
                <button className="bg-orange-100 text-orange-600 rounded-full w-8 h-8 flex items-center justify-center font-bold pb-0.5 hover:bg-orange-500 hover:text-white transition-colors">
                  +
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 font-medium">
            Không tìm thấy món ăn nào :(
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedItem && (
        <ProductModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
};

export default MenuScreen;
