import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiLock, FiUser, FiPhone, FiZap } from 'react-icons/fi';
import { sendOTP, verifyOTP, register } from '../api/client';
import { useAuth } from '../context/AuthContext';
import ParticleBackground from '../components/ParticleBackground';
import MagneticButton from '../components/MagneticButton';

const Auth = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [step, setStep] = useState('phone'); // 'phone', 'otp', 'register'
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('VOLUNTEER');
    const [loading, setLoading] = useState(false);

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await sendOTP(phone);
            toast.success('OTP sent successfully!');
            setStep('otp');
        } catch (err) {
            toast.error('Failed to send OTP. Please try again.');
        }
        setLoading(false);
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await verifyOTP(phone, otp);
            if (res.data.isNewUser) {
                toast.success('OTP verified! Please complete your profile.');
                setStep('register');
            } else {
                toast.success('Welcome back!');
                login(res.data.token, res.data.user);
                navigate('/dashboard');
            }
        } catch (err) {
            toast.error('Invalid OTP. Please try again.');
        }
        setLoading(false);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await register({ phone, name, role });
            toast.success(`Welcome to Buztle, ${name}!`);
            login(res.data.token, res.data.user);
            navigate('/dashboard');
        } catch (err) {
            toast.error('Registration failed. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
            {/* Particle Background */}
            <ParticleBackground />

            {/* Cyber Grid Overlay */}
            <div className="fixed inset-0 cyber-grid opacity-10 pointer-events-none z-0"></div>

            <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
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
                        <h2 className="text-3xl font-bold text-white mb-8 text-center neon-glow">
                            {step === 'phone' && <><FiPhone className="inline mr-2" />Enter Phone</>}
                            {step === 'otp' && <><FiLock className="inline mr-2" />Verify OTP</>}
                            {step === 'register' && <><FiUser className="inline mr-2" />Complete Profile</>}
                        </h2>

                        {step === 'phone' && (
                            <motion.form
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                onSubmit={handleSendOTP}
                            >
                                <div className="relative mb-6">
                                    <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" />
                                    <input
                                        type="tel"
                                        placeholder="Phone Number"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full pl-12 pr-6 py-4 glass-morph border-2 border-cyan-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all"
                                        required
                                    />
                                </div>
                                <MagneticButton
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <FiZap />
                                    {loading ? 'Sending...' : 'Send OTP'}
                                </MagneticButton>
                                <p className="text-gray-400 text-sm mt-6 text-center glass-morph p-3 rounded-lg">
                                    <strong className="text-cyan-400">Demo:</strong> Use any phone number. OTP is <strong className="text-cyan-300">1234</strong>
                                </p>
                            </motion.form>
                        )}

                        {step === 'otp' && (
                            <motion.form
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                onSubmit={handleVerifyOTP}
                            >
                                <div className="relative mb-6">
                                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" />
                                    <input
                                        type="text"
                                        placeholder="Enter OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="w-full pl-12 pr-6 py-4 glass-morph border-2 border-cyan-500/30 rounded-xl text-white text-center text-2xl placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all tracking-widest"
                                        required
                                        maxLength="4"
                                    />
                                </div>
                                <MagneticButton
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <FiZap />
                                    {loading ? 'Verifying...' : 'Verify OTP'}
                                </MagneticButton>
                            </motion.form>
                        )}

                        {step === 'register' && (
                            <motion.form
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                onSubmit={handleRegister}
                            >
                                <div className="relative mb-4">
                                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" />
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-12 pr-6 py-4 glass-morph border-2 border-cyan-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all"
                                        required
                                    />
                                </div>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full px-6 py-4 glass-morph border-2 border-cyan-500/30 rounded-xl text-white focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all mb-6"
                                >
                                    <option value="VOLUNTEER" className="bg-slate-900">🙋 Volunteer</option>
                                    <option value="ORGANIZER" className="bg-slate-900">🎯 Organizer</option>
                                </select>
                                <MagneticButton
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <FiZap />
                                    {loading ? 'Creating...' : 'Complete Registration'}
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
