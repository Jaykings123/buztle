import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiUser, FiPhone, FiZap } from 'react-icons/fi';
import { register, login } from '../api/client';
import { useAuth } from '../context/AuthContext';
import ParticleBackground from '../components/ParticleBackground';
import MagneticButton from '../components/MagneticButton';

const Auth = () => {
    const navigate = useNavigate();
    const { login: authLogin } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);

    // Login form
    const [loginData, setLoginData] = useState({
        identifier: '', // email or phone
        password: ''
    });

    // Registration form
    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'VOLUNTEER'
    });

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await login(loginData.identifier, loginData.password);
            toast.success('Login successful!');
            authLogin(res.data.token, res.data.user);
            navigate('/dashboard');
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Login failed';
            if (err.response?.data?.emailVerified === false) {
                toast.error('Please verify your email first. Check your inbox!');
            } else {
                toast.error(errorMsg);
            }
        }
        setLoading(false);
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        // Validation
        if (registerData.password !== registerData.confirmPassword) {
            toast.error('Passwords do not match!');
            return;
        }

        if (registerData.password.length < 6) {
            toast.error('Password must be at least 6 characters!');
            return;
        }

        setLoading(true);
        try {
            const res = await register({
                name: registerData.name,
                email: registerData.email,
                phone: registerData.phone,
                password: registerData.password,
                role: registerData.role
            });
            toast.success(res.data.message || 'Registration successful! Please check your email to verify your account.');
            setIsLogin(true); // Switch to login view
        } catch (err) {
            toast.error(err.response?.data?.error || 'Registration failed');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
            {/* Particle Background */}
            <ParticleBackground />

            {/* Cyber Grid Overlay */}
            <div className="fixed inset-0 cyber-grid opacity-10 pointer-events-none z-0"></div>

            <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full max-w-md"
                >
                    {/* Logo */}
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-8"
                    >
                        <img
                            src="/logo.png"
                            alt="Buztle Logo"
                            className="w-24 h-24 mx-auto mb-4 drop-shadow-2xl floating"
                            style={{ filter: 'drop-shadow(0 0 20px rgba(6, 182, 212, 0.5))' }}
                        />
                        <h1 className="text-4xl font-bold holographic mb-2">
                            Welcome to Buztle
                        </h1>
                        <p className="text-cyan-300 text-sm neon-glow">
                            The Future of Event Management
                        </p>
                    </motion.div>

                    {/* Auth Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="glass-morph p-10 rounded-3xl neon-border"
                    >
                        {/* Toggle Buttons */}
                        <div className="flex gap-4 mb-8">
                            <button
                                onClick={() => setIsLogin(true)}
                                className={`flex-1 py-3 rounded-xl font-bold transition-all ${isLogin
                                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                                        : 'glass-morph text-gray-400 hover:text-white'
                                    }`}
                            >
                                Login
                            </button>
                            <button
                                onClick={() => setIsLogin(false)}
                                className={`flex-1 py-3 rounded-xl font-bold transition-all ${!isLogin
                                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                                        : 'glass-morph text-gray-400 hover:text-white'
                                    }`}
                            >
                                Register
                            </button>
                        </div>

                        {/* Login Form */}
                        {isLogin ? (
                            <motion.form
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                onSubmit={handleLogin}
                                className="space-y-6"
                            >
                                <div>
                                    <label className="block text-cyan-300 mb-2 text-sm font-semibold">
                                        Email or Phone
                                    </label>
                                    <div className="relative">
                                        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" />
                                        <input
                                            type="text"
                                            value={loginData.identifier}
                                            onChange={(e) => setLoginData({ ...loginData, identifier: e.target.value })}
                                            className="w-full pl-12 pr-6 py-4 glass-morph border-2 border-cyan-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all"
                                            placeholder="Enter email or phone"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-cyan-300 mb-2 text-sm font-semibold">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" />
                                        <input
                                            type="password"
                                            value={loginData.password}
                                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                            className="w-full pl-12 pr-6 py-4 glass-morph border-2 border-cyan-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all"
                                            placeholder="Enter password"
                                            required
                                        />
                                    </div>
                                </div>

                                <MagneticButton
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <FiZap />
                                    {loading ? 'Logging in...' : 'Login'}
                                </MagneticButton>
                            </motion.form>
                        ) : (
                            /* Register Form */
                            <motion.form
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                onSubmit={handleRegister}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="block text-cyan-300 mb-2 text-sm font-semibold">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" />
                                        <input
                                            type="text"
                                            value={registerData.name}
                                            onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                                            className="w-full pl-12 pr-6 py-4 glass-morph border-2 border-cyan-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all"
                                            placeholder="Enter your name"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-cyan-300 mb-2 text-sm font-semibold">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" />
                                        <input
                                            type="email"
                                            value={registerData.email}
                                            onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                            className="w-full pl-12 pr-6 py-4 glass-morph border-2 border-cyan-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all"
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-cyan-300 mb-2 text-sm font-semibold">
                                        Phone
                                    </label>
                                    <div className="relative">
                                        <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" />
                                        <input
                                            type="tel"
                                            value={registerData.phone}
                                            onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                                            className="w-full pl-12 pr-6 py-4 glass-morph border-2 border-cyan-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all"
                                            placeholder="Enter your phone"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-cyan-300 mb-2 text-sm font-semibold">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" />
                                        <input
                                            type="password"
                                            value={registerData.password}
                                            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                            className="w-full pl-12 pr-6 py-4 glass-morph border-2 border-cyan-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all"
                                            placeholder="Create password (min 6 chars)"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-cyan-300 mb-2 text-sm font-semibold">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" />
                                        <input
                                            type="password"
                                            value={registerData.confirmPassword}
                                            onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                                            className="w-full pl-12 pr-6 py-4 glass-morph border-2 border-cyan-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all"
                                            placeholder="Confirm password"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-cyan-300 mb-2 text-sm font-semibold">
                                        Role
                                    </label>
                                    <select
                                        value={registerData.role}
                                        onChange={(e) => setRegisterData({ ...registerData, role: e.target.value })}
                                        className="w-full px-6 py-4 glass-morph border-2 border-cyan-500/30 rounded-xl text-white focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all"
                                    >
                                        <option value="VOLUNTEER" className="bg-slate-900">🙋 Volunteer</option>
                                        <option value="ORGANIZER" className="bg-slate-900">🎯 Organizer</option>
                                    </select>
                                </div>

                                <MagneticButton
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <FiZap />
                                    {loading ? 'Registering...' : 'Register'}
                                </MagneticButton>
                            </motion.form>
                        )}
                    </motion.div>

                    {/* Back to Home Link */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-center mt-8"
                    >
                        <button
                            onClick={() => navigate('/')}
                            className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm"
                        >
                            ← Back to Home
                        </button>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default Auth;
