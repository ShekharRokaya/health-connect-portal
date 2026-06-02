import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import axios from '../api/axios';
import { CheckCircle, Clock, Calendar, User, Activity, AlertCircle, AlertTriangle, MessageSquare, Trash2, ClipboardList, ShieldAlert } from 'lucide-react';
import Chat from '../components/Chat';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [data, setData] = useState(null);
    const [emergencies, setEmergencies] = useState([]);
    const [activeChat, setActiveChat] = useState(null);

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            try {
                if (user.role === 'patient') {
                    const res = await axios.get('/patients/appointments');
                    setData(res.data);
                    try {
                        const emergRes = await axios.get('/emergency/mine');
                        setEmergencies(emergRes.data);
                    } catch (e) { console.log('No emergency data'); }
                } else if (user.role === 'doctor') {
                    const res = await axios.get('/doctors/appointments');
                    const profileRes = await axios.get('/doctors/profile');
                    setData({ appointments: res.data, profile: profileRes.data });
                    try {
                        const emergRes = await axios.get('/emergency');
                        setEmergencies(emergRes.data);
                    } catch (e) { console.log('No emergency access'); }
                } else if (user.role === 'admin') {
                    const statsRes = await axios.get('/admin/stats');
                    const usersRes = await axios.get('/admin/users');
                    const doctorsRes = await axios.get('/admin/doctors');
                    const appointmentsRes = await axios.get('/admin/appointments');
                    const emergenciesRes = await axios.get('/admin/emergencies');
                    setData({ 
                        stats: statsRes.data, 
                        users: usersRes.data, 
                        doctors: doctorsRes.data,
                        allAppointments: appointmentsRes.data,
                        allEmergencies: emergenciesRes.data
                    });
                }
            } catch (err) {
                console.error('Failed to fetch dashboard data', err);
            }
        };

        fetchData();
    }, [user]);

    if (!user) return <Navigate to="/login" />;

    const handleApptStatus = async (id, status) => {
        try {
            await axios.put(`/doctors/appointments/${id}`, { status });
            alert(`Appointment ${status}!`);
            window.location.reload();
        } catch (err) {
            console.error(err);
        }
    };

    const handleApproveDoctor = async (id) => {
        try {
            await axios.put(`/admin/doctor/approve/${id}`);
            alert('Doctor approved successfully!');
            window.location.reload();
        } catch (err) {
            console.error('Failed to approve doctor', err);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
        try {
            await axios.delete(`/admin/users/${id}`);
            alert('User deleted successfully!');
            window.location.reload();
        } catch (err) {
            console.error('Failed to delete user', err);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-10 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 shadow-xl text-white flex items-center justify-between overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-20 -translate-y-20"></div>
                <div className="relative z-10">
                    <p className="text-blue-100 font-medium mb-1 uppercase tracking-widest text-sm flex items-center gap-2">{user.role} Dashboard</p>
                    <h1 className="text-4xl font-extrabold pb-1">Welcome back, {user.name.split(' ')[0]}!</h1>
                    <p className="text-blue-100 mt-2 text-lg">Here is what's happening with your account today.</p>
                </div>
            </div>

            {!data ? (
                <div className="flex justify-center py-32"><div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div></div>
            ) : (
                <>
                    {/* PATIENT DASHBOARD */}
                    {user.role === 'patient' && (
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-xl"><Calendar size={24} /></div>
                                <h2 className="text-2xl font-bold text-gray-900">Your Medical Appointments</h2>
                            </div>

                            <div className="grid gap-4">
                                {data.map(apt => (
                                    <div key={apt._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-lg transition overflow-hidden">
                                        <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                                            <div className="flex items-center gap-6 w-full sm:w-auto">
                                                <div className="hidden sm:flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl min-w-[80px]">
                                                    <span className="text-sm font-bold text-gray-500 uppercase">{new Date(apt.date).toLocaleString('default', { month: 'short' })}</span>
                                                    <span className="text-2xl font-extrabold text-blue-600">{new Date(apt.date).getDate()}</span>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2">Dr. {apt.doctor?.user?.name || 'Unknown'}</h3>
                                                    <p className="text-gray-500 font-medium flex items-center gap-2 mt-1"><Clock size={16} /> {apt.time}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center w-full sm:w-auto justify-start sm:justify-end">
                                                <div className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold tracking-wide
                                                    ${apt.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                                        apt.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                                            'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                                                    {apt.status === 'approved' && <CheckCircle size={18} />}
                                                    {apt.status === 'pending' && <Clock size={18} />}
                                                    {apt.status === 'rejected' && <AlertCircle size={18} />}
                                                    {apt.status.toUpperCase()}
                                                </div>
                                                {apt.status === 'approved' && (
                                                    <button 
                                                        onClick={() => setActiveChat({ id: apt.doctor?.user?._id, name: `Dr. ${apt.doctor?.user?.name}` })}
                                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition ml-2 shadow-md active:scale-95"
                                                    >
                                                        <MessageSquare size={16} /> Chat
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        {apt.prescription && (
                                            <div className="px-6 pb-6 pt-2 bg-gradient-to-r from-emerald-50 to-teal-50 border-t border-emerald-100/50">
                                                <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-2 flex items-center gap-2"><Activity size={14} /> Doctor's Medical Notes</h4>
                                                <p className="text-gray-700 text-sm italic font-medium leading-relaxed bg-white/50 p-4 rounded-xl border border-emerald-100/50 shadow-sm">"{apt.prescription}"</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {data.length === 0 && (
                                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                                        <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4"><Calendar size={32} /></div>
                                        <p className="text-gray-500 font-medium text-lg">You have no scheduled appointments.</p>
                                    </div>
                                )}
                            </div>

                            {/* Patient Emergency SOS Status */}
                            {emergencies.length > 0 && (
                                <div className="mt-10">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-red-100 text-red-600 rounded-xl"><AlertTriangle size={24} /></div>
                                        <h2 className="text-2xl font-bold text-gray-900">My Emergency Alerts</h2>
                                    </div>
                                    <div className="grid gap-4">
                                        {emergencies.map(em => (
                                            <div key={em._id} className={`rounded-2xl p-6 border-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition ${em.status === 'responded' ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
                                                }`}>
                                                <div>
                                                    <p className="font-semibold text-gray-800">{em.message}</p>
                                                    {em.location && <p className="text-sm text-gray-700 font-medium mt-1">📍 {em.location}</p>}
                                                    <p className="text-sm text-gray-500 mt-1">{new Date(em.createdAt).toLocaleString()}</p>
                                                </div>
                                                <div className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold ${em.status === 'responded'
                                                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                                    : 'bg-red-100 text-red-700 border border-red-200 animate-pulse'
                                                    }`}>
                                                    {em.status === 'responded' ? <><CheckCircle size={18} /> Responded by Dr. {em.respondedBy?.name || 'Unknown'}</> : <><Clock size={18} /> Waiting for Response</>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* DOCTOR DASHBOARD */}
                    {user.role === 'doctor' && (
                        <div className="space-y-12">
                            {/* Emergency Alerts Section */}
                            {emergencies.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-red-100 text-red-600 rounded-xl animate-pulse"><AlertTriangle size={24} /></div>
                                        <h2 className="text-2xl font-bold text-red-700">🚨 Emergency Alerts ({emergencies.length})</h2>
                                    </div>
                                    <div className="grid gap-4">
                                        {emergencies.map(em => (
                                            <div key={em._id} className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-lg transition">
                                                <div>
                                                    <h3 className="font-bold text-lg text-red-900 flex items-center gap-2"><AlertTriangle size={18} /> {em.patient?.name}</h3>
                                                    <p className="text-red-700 text-sm mt-1">{em.message}</p>
                                                    {em.location && <p className="text-red-800 font-bold text-sm mt-1">📍 Location: {em.location}</p>}
                                                    <p className="text-red-400 text-xs mt-2">{new Date(em.createdAt).toLocaleString()}</p>
                                                </div>
                                                <button
                                                    onClick={async () => {
                                                        try {
                                                            await axios.put(`/emergency/${em._id}/respond`);
                                                            alert('You have responded to this emergency!');
                                                            setEmergencies(emergencies.filter(e => e._id !== em._id));
                                                        } catch (err) { alert('Failed to respond'); }
                                                    }}
                                                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition active:scale-95 shadow-md whitespace-nowrap flex items-center gap-2"
                                                >
                                                    <CheckCircle size={18} /> Respond Now
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-purple-100 text-purple-600 rounded-xl"><Calendar size={24} /></div>
                                    <h2 className="text-2xl font-bold text-gray-900">Manage Availability</h2>
                                </div>
                                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm grid md:grid-cols-2 gap-8">
                                    <form onSubmit={async (e) => {
                                        e.preventDefault();
                                        const date = e.target.date.value;
                                        const time = e.target.time.value;
                                        try {
                                            const newSlots = [...(data.profile.availableTimeSlots || []), { date, time, isBooked: false }];
                                            await axios.put('/doctors/profile', { availableTimeSlots: newSlots });
                                            alert('Time slot added successfully!');
                                            window.location.reload();
                                        } catch (err) { alert('Failed to add slot'); }
                                    }} className="space-y-4">
                                        <h3 className="font-bold text-lg text-gray-700">Add New Slot</h3>
                                        <div>
                                            <label className="block text-sm font-semibold mb-1 text-gray-600">Date</label>
                                            <input type="date" required name="date" className="w-full border border-gray-200 p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-1 text-gray-600">Time</label>
                                            <input type="time" required name="time" className="w-full border border-gray-200 p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 mx-0 rounded-xl transition shadow-md active:scale-95">Add Available Slot</button>
                                    </form>

                                    <div>
                                        <h3 className="font-bold text-lg text-gray-700 mb-4">Your Active Slots</h3>
                                        <div className="max-h-[290px] overflow-y-auto space-y-3 pr-4">
                                            {(!data.profile?.availableTimeSlots || data.profile.availableTimeSlots.length === 0) && <p className="text-gray-500 py-6 border border-dashed rounded-xl text-center">No active slots defined.</p>}
                                            {data.profile?.availableTimeSlots?.map((slot, i) => (
                                                <div key={i} className={`flex items-center justify-between p-4 rounded-xl border ${slot.isBooked ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-100 hover:shadow-md transition'}`}>
                                                    <span className="font-semibold text-gray-800">{new Date(slot.date).toLocaleDateString()} <span className="text-gray-400 mx-2">|</span> {slot.time}</span>
                                                    <span className={`text-xs font-bold uppercase px-3 py-1.5 rounded-lg tracking-wider ${slot.isBooked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{slot.isBooked ? 'Booked' : 'Available'}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Patient Requests */}
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl"><User size={24} /></div>
                                    <h2 className="text-2xl font-bold text-gray-900">Patient Requests</h2>
                                </div>
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {data.appointments.map(apt => (
                                        <div key={apt._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full relative overflow-hidden">
                                            <div className={`absolute top-0 left-0 w-full h-1 ${apt.status === 'approved' ? 'bg-emerald-500' : apt.status === 'pending' ? 'bg-amber-500' : 'bg-rose-500'}`}></div>

                                            <div className="flex justify-between items-start mb-6 mt-2">
                                                <div>
                                                    <h3 className="font-bold text-xl text-gray-900">{apt.patient?.name}</h3>
                                                    <p className="text-gray-500 text-sm mt-0.5">{apt.patient?.email}</p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider
                                                    ${apt.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : apt.status === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'}`}>
                                                    {apt.status}
                                                </span>
                                                <button 
                                                    onClick={() => setActiveChat({ id: apt.patient?._id, name: apt.patient?.name })}
                                                    className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition active:scale-95"
                                                    title="Chat with Patient"
                                                >
                                                    <MessageSquare size={20} />
                                                </button>
                                            </div>
                                            <div className="bg-[#F8FAFC] p-4 rounded-2xl mb-6 flex-grow">
                                                <div className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                                                    <Calendar size={18} className="text-blue-500" /> {new Date(apt.date).toLocaleDateString()}
                                                    <span className="text-gray-300">|</span>
                                                    <Clock size={18} className="text-blue-500" /> {apt.time}
                                                </div>
                                                {apt.reason && <p className="text-gray-600 mt-3 text-sm leading-relaxed border-t border-gray-200 pt-3 flex gap-2"><Activity size={16} className="text-gray-400 flex-shrink-0 mt-0.5" /> <span className="italic">"{apt.reason}"</span></p>}
                                            </div>
                                            {apt.status === 'pending' && (
                                                <div className="flex gap-3 mt-auto">
                                                    <button onClick={() => handleApptStatus(apt._id, 'approved')} className="flex-1 bg-gray-900 border border-gray-900 text-white px-4 py-3 rounded-xl hover:bg-black transition font-bold shadow-md active:scale-95 flex items-center justify-center gap-2"><CheckCircle size={18} /> Approve</button>
                                                    <button onClick={() => handleApptStatus(apt._id, 'rejected')} className="flex-1 bg-white border border-gray-200 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-50 hover:text-rose-600 active:scale-95 transition font-bold flex items-center justify-center gap-2"><AlertCircle size={18} /> Decline</button>
                                                </div>
                                            )}
                                            {apt.status === 'approved' && !apt.prescription && (
                                                <form className="mt-auto border-t border-gray-100 pt-4" onSubmit={async (e) => {
                                                    e.preventDefault();
                                                    try {
                                                        await axios.put(`/doctors/appointments/${apt._id}/prescription`, { prescription: e.target.prescription.value });
                                                        alert('Medical Notes saved successfully!');
                                                        window.location.reload();
                                                    } catch (err) { alert('Failed to save notes.'); }
                                                }}>
                                                    <textarea required name="prescription" placeholder="Write prescription / medical notes to the patient..." rows="3" className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none mb-3 bg-emerald-50/30"></textarea>
                                                    <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-2.5 rounded-xl hover:bg-emerald-700 transition shadow-sm active:scale-95">Save Medical Note</button>
                                                </form>
                                            )}
                                            {apt.prescription && (
                                                <div className="mt-auto border-t border-gray-100 pt-4">
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /> Written Note</p>
                                                    <p className="text-gray-700 text-sm italic py-2">"{apt.prescription}"</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {data.appointments.length === 0 && (
                                        <div className="col-span-full py-16 bg-white border border-dashed border-gray-200 rounded-3xl text-center">
                                            <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4"><Clock size={32} /></div>
                                            <p className="text-gray-500 font-medium text-lg">Your schedule is currently empty.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ADMIN DASHBOARD */}
                    {user.role === 'admin' && (
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1">
                                    <p className="text-blue-100 font-medium text-lg mb-2">Total Users</p>
                                    <div className="flex items-end justify-between">
                                        <h3 className="text-5xl font-extrabold">{data.stats.usersCount}</h3>
                                        <User size={40} className="text-white/30" />
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-emerald-400 to-teal-600 text-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1">
                                    <p className="text-emerald-100 font-medium text-lg mb-2">Total Doctors</p>
                                    <div className="flex items-end justify-between">
                                        <h3 className="text-5xl font-extrabold">{data.stats.doctorsCount}</h3>
                                        <Activity size={40} className="text-white/30" />
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1">
                                    <p className="text-purple-100 font-medium text-lg mb-2">Appointments</p>
                                    <div className="flex items-end justify-between">
                                        <h3 className="text-5xl font-extrabold">{data.stats.appointmentsCount}</h3>
                                        <Calendar size={40} className="text-white/30" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-gray-100 text-gray-600 rounded-xl"><User size={24} /></div>
                                <h2 className="text-2xl font-bold text-gray-900">System Users</h2>
                            </div>
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-12">
                                <table className="w-full text-left">
                                    <thead className="bg-[#F8FAFC] border-b border-gray-100">
                                        <tr>
                                            <th className="p-6 font-semibold text-gray-500 text-sm uppercase tracking-wider">User Name</th>
                                            <th className="p-6 font-semibold text-gray-500 text-sm uppercase tracking-wider">Email Address</th>
                                            <th className="p-6 font-semibold text-gray-500 text-sm uppercase tracking-wider">Role Type</th>
                                            <th className="p-6 font-semibold text-gray-500 text-sm uppercase tracking-wider text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {data.users.map(u => (
                                            <tr key={u._id} className="hover:bg-blue-50/50 transition">
                                                <td className="p-6 font-bold text-gray-900 flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">{u.name.charAt(0)}</div>
                                                    {u.name}
                                                </td>
                                                <td className="p-6 text-gray-600 font-medium">{u.email}</td>
                                                <td className="p-6">
                                                    <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wider uppercase
                                                        ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                                            u.role === 'doctor' ? 'bg-emerald-100 text-emerald-700' :
                                                                'bg-blue-100 text-blue-700'}`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="p-6 text-right">
                                                    {u._id !== user._id && (
                                                        <button 
                                                            onClick={() => handleDeleteUser(u._id)}
                                                            className="text-rose-500 hover:text-rose-700 p-2 hover:bg-rose-50 rounded-lg transition"
                                                            title="Delete User"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl"><Activity size={24} /></div>
                                <h2 className="text-2xl font-bold text-gray-900">Doctor Management</h2>
                            </div>
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-12">
                                <table className="w-full text-left">
                                    <thead className="bg-[#F8FAFC] border-b border-gray-100">
                                        <tr>
                                            <th className="p-6 font-semibold text-gray-500 text-sm uppercase tracking-wider">Doctor Name</th>
                                            <th className="p-6 font-semibold text-gray-500 text-sm uppercase tracking-wider">Specialization</th>
                                            <th className="p-6 font-semibold text-gray-500 text-sm uppercase tracking-wider">Status</th>
                                            <th className="p-6 font-semibold text-gray-500 text-sm uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {data.doctors.map(doc => (
                                            <tr key={doc._id} className="hover:bg-emerald-50/50 transition">
                                                <td className="p-6 font-bold text-gray-900">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">D</div>
                                                        <div>
                                                            <p>Dr. {doc.user?.name}</p>
                                                            <p className="text-xs text-gray-500 font-normal">{doc.user?.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-6 text-gray-600 font-medium">{doc.specialization}</td>
                                                <td className="p-6">
                                                    <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${doc.isApproved ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                        {doc.isApproved ? 'Approved' : 'Pending'}
                                                    </span>
                                                </td>
                                                <td className="p-6 text-right">
                                                    {!doc.isApproved && (
                                                        <button 
                                                            onClick={() => handleApproveDoctor(doc._id)}
                                                            className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-black transition active:scale-95"
                                                        >
                                                            Approve Doctor
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-xl"><ClipboardList size={24} /></div>
                                <h2 className="text-2xl font-bold text-gray-900">Appointment Monitoring</h2>
                            </div>
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-12">
                                <table className="w-full text-left">
                                    <thead className="bg-[#F8FAFC] border-b border-gray-100">
                                        <tr>
                                            <th className="p-6 font-semibold text-gray-500 text-sm uppercase tracking-wider">Patient</th>
                                            <th className="p-6 font-semibold text-gray-500 text-sm uppercase tracking-wider">Doctor</th>
                                            <th className="p-6 font-semibold text-gray-500 text-sm uppercase tracking-wider">Date/Time</th>
                                            <th className="p-6 font-semibold text-gray-500 text-sm uppercase tracking-wider text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {data.allAppointments.map(apt => (
                                            <tr key={apt._id} className="hover:bg-gray-50 transition">
                                                <td className="p-6 font-medium text-gray-900">{apt.patient?.name}</td>
                                                <td className="p-6 text-gray-600">Dr. {apt.doctor?.user?.name}</td>
                                                <td className="p-6 text-gray-500 text-sm">
                                                    {new Date(apt.date).toLocaleDateString()} at {apt.time}
                                                </td>
                                                <td className="p-6 text-right">
                                                    <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider 
                                                        ${apt.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : 
                                                          apt.status === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'}`}>
                                                        {apt.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-red-100 text-red-600 rounded-xl"><ShieldAlert size={24} /></div>
                                <h2 className="text-2xl font-bold text-gray-900">Emergency SOS Logs</h2>
                            </div>
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-[#F8FAFC] border-b border-gray-100">
                                        <tr>
                                            <th className="p-6 font-semibold text-gray-500 text-sm uppercase tracking-wider">Patient</th>
                                            <th className="p-6 font-semibold text-gray-500 text-sm uppercase tracking-wider">Message</th>
                                            <th className="p-6 font-semibold text-gray-500 text-sm uppercase tracking-wider">Location</th>
                                            <th className="p-6 font-semibold text-gray-500 text-sm uppercase tracking-wider">Responded By</th>
                                            <th className="p-6 font-semibold text-gray-500 text-sm uppercase tracking-wider text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {data.allEmergencies.map(em => (
                                            <tr key={em._id} className="hover:bg-red-50/30 transition">
                                                <td className="p-6 font-medium text-gray-900">{em.patient?.name}</td>
                                                <td className="p-6 text-gray-600 text-sm italic">"{em.message}"</td>
                                                <td className="p-6 text-gray-800 text-sm font-medium">{em.location || 'N/A'}</td>
                                                <td className="p-6 text-gray-500 text-sm">
                                                    {em.respondedBy ? `Dr. ${em.respondedBy.name}` : 'Not Responded'}
                                                </td>
                                                <td className="p-6 text-right">
                                                    <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider 
                                                        ${em.status === 'responded' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700 animate-pulse'}`}>
                                                        {em.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}
            {activeChat && (
                <Chat 
                    receiverId={activeChat.id} 
                    receiverName={activeChat.name} 
                    onClose={() => setActiveChat(null)} 
                />
            )}
        </div>
    );
};

export default Dashboard;
