import React, { useState } from 'react';
import useStore from '../store/useStore';
import { ChefHat, ArrowRight } from 'lucide-react';
import axios from 'axios';

const WelcomeScreen = () => {
  const [tableInput, setTableInput] = useState('');
  const [areaInput, setAreaInput] = useState('Tầng 1');
  const [error, setError] = useState('');
  const setTable = useStore((state) => state.setTable);
  const setView = useStore((state) => state.setView);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tableInput.trim()) {
      setError('Vui lòng nhập số bàn của bạn');
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth', { table_number: tableInput, area: areaInput });
      setTable(tableInput, response.data.table.area || areaInput);
      setView('menu');
    } catch (err) {
      setError(err.response?.data?.error || 'Bàn không hợp lệ. VD: Bàn 01, Bàn 02, VIP 01...');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-auto flex flex-col items-center justify-center p-6 space-y-8 animate-slide-up">
      <div className="text-center space-y-4">
        <div className="bg-orange-100 p-4 rounded-full inline-block shadow-sm">
            <ChefHat className="w-12 h-12 text-orange-600" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Xin Chào!</h1>
        <p className="text-gray-500">Vui lòng nhập số bàn để bắt đầu gọi món ngay.</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-5 glass-morphism p-6 rounded-2xl shadow-xl">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Số Bàn Của Bạn</label>
            <input
              type="text"
              placeholder="Ví dụ: Bàn 05"
              value={tableInput}
              onChange={(e) => {
                setTableInput(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all placeholder:text-gray-400 font-medium"
            />
          </div>

          <div>
             <label className="block text-sm font-semibold text-gray-700 mb-1">Khu Vực (Tuỳ Chọn)</label>
             <select
                value={areaInput}
                onChange={(e) => setAreaInput(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all bg-white font-medium text-gray-700"
             >
                <option value="Tầng 1">Tầng 1</option>
                <option value="Sân Vườn">Sân Vườn</option>
                <option value="Phòng VIP">Phòng VIP</option>
             </select>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm font-medium animate-pulse">{error}</p>}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3.5 px-4 rounded-lg shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 transition-all flex items-center justify-center group"
        >
          Bắt Đầu Xem Menu
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </form>
    </div>
  );
};

export default WelcomeScreen;
