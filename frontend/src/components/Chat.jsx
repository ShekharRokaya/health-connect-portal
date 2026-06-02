import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import io from 'socket.io-client';
import axios from '../api/axios';
import { Send, X, MessageSquare, User } from 'lucide-react';

const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');

const Chat = ({ receiverId, receiverName, onClose }) => {
    const { user } = useContext(AuthContext);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const scrollRef = useRef();

    const room = [user._id, receiverId].sort().join('_');

    useEffect(() => {
        socket.emit('join_room', room);

        const fetchMessages = async () => {
            try {
                const res = await axios.get(`/chat/${user._id}/${receiverId}`);
                setMessages(res.data);
            } catch (err) {
                console.error('Failed to fetch messages', err);
            }
        };

        fetchMessages();

        socket.on('receive_message', (data) => {
            if (data.sender === receiverId) {
                setMessages((prev) => [...prev, data]);
            }
        });

        return () => {
            socket.off('receive_message');
        };
    }, [receiverId, room, user._id]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (message.trim() === '') return;

        const messageData = {
            sender: user._id,
            receiver: receiverId,
            message,
            room
        };

        socket.emit('send_message', messageData);
        setMessages((prev) => [...prev, { ...messageData, createdAt: new Date() }]);
        setMessage('');
    };

    return (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10">
                        <User size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm leading-tight">{receiverName}</h3>
                        <p className="text-[10px] text-blue-100 uppercase tracking-widest font-bold">Live Consultation</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition active:scale-90">
                    <X size={20} />
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-grow p-4 h-96 overflow-y-auto bg-gray-50/50 space-y-4">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-50">
                        <MessageSquare size={48} className="mb-2" />
                        <p className="text-sm font-medium">No messages yet. Say hello!</p>
                    </div>
                )}
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.sender === user._id ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm shadow-sm ${
                            m.sender === user._id 
                            ? 'bg-blue-600 text-white rounded-tr-none' 
                            : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                        }`}>
                            <p className="leading-relaxed">{m.message}</p>
                            <p className={`text-[10px] mt-1.5 font-bold uppercase tracking-tighter opacity-60 ${m.sender === user._id ? 'text-blue-100' : 'text-gray-400'}`}>
                                {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                ))}
                <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-100 flex items-center gap-2">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-grow p-3 bg-gray-100 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                />
                <button 
                    type="submit" 
                    className="bg-blue-600 text-white p-3 rounded-2xl hover:bg-blue-700 transition active:scale-95 shadow-md shadow-blue-200 flex-shrink-0"
                >
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
};

export default Chat;
