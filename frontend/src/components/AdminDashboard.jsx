import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useStore from '../store/useStore';
import { 
  BarChart, 
  ChefHat, 
  MessageCircle, 
  LayoutGrid, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock,
  Table as TableIcon,
  TrendingUp,
  DollarSign,
  Star
} from 'lucide-react';

const AdminDashboard = () => {
    const { admin, logoutAdmin } = useStore();
    const [activeTab, setActiveTab] = useState('kitchen');
    const [orders, setOrders] = useState([]);
    const [supportCalls, setSupportCalls] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [tables, setTables] = useState([]);
    const [analytics, setAnalytics] = useState({ revenue: [], popular: [] });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000); 
        return () => clearInterval(interval);
    }, [activeTab]);

    const fetchData = async () => {
        try {
            if (activeTab === 'kitchen') {
                const res = await axios.get('http://localhost:5000/api/admin/orders');
                setOrders(res.data);
            } else if (activeTab === 'support') {
                const res = await axios.get('http://localhost:5000/api/admin/support');
                setSupportCalls(res.data);
            } else if (activeTab === 'menu') {
                const res = await axios.get('http://localhost:5000/api/menu');
                setMenuItems(res.data.items);
                setCategories(res.data.categories);
            } else if (activeTab === 'tables') {
                const res = await axios.get('http://localhost:5000/api/admin/tables');
                setTables(res.data);
            } else if (activeTab === 'analytics') {
                const res = await axios.get('http://localhost:5000/api/admin/analytics');
                setAnalytics(res.data);
            }
        } catch (err) {
            console.error("Lỗi tải dữ liệu", err);
        }
    };
    
    // ... (rest of helper functions same as before)
    const updateOrderStatus = async (id, status) => {
        try {
            await axios.put(`http://localhost:5000/api/admin/orders/${id}/status`, { status });
            fetchData();
        } catch (err) { alert("Lỗi cập nhật trạng thái"); }
    };

    const resolveSupport = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/admin/support/${id}/resolve`);
            fetchData();
        } catch (err) { alert("Lỗi xử lý yêu cầu"); }
    };

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    return (
        <div className="flex flex-col h-screen w-full bg-gray-50 overflow-hidden">
            {/* Admin Header */}
            <header className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-lg z-10">
                <div className="flex items-center gap-3">
                    <div className="bg-orange-500 p-2 rounded-lg">
                        <BarChart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-none">Admin SpicyMenu</h1>
                        <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold">Quản trị hệ thống • {admin?.role}</p>
                    </div>
                </div>
                <button 
                    onClick={logoutAdmin}
                    className="flex items-center gap-2 bg-gray-800 hover:bg-red-900 border border-gray-700 px-4 py-2 rounded-xl text-sm font-bold transition-all"
                >
                    <LogOut className="w-4 h-4 text-red-400" />
                    <span>Đăng xuất</span>
                </button>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="w-20 sm:w-64 bg-white border-r border-gray-100 flex flex-col p-4 gap-2 z-0 shadow-sm overflow-y-auto custom-scrollbar">
                    <TabButton active={activeTab === 'kitchen'} onClick={() => setActiveTab('kitchen')} icon={<ChefHat className="w-5 h-5"/>} label="Nhà Bếp" badge={orders.length} />
                    <TabButton active={activeTab === 'support'} onClick={() => setActiveTab('support')} icon={<MessageCircle className="w-5 h-5"/>} label="Yêu Cầu Hỗ Trợ" badge={supportCalls.length} />
                    <TabButton active={activeTab === 'menu'} onClick={() => setActiveTab('menu')} icon={<LayoutGrid className="w-5 h-5"/>} label="Quản Lý Món" />
                    <TabButton active={activeTab === 'tables'} onClick={() => setActiveTab('tables')} icon={<TableIcon className="w-5 h-5"/>} label="Sơ Đồ Bàn" />
                    <TabButton active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} icon={<TrendingUp className="w-5 h-5"/>} label="Thống Kê Doanh Thu" />
                </aside>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                    <div className="max-w-6xl mx-auto">
                        
                        {/* 17. KITCHEN VIEW */}
                        {activeTab === 'kitchen' && (
                            <div className="space-y-6">
                                <SectionHeader title="Đơn Hàng Hiện Tại" subtitle="Theo dõi và cập nhật trạng thái chế biến" />
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {orders.map(order => (
                                        <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95">
                                            <div className="bg-gray-50 px-5 py-3 flex justify-between items-center border-b border-gray-100">
                                                <div className="flex items-center gap-3">
                                                    <span className="bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded-md">{order.table_number}</span>
                                                    <span className="text-xs font-bold text-gray-400 capitalize">{order.status}</span>
                                                </div>
                                                <span className="text-[10px] text-gray-400 font-medium">#{order.id} • {new Date(order.created_at).toLocaleTimeString('vi-VN')}</span>
                                            </div>
                                            <div className="p-5 space-y-4">
                                                <div className="space-y-2">
                                                    {order.items.map((item, idx) => (
                                                        <div key={idx} className="flex justify-between items-start">
                                                            <div>
                                                                <span className="font-bold text-gray-800">{item.quantity}x</span>
                                                                <span className="ml-2 font-medium text-gray-700">{item.name}</span>
                                                                {(item.options_spice || item.options_ice || item.notes) && (
                                                                    <p className="text-[11px] text-orange-500 ml-7 italic">
                                                                        {item.options_spice && `Ớt: ${item.options_spice}, `}
                                                                        {item.options_ice && `Đá: ${item.options_ice}, `}
                                                                        {item.notes}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="pt-4 border-t border-gray-50 flex gap-2">
                                                    {order.status === 'Chờ xác nhận' && (
                                                        <button 
                                                            onClick={() => updateOrderStatus(order.id, 'Đang nấu')}
                                                            className="flex-1 bg-blue-500 text-white font-bold py-2 rounded-xl text-sm transition-transform hover:-translate-y-0.5"
                                                        >Bếp tiếp nhận</button>
                                                    )}
                                                    {order.status === 'Đang nấu' && (
                                                        <button 
                                                            onClick={() => updateOrderStatus(order.id, 'Đã phục vụ')}
                                                            className="flex-1 bg-green-500 text-white font-bold py-2 rounded-xl text-sm transition-transform hover:-translate-y-0.5"
                                                        >Xác nhận đã lên món</button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {orders.length === 0 && <EmptyState icon={<Clock className="w-12 h-12 text-gray-300"/>} text="Không có đơn hàng nào cần xử lý" />}
                                </div>
                            </div>
                        )}

                        {/* 18. SUPPORT VIEW */}
                        {activeTab === 'support' && (
                            <div className="space-y-6">
                                <SectionHeader title="Yêu Cầu Từ Khách Hàng" subtitle="Phản hồi nhanh chóng các yêu cầu hỗ trợ" />
                                <div className="space-y-4">
                                    {supportCalls.map(call => (
                                        <div key={call.id} className="bg-white p-5 rounded-2xl shadow-sm border border-orange-100 flex items-center justify-between animate-slide-in-right">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                                                    <MessageCircle className="w-6 h-6 text-orange-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-800 text-lg">{call.table_number}</h3>
                                                    <p className="text-sm text-gray-500">{call.area} • {new Date(call.created_at).toLocaleTimeString('vi-VN')}</p>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => resolveSupport(call.id)}
                                                className="bg-gray-900 text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
                                            >
                                                <CheckCircle2 className="w-4 h-4" />
                                                Đã Xử Lý
                                            </button>
                                        </div>
                                    ))}
                                    {supportCalls.length === 0 && <EmptyState icon={<CheckCircle2 className="w-12 h-12 text-gray-300"/>} text="Tất cả khách hàng đã được hỗ trợ" />}
                                </div>
                            </div>
                        )}

                        {/* 15 & 16. MENU VIEW */}
                        {activeTab === 'menu' && (
                            <div className="space-y-6 pb-12">
                                <div className="flex justify-between items-center">
                                    <SectionHeader title="Quản Lý Thực Đơn" subtitle="Cập nhật món ăn, hình ảnh và giá cả" />
                                    <button className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold px-6 py-3 rounded-2xl shadow-xl shadow-orange-200 flex items-center gap-2 transition-all hover:-translate-y-1">
                                        <Plus className="w-5 h-5" />
                                        Thêm Món Mới
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {menuItems.map(item => (
                                        <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group">
                                            <div className="h-40 overflow-hidden relative">
                                                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase text-gray-600">
                                                    {categories.find(c => c.id === item.category_id)?.name}
                                                </div>
                                            </div>
                                            <div className="p-4 flex-1 flex flex-col">
                                                <h3 className="font-bold text-gray-800 line-clamp-1">{item.name}</h3>
                                                <p className="text-orange-500 font-extrabold mt-1">{formatPrice(item.price)}</p>
                                                <div className="mt-4 pt-4 border-t border-gray-50 flex gap-2">
                                                    <button className="flex-1 bg-gray-50 text-gray-600 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                                                        <Edit3 className="w-3.5 h-3.5" /> Sửa
                                                    </button>
                                                    <button className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 19. TABLE VIEW */}
                        {activeTab === 'tables' && (
                            <div className="space-y-6 pb-12">
                                <div className="flex justify-between items-center">
                                    <SectionHeader title="Quản Lý Sơ Đồ Bàn" subtitle="Thiết lập các bàn và khu vực phục vụ" />
                                    <button className="bg-gray-900 hover:bg-black text-white font-bold px-6 py-3 rounded-2xl shadow-xl flex items-center gap-2 transition-all hover:-translate-y-1">
                                        <Plus className="w-5 h-5" />
                                        Thêm Bàn
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {tables.map(table => (
                                        <div key={table.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center gap-2 hover:border-orange-200 transition-all">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${table.status === 'Trống' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                                                <TableIcon className="w-6 h-6" />
                                            </div>
                                            <h4 className="font-extrabold text-gray-800">{table.table_number}</h4>
                                            <span className="text-[10px] text-gray-400 font-bold uppercase">{table.area}</span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${table.status === 'Trống' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                {table.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 20. ANALYTICS VIEW */}
                        {activeTab === 'analytics' && (
                            <div className="space-y-8 pb-12">
                                <SectionHeader title="Thống Kê Kinh Doanh" subtitle="Hiệu quả hoạt động của nhà hàng" />
                                
                                {/* Stat Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <StatCard 
                                        icon={<DollarSign className="w-6 h-6"/>} 
                                        label="Doanh thu hôm nay" 
                                        value={formatPrice(analytics.revenue[0]?.daily_total || 0)} 
                                        color="orange"
                                    />
                                    <StatCard 
                                        icon={<ChefHat className="w-6 h-6"/>} 
                                        label="Số món đã bán" 
                                        value={analytics.popular.reduce((acc, p) => acc + Number(p.total_sold), 0)} 
                                        color="blue"
                                    />
                                    <StatCard 
                                        icon={<Star className="w-6 h-6"/>} 
                                        label="Đánh giá trung bình" 
                                        value="4.8" 
                                        color="yellow"
                                    />
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Revenue Chart Placeholder */}
                                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                        <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                                            <TrendingUp className="w-5 h-5 text-orange-500" />
                                            Doanh thu 7 ngày gần nhất
                                        </h3>
                                        <div className="flex items-end justify-between h-48 gap-2 pt-4">
                                            {analytics.revenue.map((day, idx) => (
                                                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                                                    <div 
                                                        className="w-full bg-orange-100 rounded-t-lg group-hover:bg-orange-500 transition-all relative"
                                                        style={{ height: `${(day.daily_total / Math.max(...analytics.revenue.map(r => r.daily_total), 1)) * 100}%` }}
                                                    >
                                                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            {Math.round(day.daily_total / 1000)}k
                                                        </span>
                                                    </div>
                                                    <span className="text-[10px] text-gray-400 font-bold whitespace-nowrap overflow-hidden w-full text-center">
                                                        {new Date(day.date).toLocaleDateString('vi-VN', { weekday: 'short' })}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Popular Dishes */}
                                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                        <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                                            <Award className="w-5 h-5 text-yellow-500" />
                                            Top 5 món bán chạy nhất
                                        </h3>
                                        <div className="space-y-4">
                                            {analytics.popular.map((item, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <span className={`w-6 h-6 flex items-center justify-center rounded-lg text-[10px] font-black ${
                                                            idx === 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-400'
                                                        }`}>{idx + 1}</span>
                                                        <span className="text-sm font-bold text-gray-700">{item.name}</span>
                                                    </div>
                                                    <span className="text-xs font-black text-gray-900 bg-gray-100 px-3 py-1 rounded-full">{item.total_sold} món</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </main>
            </div>
        </div>
    );
};

const TabButton = ({ active, onClick, icon, label, badge }) => (
    <button onClick={onClick} className={`w-full flex items-center gap-3 p-3.5 rounded-2xl transition-all duration-300 relative group ${
            active ? 'bg-orange-500 text-white shadow-lg shadow-orange-100 scale-[1.02]' : 'text-gray-500 hover:bg-gray-50'
        }`}>
        <span className="flex-shrink-0">{icon}</span>
        <span className="font-bold text-sm hidden sm:inline">{label}</span>
        {badge > 0 && <span className={`absolute top-2 right-2 sm:right-4 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                active ? 'bg-white text-orange-600' : 'bg-red-500 text-white animate-pulse shadow-sm'
            }`}>{badge}</span>}
    </button>
);

const SectionHeader = ({ title, subtitle }) => (
    <div>
        <h2 className="text-2xl font-black text-gray-800 tracking-tight">{title}</h2>
        <p className="text-gray-500 text-sm font-medium mt-0.5">{subtitle}</p>
    </div>
);

const EmptyState = ({ icon, text }) => (
    <div className="col-span-full py-16 flex flex-col items-center justify-center text-gray-400 gap-4">
        <div className="bg-white p-6 rounded-full shadow-inner">{icon}</div>
        <p className="font-bold text-sm tracking-wide">{text}</p>
    </div>
);

const StatCard = ({ icon, label, value, color }) => {
    const colors = {
        orange: 'bg-orange-50 text-orange-600',
        blue: 'bg-blue-50 text-blue-600',
        yellow: 'bg-yellow-50 text-yellow-600'
    };
    return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${colors[color]}`}>
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
                <h4 className="text-xl font-black text-gray-800 mt-1">{value}</h4>
            </div>
        </div>
    );
};

const Award = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
    </svg>
);

export default AdminDashboard;

