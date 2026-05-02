import React, { useContext, useEffect, useState } from 'react';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Activity, Clock, ShieldCheck, Sparkles } from 'lucide-react';

const Home = () => {
    const { user } = useContext(AuthContext);
    const [doctors, setDoctors] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const { data } = await axios.get('/patients/doctors');
                setDoctors(data);
            } catch (error) {
                console.error("Error fetching doctors", error);
            }
        };
        if (user && user.role === 'patient') {
            fetchDoctors();
        }
    }, [user]);

    const bookAppointment = (doctorId) => {
        navigate('/doctors');
    };

    return (
        <div className="flex flex-col items-center bg-[#F8FAFC]">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-900 w-full pt-32 pb-40 px-4 overflow-hidden shadow-2xl mb-16 rounded-b-[4rem]">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>

                <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-12 px-4">
                    <div className="flex-1 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-100 text-sm font-semibold mb-8">
                            <Sparkles size={16} /> Welcome to the Future of Healthcare
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight text-white drop-shadow-lg">
                            Modern Healthcare <br /><span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">Simplified.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-blue-100 max-w-xl leading-relaxed mb-12 drop-shadow">
                            Manage your medical appointments seamlessly. Connect with certified, world-class professionals.
                        </p>
                        {!user && (
                            <div className="flex justify-center md:justify-start gap-4">
                                <button onClick={() => navigate('/register')} className="group flex items-center justify-center gap-2 bg-white text-blue-900 px-8 py-4 rounded-full font-bold hover:bg-blue-50 transition transform hover:-translate-y-1 hover:shadow-2xl shadow-xl">
                                    Get Started Today <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="hidden md:block flex-1">
                        <img src="/images/doctors-team.png" alt="Our Medical Team" className="rounded-3xl shadow-2xl border-4 border-white/20 w-full max-w-md mx-auto hover:scale-[1.02] transition-transform duration-500" />
                    </div>
                </div>
            </div>

            {/* Feature Highlights */}
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 -mt-28 relative z-20 mb-20">
                <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white">
                    <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                        <Activity size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Expert Doctors</h3>
                    <p className="text-gray-600">Access to highly qualified and thoroughly verified medical professionals across various specialties.</p>
                </div>
                <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white">
                    <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                        <Clock size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Booking</h3>
                    <p className="text-gray-600">Skip the waiting room. Book your appointments instantly and manage them from your dashboard.</p>
                </div>
                <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white">
                    <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                        <ShieldCheck size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Secure & Private</h3>
                    <p className="text-gray-600">Your health data is encrypted and strictly protected following the highest security standards.</p>
                </div>
            </div>

            {/* Top Providers Section */}
            {user?.role === 'patient' && (
                <div className="w-full max-w-7xl mx-auto px-4 mb-24">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Top Providers</h2>
                            <p className="text-gray-500 mt-2 text-lg">Highly rated doctors available for consultation</p>
                        </div>
                        <button onClick={() => navigate('/doctors')} className="hidden md:flex items-center text-blue-600 font-bold hover:text-blue-800 transition">
                            View All <ArrowRight size={20} className="ml-1" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {doctors.slice(0, 3).map(doc => (
                            <div key={doc._id} className="group bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                                <div className="flex items-center gap-5 mb-5">
                                    <img src={`/images/doctor-${doc._id.charCodeAt(doc._id.length - 1) % 2 === 0 ? 'male' : 'female'}.png`} alt={doc.user.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-100 shadow-md" />
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 group-hover:from-blue-700 group-hover:to-indigo-700 transition-all">{doc.user.name}</h3>
                                        <p className="text-blue-600 font-semibold">{doc.specialization}</p>
                                    </div>
                                </div>
                                <p className="text-gray-500 text-sm mb-6 leading-relaxed">Highly experienced professional with <span className="font-bold text-gray-700">{doc.experience} years</span> of delivering quality healthcare.</p>
                                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl group-hover:bg-blue-50/50 transition">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-500 font-semibold tracking-wider">FEE</span>
                                        <span className="text-2xl font-bold text-gray-900">${doc.fees}</span>
                                    </div>
                                    <button onClick={() => bookAppointment(doc._id)} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-md group-hover:shadow-lg">
                                        Book Slot
                                    </button>
                                </div>
                            </div>
                        ))}
                        {doctors.length === 0 && (
                            <div className="col-span-3 text-center bg-white p-16 rounded-3xl shadow-sm border border-dashed border-gray-200">
                                <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4"><Activity size={32} /></div>
                                <p className="text-gray-500 text-xl font-medium">No approved doctors available. Check back soon!</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
