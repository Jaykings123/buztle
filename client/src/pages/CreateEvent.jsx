import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { createEvent } from '../api/client';
import { useAuth } from '../context/AuthContext';

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
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
            {/* Header */}
            <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-white cursor-pointer" onClick={() => navigate('/dashboard')}>Buztle</h1>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition"
                    >
                        ← Back
                    </button>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl mx-auto bg-white/10 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/20"
                >
                    <h2 className="text-4xl font-bold text-white mb-8">Create New Event</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-white mb-2">Event Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-6 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-white mb-2">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                className="w-full px-6 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                required
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-white mb-2">Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-white mb-2">Time</label>
                                <input
                                    type="time"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-white mb-2">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full px-6 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-white mb-2">Payment Details</label>
                            <input
                                type="text"
                                name="payDetails"
                                value={formData.payDetails}
                                onChange={handleChange}
                                placeholder="e.g., 500 INR per day"
                                className="w-full px-6 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-white mb-2">Requirements</label>
                            <textarea
                                name="requirements"
                                value={formData.requirements}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Dress code, skills needed, etc."
                                className="w-full px-6 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                required
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Create Event'}
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default CreateEvent;
