import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Calendar, Clock, MapPin, X } from 'lucide-react';

const FindDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [bookingData, setBookingData] = useState({ date: '', time: '', reason: '' });
    const [bookingMessage, setBookingMessage] = useState('');

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const { data } = await axios.get('/patients/doctors');
                setDoctors(data);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch doctors', err);
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    const handleBook = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/patients/appointments', {
                doctorId: selectedDoctor._id,
                ...bookingData
            });
            setBookingMessage('Appointment booked successfully!');
            setTimeout(() => {
                setSelectedDoctor(null);
                setBookingMessage('');
                setBookingData({ date: '', time: '', reason: '' });
            }, 2000);
        } catch (err) {
            setBookingMessage(err.response?.data?.message || 'Booking failed. Try different time.');
        }
    };

    if (loading) return <div className="p-10 text-center text-gray-500">Loading amazing doctors...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Find Your Doctor</h1>
                <p className="text-gray-500 mt-2">Browse the list of available specialists and book your appointment.</p>
            </div>

            {doctors.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-gray-100">
                    <p className="text-gray-500 text-lg">No doctors are currently available.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {doctors.map(doc => (
                        <div key={doc._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition duration-200">
                            <div className="flex items-center gap-4 mb-4">
                                <img src={`/images/doctor-${doc._id.charCodeAt(doc._id.length - 1) % 2 === 0 ? 'male' : 'female'}.png`} alt={doc.user.name} className="w-16 h-16 rounded-full object-cover border-2 border-blue-100 shadow-md" />
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Dr. {doc.user.name}</h3>
                                    <p className="text-blue-600 font-medium mb-1">{doc.specialization}</p>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl space-y-2 mb-6">
                                <div className="flex justify-between items-center text-sm text-gray-600">
                                    <span className="font-medium text-gray-500">Experience</span>
                                    <span className="font-semibold text-gray-800">{doc.experience} years</span>
                                </div>
                                <div className="flex justify-between items-center text-sm text-gray-600">
                                    <span className="font-medium text-gray-500">Consultation Fee</span>
                                    <span className="font-semibold text-gray-800">${doc.fees}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedDoctor(doc)}
                                className="w-full bg-blue-50 text-blue-600 font-semibold py-3 rounded-xl hover:bg-blue-600 hover:text-white transition duration-200"
                            >
                                Book Appointment
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Booking Modal */}
            {selectedDoctor && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
                        <button onClick={() => setSelectedDoctor(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 bg-gray-100 rounded-full p-1 transition">
                            <X size={20} />
                        </button>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">Book Appointment</h2>
                        <p className="text-gray-500 mb-6 pb-4 border-b border-gray-100">Consultation with <span className="font-semibold text-gray-800">Dr. {selectedDoctor.user.name}</span></p>

                        {bookingMessage && (
                            <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${bookingMessage.includes('success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                {bookingMessage}
                            </div>
                        )}

                        <form onSubmit={handleBook} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 focus-within:text-blue-600">Date</label>
                                    <input type="date" required value={bookingData.date} onChange={e => setBookingData({ ...bookingData, date: e.target.value })} className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 focus-within:text-blue-600">Time</label>
                                    {(() => {
                                        const availableSlots = selectedDoctor.availableTimeSlots?.filter(s => new Date(s.date).toISOString().split('T')[0] === bookingData.date && !s.isBooked) || [];
                                        if (availableSlots.length > 0) {
                                            return (
                                                <select required value={bookingData.time} onChange={e => setBookingData({ ...bookingData, time: e.target.value })} className="w-full border border-gray-200 p-3.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white">
                                                    <option value="">Select an available time</option>
                                                    {availableSlots.map((s, i) => <option key={i} value={s.time}>{s.time}</option>)}
                                                </select>
                                            )
                                        }
                                        return <input type="time" required value={bookingData.time} onChange={e => setBookingData({ ...bookingData, time: e.target.value })} className="w-full border border-gray-200 p-3.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
                                    })()}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5 focus-within:text-blue-600">Reason for visit</label>
                                <textarea required rows="3" value={bookingData.reason} onChange={e => setBookingData({ ...bookingData, reason: e.target.value })} className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none" placeholder="Briefly describe your symptoms..."></textarea>
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3.5 mt-2 rounded-xl hover:bg-blue-700 hover:shadow-lg transition duration-200 active:scale-[0.98]">
                                Confirm Booking
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FindDoctors;
