import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from '../api/axios';
import { Phone, X, AlertTriangle, CheckCircle } from 'lucide-react';

const SOSButton = () => {
    const { user } = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState('');
    const [location, setLocation] = useState('');
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    if (!user || user.role !== 'patient') return null;

    const handleSOS = async () => {
        setLoading(true);
        let finalLocation = location;
        
        try {
            if ("geolocation" in navigator && !finalLocation) {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
                });
                finalLocation = `${position.coords.latitude}, ${position.coords.longitude}`;
            }
        } catch (geoErr) {
            console.warn("Geolocation failed or not permitted:", geoErr);
        }

        try {
            await axios.post('/emergency', {
                message: message || 'Emergency! Patient needs immediate medical attention.',
                location: finalLocation
            });
            setSent(true);
            setTimeout(() => {
                setSent(false);
                setShowModal(false);
                setMessage('');
                setLocation('');
            }, 3000);
        } catch (err) {
            alert('Failed to send SOS. Please try again.');
        }
        setLoading(false);
    };

    return (
        <>
            {/* Floating SOS Button */}
            <button
                onClick={() => setShowModal(true)}
                className="fixed bottom-8 right-8 z-50 bg-red-600 hover:bg-red-700 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 animate-pulse hover:animate-none group"
                title="Emergency SOS"
            >
                <Phone size={28} className="group-hover:rotate-12 transition" />
            </button>

            {/* SOS Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden relative">
                        {/* Red Header */}
                        <div className="bg-gradient-to-r from-red-600 to-rose-600 p-6 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                            <button onClick={() => { setShowModal(false); setSent(false); }} className="absolute top-4 right-4 text-white/80 hover:text-white">
                                <X size={24} />
                            </button>
                            <div className="flex items-center gap-3 relative z-10">
                                <div className="bg-white/20 p-3 rounded-xl">
                                    <AlertTriangle size={28} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-extrabold">Emergency SOS</h2>
                                    <p className="text-red-100 text-sm">Alert all available doctors immediately</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            {sent ? (
                                <div className="text-center py-8">
                                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle size={40} className="text-emerald-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">SOS Sent!</h3>
                                    <p className="text-gray-500">All available doctors have been alerted. Help is on the way.</p>
                                </div>
                            ) : (
                                <>
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="Your Current Location (optional)"
                                        className="w-full border border-gray-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-red-500 mb-4 text-sm bg-gray-50/50"
                                    />
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Describe your emergency (optional)..."
                                        rows="3"
                                        className="w-full border border-gray-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-red-500 resize-none mb-4 text-sm bg-gray-50/50"
                                    />
                                    <button
                                        onClick={handleSOS}
                                        disabled={loading}
                                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition shadow-lg active:scale-[0.98] flex items-center justify-center gap-3 text-lg disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                        ) : (
                                            <>
                                                <AlertTriangle size={22} /> Send Emergency Alert
                                            </>
                                        )}
                                    </button>
                                    <p className="text-xs text-gray-400 text-center mt-3">This will notify all doctors registered on the platform.</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SOSButton;
