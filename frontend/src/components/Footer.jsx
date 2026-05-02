import React from 'react';
import { Activity } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-400 mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="bg-blue-600 p-2 rounded-lg"><Activity size={20} className="text-white" /></div>
                            <span className="text-xl font-bold text-white">HealthConnect</span>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed">Your trusted digital healthcare platform. Connecting patients with the right doctors, powered by intelligent technology.</p>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="/" className="hover:text-white transition">Home</a></li>
                            <li><a href="/doctors" className="hover:text-white transition">Find Doctors</a></li>
                            <li><a href="/symptoms" className="hover:text-white transition">Symptom Checker</a></li>
                            <li><a href="/dashboard" className="hover:text-white transition">Dashboard</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Features</h4>
                        <ul className="space-y-2 text-sm">
                            <li>🧠 AI Symptom Analysis</li>
                            <li>🚨 Emergency SOS Alerts</li>
                            <li>💊 Digital Prescriptions</li>
                            <li>📅 Smart Appointment Booking</li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-800 pt-8 text-center">
                    <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} HealthConnect. All rights reserved. Built for Final Year Project.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
