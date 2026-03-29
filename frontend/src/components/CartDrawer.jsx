import React, { useState } from 'react';
import useStore from '../store/useStore';
import axios from 'axios';
import { X, Trash2, Bell, CheckCircle2 } from 'lucide-react';

const CartDrawer = () => {
  const { cart, removeFromCart, clearCart, isCartOpen, setCartOpen, tableNumber } = useStore();
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const handleOrder = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/orders', {
        table_number: tableNumber,
        cartItems: cart,
        totalAmount
      });
      setSuccessMsg('Đặt món thành công! Bếp đang chuẩn bị...');
      setTimeout(() => {
        setSuccessMsg('');
        clearCart();
        setCartOpen(false);
      }, 3000);
    } catch (error) {
      alert('Lỗi đặt món. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleCallStaff = async () => {
    try {
      await axios.post('http://localhost:5000/api/call-staff', { table_number: tableNumber });
      alert('Đã gọi phục vụ. Nhân viên sẽ đến ngay lập tức!');
    } catch (error) {
      alert('Lỗi kết nối. Vui lòng vẫy tay gọi nhân viên nhé!');
    }
  };

  return (
    <>
      {/* Floating Call Staff Button */}
      {tableNumber && (
         <button 
           onClick={handleCallStaff}
           className="fixed bottom-6 right-6 z-40 bg-white border border-gray-200 shadow-xl rounded-full p-4 text-orange-500 hover:bg-orange-50 transition-colors animate-bounce"
         >
           <Bell className="w-6 h-6" />
         </button>
      )}

      {/* Drawer Overlay */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
          onClick={() => setCartOpen(false)}
        />
      )}

      {/* Drawer Content */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Giỏ Hàng Của Bạn</h2>
          <button onClick={() => setCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50">
          {successMsg && (
            <div className="bg-green-100 text-green-700 p-4 rounded-xl font-semibold flex items-center gap-3 animate-slide-up">
              <CheckCircle2 className="w-5 h-5" />
              {successMsg}
            </div>
          )}

          {cart.length === 0 && !successMsg && (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-4xl">🛒</span>
              </div>
              <p className="font-medium text-lg">Giỏ hàng đang trống</p>
              <button 
                onClick={() => setCartOpen(false)}
                className="text-orange-500 font-semibold"
              >
                Tiếp tục chọn món
              </button>
            </div>
          )}

          {cart.map((item, index) => (
            <div key={index} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 animate-slide-up">
              <img src={item.image_url} alt={item.name} className="w-20 h-20 object-cover rounded-xl" />
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <h3 className="font-bold text-gray-800 leading-tight">{item.name}</h3>
                  <p className="text-xs text-gray-500 mt-1 space-x-2">
                    {item.spiceLevel && <span>Cay: {item.spiceLevel}</span>}
                    {item.iceLevel && <span>Đá: {item.iceLevel}</span>}
                  </p>
                  {item.notes && <p className="text-xs italic text-orange-600 mt-1">Ghi chú: {item.notes}</p>}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-extrabold text-gray-900">{formatPrice(item.price)} x {item.quantity}</span>
                  <button onClick={() => removeFromCart(index)} className="text-red-400 hover:text-red-600 p-1">
                    <Trash2 className="w-4 h-4"/>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-5 bg-white border-t border-gray-100 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500 font-medium">Tổng thanh toán</span>
              <span className="text-2xl font-black text-orange-500">{formatPrice(totalAmount)}</span>
            </div>
            <button 
              onClick={handleOrder}
              disabled={loading}
              className={`w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
            >
              {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : 'GỬI ĐƠN XUỐNG BẾP'}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
