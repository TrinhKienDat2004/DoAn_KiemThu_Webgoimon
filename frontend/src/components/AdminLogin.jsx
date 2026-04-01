import React, { useState } from 'react';
import axios from 'axios';
import useStore from '../store/useStore';
import { Lock, User, ChevronRight, AlertCircle } from 'lucide-react';

const AdminLogin = () => {
    const { setAdmin, setView } = useStore();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await axios.post('http://localhost:5000/api/admin/login', { username, password });
            setAdmin(res.data.admin);
            setView('adminDashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Đăng nhập thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-sm mx-auto px-4 animate-fade-in">
            <div className="bg-white w-full rounded-3xl shadow-xl p-8 border border-gray-100">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-4">
                        <Lock className="w-8 h-8 text-orange-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 text-center">Quản Trị Viên</h2>
                    <p className="text-gray-500 text-sm">Vui lòng đăng nhập để tiếp tục</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm font-medium animate-shake">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Tài khoản</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                            <input 
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-500 focus:bg-white rounded-xl py-3 pl-12 pr-4 outline-none transition-all text-gray-700 font-medium"
                                placeholder="Nhập tên đăng nhập"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Mật khẩu</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                            <input 
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-500 focus:bg-white rounded-xl py-3 pl-12 pr-4 outline-none transition-all text-gray-700 font-medium"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl shadow-lg mt-4 hover:shadow-orange-200 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:translate-y-0 disabled:shadow-none"
                    >
                        {loading ? 'Đang xác thực...' : 'Đăng Nhập'}
                        {!loading && <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>

                <button 
                    onClick={() => setView('welcome')}
                    className="w-full text-center mt-8 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
                >
                    Quay lại trang chủ
                </button>
            </div>
        </div>
    );
};

export default AdminLogin;
