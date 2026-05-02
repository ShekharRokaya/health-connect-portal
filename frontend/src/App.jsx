import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FindDoctors from './pages/FindDoctors';
import SymptomChecker from './pages/SymptomChecker';
import SOSButton from './components/SOSButton';
import Footer from './components/Footer';

function App() {
    // Force Vite Hot Reload
    return (
        <AuthProvider>
            <BrowserRouter>
                <div className="min-h-screen bg-[#F8FAFC] text-gray-900 font-sans selection:bg-blue-200 flex flex-col">
                    <Navbar />
                    <div className="flex-grow">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/doctors" element={<FindDoctors />} />
                            <Route path="/symptoms" element={<SymptomChecker />} />
                        </Routes>
                    </div>
                    <SOSButton />
                    <Footer />
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
