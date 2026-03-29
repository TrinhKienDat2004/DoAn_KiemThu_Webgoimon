import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import axios from 'axios';
import { FileText, Clock, Ban, CheckCircle, Receipt, ArrowLeft, RefreshCw, XCircle } from 'lucide-react';

const OrderStatus = () => {
  const { tableNumber, setView } = useStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState(null);

  const fetchOrders = async () => {
    try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/orders/status/${tableNumber}`);
        setOrders(res.data);
    } catch (error) {
        console.error('Error fetching orders:', error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // Polling every 10s
    return () => clearInterval(interval);
  }, [tableNumber]);

  const handleCancel = async (orderId) => {
    if(!window.confirm('Bạn có chắc chắn muốn hủy đơn này không?')) return;
    try {
        await axios.put(`http://localhost:5000/api/orders/${orderId}/cancel`);
        fetchOrders(); // Refresh
        alert('Đã hủy đơn thành công!');
    } catch (error) {
        alert(error.response?.data?.error || 'Không thể hủy đơn.');
    }
  };

  const handleCheckout = async () => {
      if(!window.confirm('Bạn muốn gọi thanh toán tất cả các món chưa tính tiền?')) return;
      try {
          const res = await axios.post(`http://localhost:5000/api/orders/checkout`, { table_number: tableNumber });
          setInvoice(res.data.invoice);
          fetchOrders(); // will set them to Paid
      } catch(error) {
          alert(error.response?.data?.error || 'Lỗi thanh toán.');
      }
  };

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  
  // Calculate total unpaid value
  const unpaidTotal = orders.reduce((sum, order) => {
      if(order.status !== 'Đã thanh toán' && order.status !== 'Đã hủy') {
          return sum + Number(order.total_amount);
      }
      return sum;
  }, 0);

  const getStatusColor = (status) => {
      switch(status) {
          case 'Chờ xác nhận': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
          case 'Đang nấu': return 'bg-orange-100 text-orange-700 border-orange-200';
          case 'Đã phục vụ': return 'bg-blue-100 text-blue-700 border-blue-200';
          case 'Đã thanh toán': return 'bg-green-100 text-green-700 border-green-200';
          case 'Đã hủy': return 'bg-red-100 text-red-700 border-red-200';
          default: return 'bg-gray-100 text-gray-700';
      }
  };

  return (
    <div className="w-full max-w-2xl mx-auto pb-24 animate-fade-in relative">
        <div className="flex items-center justify-between mb-6">
            <button onClick={() => setView('menu')} className="flex items-center text-gray-500 hover:text-orange-500 font-semibold px-2 py-1 rounded-lg hover:bg-orange-50 transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Quay lại Menu
            </button>
            <h2 className="text-2xl font-black text-gray-800">Đơn Của Tôi</h2>
            <button onClick={fetchOrders} className={`p-2 rounded-full hover:bg-gray-200 text-gray-500 transition-transform ${loading ? 'animate-spin' : ''}`}>
               <RefreshCw className="w-5 h-5" />
            </button>
        </div>

        {/* Invoice Modal */}
        {invoice && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 animate-slide-up relative">
                    <button onClick={() => setInvoice(null)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
                        <XCircle className="w-6 h-6"/>
                    </button>
                    <div className="text-center mb-6">
                        <Receipt className="w-12 h-12 mx-auto text-orange-500 mb-2" />
                        <h3 className="text-xl font-bold font-mono uppercase">Hóa Đơn Thanh Toán</h3>
                        <p className="text-gray-500 font-medium">Bàn: {invoice.table}</p>
                        <p className="text-xs text-gray-400">{new Date(invoice.time).toLocaleString('vi-VN')}</p>
                    </div>
                    
                    <div className="border-t border-b border-dashed border-gray-300 py-4 mb-4 space-y-3 max-h-60 overflow-y-auto">
                        {invoice.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-start text-sm">
                                <div className="flex-1 pr-4">
                                    <p className="font-semibold text-gray-800">{item.name}</p>
                                    <p className="text-xs text-gray-500">{item.quantity} x {formatPrice(item.price_at_time)}</p>
                                </div>
                                <span className="font-bold">{formatPrice(item.quantity * item.price_at_time)}</span>
                            </div>
                        ))}
                    </div>
                    
                    <div className="flex justify-between items-center text-lg font-black text-red-600">
                        <span>TỔNG CỘNG</span>
                        <span>{formatPrice(invoice.total)}</span>
                    </div>
                    
                    <button onClick={() => setInvoice(null)} className="mt-8 w-full bg-orange-100 text-orange-600 font-bold py-3 rounded-lg hover:bg-orange-200 transition">
                        Đóng Hóa Đơn
                    </button>
                </div>
            </div>
        )}

        {/* Order List */}
        <div className="space-y-4">
            {orders.length === 0 && !loading && (
                <div className="text-center py-20 text-gray-400">
                    <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium">Bạn chưa gọi món nào</p>
                </div>
            )}

            {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transform transition-all hover:shadow-md">
                    <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                        <div className="flex flex-col">
                            <span className="font-bold text-gray-800">Đơn #{order.id}</span>
                            <span className="text-xs text-gray-500 flex items-center mt-1">
                                <Clock className="w-3 h-3 mr-1" /> {new Date(order.created_at).toLocaleTimeString('vi-VN')}
                            </span>
                        </div>
                        <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getStatusColor(order.status)}`}>
                            {order.status}
                        </span>
                    </div>

                    <div className="p-4 bg-white">
                        <ul className="space-y-3">
                            {order.items && order.items.map((item, i) => (
                                <li key={i} className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                                            {item.quantity}x
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">{item.name}</p>
                                            {item.notes && <p className="text-xs text-gray-500 italic">{item.notes}</p>}
                                        </div>
                                    </div>
                                    <span className="font-semibold text-gray-600">
                                        {formatPrice(item.price_at_time * item.quantity)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    <div className="p-4 border-t border-gray-50 flex justify-between items-center bg-gray-50/30">
                        <div className="font-medium text-gray-500 text-sm">
                            Tổng: <span className="font-black text-gray-900 text-lg ml-1">{formatPrice(order.total_amount)}</span>
                        </div>
                        
                        {order.status === 'Chờ xác nhận' && (
                            <button 
                                onClick={() => handleCancel(order.id)}
                                className="flex items-center text-sm text-red-500 font-bold hover:bg-red-50 px-3 py-1.5 rounded-lg transition"
                            >
                                <Ban className="w-4 h-4 mr-1"/> Hủy Đơn
                            </button>
                        )}
                        {order.status === 'Đã thanh toán' && (
                            <span className="flex items-center text-sm text-green-500 font-bold px-3 py-1.5 rounded-lg">
                                <CheckCircle className="w-4 h-4 mr-1"/> Hoàn tất
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </div>

        {/* Floating Checkout Button */}
        {unpaidTotal > 0 && (
            <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t border-gray-100 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-40">
                <div className="max-w-2xl mx-auto flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 uppercase text-xs font-bold tracking-wider">Tổng Chưa Toán</p>
                        <p className="text-2xl font-black text-orange-500">{formatPrice(unpaidTotal)}</p>
                    </div>
                    <button 
                        onClick={handleCheckout}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-green-500/30 transition-all flex items-center"
                    >
                        <Receipt className="w-5 h-5 mr-no md:mr-2" />
                        <span className="hidden md:inline ml-2">GỌI THANH TOÁN QUẦY</span>
                    </button>
                </div>
            </div>
        )}
    </div>
  );
};

export default OrderStatus;
