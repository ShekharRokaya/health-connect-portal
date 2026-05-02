import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Activity } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-700 transition">
                            <Activity size={24} className="text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">HealthConnect</span>
                    </Link>
                    <div className="flex items-center gap-6">
                        {user ? (
                            <>
                                <span className="text-gray-600 font-medium">Hello, <span className="font-bold text-gray-800">{user.name}</span> <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full uppercase ml-1">{user.role}</span></span>
                                {user.role === 'patient' && <Link to="/doctors" className="text-gray-600 hover:text-blue-600 font-semibold transition">Find Doctors</Link>}
                                <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 font-semibold transition">Dashboard</Link>
                                <Link to="/symptoms" className="text-gray-600 hover:text-blue-600 font-semibold transition">Symptom Checker</Link>
                                <button onClick={handleLogout} className="text-red-500 font-semibold hover:text-red-700 transition">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-600 hover:text-blue-600 font-semibold transition">Sign In</Link>
                                <Link to="/register" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 hover:shadow-lg transition">Get Started</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
