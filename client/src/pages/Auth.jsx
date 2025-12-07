import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { sendOTP, verifyOTP, register } from '../api/client';
import { useAuth } from '../context/AuthContext';

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
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center px-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/10 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/20 w-full max-w-md"
            >
                <h2 className="text-4xl font-bold text-white mb-8 text-center">
                    {step === 'phone' && 'Welcome'}
                    {step === 'otp' && 'Verify OTP'}
                    {step === 'register' && 'Complete Profile'}
                </h2>

                {step === 'phone' && (
                    <form onSubmit={handleSendOTP}>
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-6 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 mb-6"
                            required
                        />
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Sending...' : 'Send OTP'}
                        </motion.button>
                        <p className="text-gray-300 text-sm mt-4 text-center">
                            Demo: Use any phone number. OTP is <strong>1234</strong>
                        </p>
                    </form>
                )}

                {step === 'otp' && (
                    <form onSubmit={handleVerifyOTP}>
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full px-6 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 mb-6"
                            required
                        />
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </motion.button>
                    </form>
                )}

                {step === 'register' && (
                    <form onSubmit={handleRegister}>
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-6 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 mb-4"
                            required
                        />
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-6 py-4 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 mb-6"
                        >
                            <option value="VOLUNTEER" className="bg-purple-900">Volunteer</option>
                            <option value="ORGANIZER" className="bg-purple-900">Organizer</option>
                        </select>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Complete Registration'}
                        </motion.button>
                    </form>
                )}
            </motion.div>
        </div>
    );
};

export default Auth;
