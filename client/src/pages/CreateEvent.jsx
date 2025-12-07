import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiCalendar, FiClock, FiMapPin, FiDollarSign, FiFileText, FiZap } from 'react-icons/fi';
import { createEvent } from '../api/client';
import { useAuth } from '../context/AuthContext';
import ParticleBackground from '../components/ParticleBackground';
import MagneticButton from '../components/MagneticButton';

const CreateEvent = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        payDetails: '',
        requirements: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createEvent(formData);
            toast.success('Event created successfully!');
            navigate('/dashboard');
        } catch (err) {
            toast.error('Failed to create event. Please try again.');
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (user?.role !== 'ORGANIZER') {
        return <div className="text-white p-8">Unauthorized</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
            {/* Particle Background */}
            <ParticleBackground />

            {/* Cyber Grid Overlay */}
            <div className="fixed inset-0 cyber-grid opacity-10 pointer-events-none z-0"></div>

            {/* Header */}
            <div className="relative z-10 glass-morph border-b border-cyan-500/20">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
                        <img src="/logo.png" alt="Buztle" className="w-10 h-10" style={{ filter: 'drop-shadow(0 0 10px rgba(6,182,212,0.5))' }} />
                        <h1 className="text-3xl font-bold holographic">Buztle</h1>
                    </div>
                    <MagneticButton
                        onClick={() => navigate('/dashboard')}
                        className="px-4 py-2 glass-morph border border-cyan-500/30 text-cyan-300 rounded-lg hover:border-cyan-500 transition"
                    >
                        ← Back
                    </MagneticButton>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-3xl mx-auto glass-morph p-10 rounded-3xl neon-border"
                >
                    <h2 className="text-4xl font-bold holographic mb-8 text-center">Create New Event</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-cyan-300 mb-2 font-semibold flex items-center gap-2">
                                <FiFileText /> Event Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-6 py-4 glass-morph border-2 border-cyan-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all"
                                placeholder="Enter event title..."
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-cyan-300 mb-2 font-semibold flex items-center gap-2">
                                <FiFileText /> Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                className="w-full px-6 py-4 glass-morph border-2 border-cyan-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all resize-none"
                                placeholder="Describe your event..."
                                required
                            />
                        </div>

                        {/* Date & Time */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-cyan-300 mb-2 font-semibold flex items-center gap-2">
                                    <FiCalendar /> Date
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 glass-morph border-2 border-cyan-500/30 rounded-xl text-white focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-cyan-300 mb-2 font-semibold flex items-center gap-2">
                                    <FiClock /> Time
                                </label>
                                <input
                                    type="time"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 glass-morph border-2 border-cyan-500/30 rounded-xl text-white focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-cyan-300 mb-2 font-semibold flex items-center gap-2">
                                <FiMapPin /> Location
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full px-6 py-4 glass-morph border-2 border-cyan-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all"
                                placeholder="Event location..."
                                required
                            />
                        </div>

                        {/* Payment Details */}
                        <div>
                            <label className="block text-cyan-300 mb-2 font-semibold flex items-center gap-2">
                                <FiDollarSign /> Payment Details
                            </label>
                            <input
                                type="text"
                                name="payDetails"
                                value={formData.payDetails}
                                onChange={handleChange}
                                placeholder="e.g., 500 INR per day"
                                className="w-full px-6 py-4 glass-morph border-2 border-cyan-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all"
                                required
                            />
                        </div>

                        {/* Requirements */}
                        <div>
                            <label className="block text-cyan-300 mb-2 font-semibold flex items-center gap-2">
                                <FiFileText /> Requirements
                            </label>
                            <textarea
                                name="requirements"
                                value={formData.requirements}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Dress code, skills needed, etc."
                                className="w-full px-6 py-4 glass-morph border-2 border-cyan-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all resize-none"
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <MagneticButton
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <FiZap />
                            {loading ? 'Creating...' : 'Create Event'}
                        </MagneticButton>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default CreateEvent;
