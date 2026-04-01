import React from 'react';
import useStore from './store/useStore';
import WelcomeScreen from './components/WelcomeScreen';
import MenuScreen from './components/MenuScreen';
import OrderStatus from './components/OrderStatus';
import CartDrawer from './components/CartDrawer';
import { ShoppingCart, ClipboardList } from 'lucide-react';

import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const { currentView, tableNumber, cart, setCartOpen, setView, admin } = useStore();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // If on admin view and not logged in, force login (except if already on adminLogin)
  const isAdminView = currentView.startsWith('admin');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative w-full h-full font-sans">
      {/* Customer Header */}
      {tableNumber && !isAdminView && (
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md shadow-sm px-4 py-3 flex justify-between items-center border-b border-gray-100">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">SpicyMenu</h1>
            <p className="text-sm text-gray-500 font-medium">Bàn đang ngồi: {tableNumber}</p>
          </div>
          {currentView !== 'welcome' && (
            <div className="flex items-center space-x-1 border border-gray-100 bg-gray-50/50 p-1 rounded-2xl shadow-inner">
               <button 
                onClick={() => setView('orderStatus')}
                className={`p-2 rounded-xl transition-colors flex items-center ${currentView === 'orderStatus' ? 'bg-white shadow text-orange-500' : 'text-gray-500 hover:text-gray-800'}`}
              >
                <ClipboardList className="w-5 h-5" />
                <span className="text-xs font-bold ml-1 hidden sm:inline">Đơn Hàng</span>
              </button>
              
              <button 
                onClick={() => {
                  setView('menu');
                  setCartOpen(true);
                }}
                className={`relative p-2 rounded-xl transition-colors flex items-center ${currentView === 'menu' && !totalItems ? 'bg-white shadow text-orange-500' : 'text-gray-500 hover:text-gray-800'}`}
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="text-xs font-bold ml-1 hidden sm:inline">Thực Đơn</span>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center transform scale-100 animate-pulse ring-2 ring-white">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          )}
        </header>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center overflow-hidden relative w-full">
        {currentView === 'welcome' && <WelcomeScreen />}
        {currentView === 'menu' && <MenuScreen />}
        {currentView === 'orderStatus' && <OrderStatus />}
        {currentView === 'adminLogin' && <AdminLogin />}
        {currentView === 'adminDashboard' && <AdminDashboard />}
      </main>

      {/* Global Modals */}
      {!isAdminView && <CartDrawer />}
    </div>
  );
}


export default App;
