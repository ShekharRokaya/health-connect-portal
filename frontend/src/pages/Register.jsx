import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, Stethoscope, Briefcase, DollarSign, Activity } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'patient', specialization: '', experience: '', fees: '' });
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register(formData);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-50"></div>
            <div className="absolute top-20 right-20 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute bottom-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

            <div className="relative z-10 w-full max-w-md">
                {/* Logo Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-xl mb-4">
                        <Activity size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Create Account</h1>
                    <p className="text-gray-500 mt-2">Join HealthConnect and start your healthcare journey</p>
                </div>

                {/* Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 text-sm font-medium flex items-center gap-2">
                            <span className="text-red-500">⚠️</span> {error}
                        </div>
                    )}
                    <form onSubmit={submitHandler} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"><User size={16} className="text-gray-400" /> Full Name</label>
                            <input type="text" required className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50/50 transition shadow-sm" placeholder="John Doe" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"><Mail size={16} className="text-gray-400" /> Email Address</label>
                            <input type="email" required className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50/50 transition shadow-sm" placeholder="your@email.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"><Lock size={16} className="text-gray-400" /> Password</label>
                            <input type="password" required className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50/50 transition shadow-sm" placeholder="••••••••" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                        </div>

                        {/* Role Selector */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">I am a...</label>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { value: 'patient', label: 'Patient', icon: '🏥' },
                                    { value: 'doctor', label: 'Doctor', icon: '👨‍⚕️' },
                                    { value: 'admin', label: 'Admin', icon: '⚙️' }
                                ].map(role => (
                                    <button
                                        key={role.value}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: role.value })}
                                        className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${formData.role === role.value
                                                ? 'border-emerald-500 bg-emerald-50 shadow-md scale-[1.02]'
                                                : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                                            }`}
                                    >
                                        <span className="text-2xl block mb-1">{role.icon}</span>
                                        <span className={`text-sm font-bold ${formData.role === role.value ? 'text-emerald-700' : 'text-gray-600'}`}>{role.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Doctor Fields */}
                        {formData.role === 'doctor' && (
                            <div className="bg-blue-50/50 p-5 rounded-2xl space-y-4 border border-blue-100">
                                <h3 className="text-sm font-bold text-blue-700 uppercase tracking-wider flex items-center gap-2"><Stethoscope size={16} /> Doctor Details</h3>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2"><Stethoscope size={14} className="text-gray-400" /> Specialization</label>
                                    <input type="text" required className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white shadow-sm" value={formData.specialization} onChange={e => setFormData({ ...formData, specialization: e.target.value })} placeholder="e.g. Cardiologist" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2"><Briefcase size={14} className="text-gray-400" /> Experience</label>
                                        <input type="number" required min="0" className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white shadow-sm" value={formData.experience} onChange={e => setFormData({ ...formData, experience: Number(e.target.value) })} placeholder="Years" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2"><DollarSign size={14} className="text-gray-400" /> Fee ($)</label>
                                        <input type="number" required min="0" className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white shadow-sm" value={formData.fees} onChange={e => setFormData({ ...formData, fees: Number(e.target.value) })} placeholder="50" />
                                    </div>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-3 text-lg disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                            ) : (
                                <><UserPlus size={22} /> Create Account</>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <p className="text-gray-500">Already have an account? <Link to="/login" className="text-blue-600 hover:text-blue-700 font-bold hover:underline">Sign In</Link></p>
                    </div>
                </div>

                {/* Footer badge */}
                <div className="text-center mt-6">
                    <span className="inline-flex items-center gap-1.5 text-xs text-gray-400 font-medium">Powered by HealthConnect</span>
                </div>
            </div>
        </div>
    );
};

export default Register;
