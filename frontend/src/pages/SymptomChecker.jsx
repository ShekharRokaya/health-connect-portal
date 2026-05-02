import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import { Brain, Search, Stethoscope, ArrowRight, Sparkles, AlertCircle, Activity } from 'lucide-react';

const SymptomChecker = () => {
    const { user } = useContext(AuthContext);
    const [symptoms, setSymptoms] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);

    if (!user) return <Navigate to="/login" />;

    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!symptoms.trim()) return;
        setLoading(true);
        setResults(null);
        try {
            const res = await axios.post('/symptoms/check', { symptoms });
            setTimeout(() => {
                setResults(res.data.results);
                setLoading(false);
            }, 1500);
        } catch (err) {
            alert('Analysis failed. Please try again.');
            setLoading(false);
        }
    };

    const getConfidenceColor = (confidence) => {
        if (confidence >= 80) return 'from-emerald-500 to-green-500';
        if (confidence >= 50) return 'from-amber-500 to-yellow-500';
        return 'from-blue-500 to-indigo-500';
    };

    const getConfidenceBg = (confidence) => {
        if (confidence >= 80) return 'bg-emerald-50 border-emerald-100 text-emerald-700';
        if (confidence >= 50) return 'bg-amber-50 border-amber-100 text-amber-700';
        return 'bg-blue-50 border-blue-100 text-blue-700';
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            {/* Hero Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-bold mb-6 border border-blue-100">
                    <Sparkles size={16} /> AI-Powered Health Analysis
                </div>
                <h1 className="text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                    Symptom <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Checker</span>
                </h1>
                <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                    Describe your symptoms in your own words and our intelligent engine will recommend the right specialist doctor for you.
                </p>
            </div>

            {/* Input Section */}
            <form onSubmit={handleAnalyze} className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600"></div>

                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl"><Brain size={24} /></div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Describe Your Symptoms</h2>
                        <p className="text-gray-400 text-sm">Be as detailed as possible for accurate results</p>
                    </div>
                </div>

                <textarea
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="Example: I have been experiencing severe headaches, dizziness, and occasional blurry vision for the past week..."
                    rows="4"
                    className="w-full border border-gray-200 p-5 rounded-2xl text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 resize-none text-base bg-gray-50/50 mb-6 placeholder:text-gray-400"
                    required
                />

                <button
                    type="submit"
                    disabled={loading || !symptoms.trim()}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-2xl transition shadow-lg active:scale-[0.98] flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                            Analyzing Symptoms...
                        </>
                    ) : (
                        <>
                            <Search size={22} /> Analyze My Symptoms
                        </>
                    )}
                </button>
            </form>

            {/* Loading Animation */}
            {loading && (
                <div className="text-center py-16">
                    <div className="relative inline-flex">
                        <div className="w-20 h-20 rounded-full border-4 border-blue-100 animate-pulse"></div>
                        <Brain size={36} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600 animate-bounce" />
                    </div>
                    <p className="text-gray-500 font-semibold mt-6 text-lg">Our AI is analyzing your symptoms...</p>
                    <p className="text-gray-400 text-sm mt-1">Matching against our medical knowledge base</p>
                </div>
            )}

            {/* Results Section */}
            {results && !loading && (
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl"><Activity size={24} /></div>
                        <h2 className="text-2xl font-bold text-gray-900">Recommended Specialists</h2>
                    </div>

                    <div className="grid gap-5">
                        {results.map((result, index) => (
                            <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden group">
                                <div className="flex flex-col sm:flex-row">
                                    {/* Confidence Bar */}
                                    <div className={`sm:w-32 flex sm:flex-col items-center justify-center p-6 bg-gradient-to-br ${getConfidenceColor(result.confidence)} text-white`}>
                                        <span className="text-4xl font-extrabold">{result.confidence}%</span>
                                        <span className="text-xs font-bold uppercase tracking-widest opacity-80 mt-1">match</span>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <Stethoscope size={22} className="text-blue-600" />
                                                <h3 className="text-xl font-extrabold text-gray-900">{result.specialization}</h3>
                                                {index === 0 && <span className="text-xs bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full font-bold border border-yellow-200">Top Match</span>}
                                            </div>
                                            <p className="text-gray-500 font-medium mb-3">{result.description}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {result.matchedKeywords.map((kw, i) => (
                                                    <span key={i} className={`text-xs font-bold px-3 py-1.5 rounded-full border ${getConfidenceBg(result.confidence)}`}>
                                                        {kw}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <Link
                                            to="/doctors"
                                            className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition active:scale-95 whitespace-nowrap shadow-md"
                                        >
                                            Find Doctors <ArrowRight size={18} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Disclaimer */}
                    <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
                        <AlertCircle size={24} className="text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold text-amber-800 mb-1">Medical Disclaimer</p>
                            <p className="text-amber-700 text-sm leading-relaxed">This is an AI-powered analysis tool and should not replace professional medical advice. Please consult with a qualified healthcare provider for accurate diagnosis and treatment.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SymptomChecker;
