'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiCalendar, FiClock, FiMapPin, FiDollarSign, FiFileText, FiArrowLeft, FiSend } from 'react-icons/fi';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createEvent } from '../../lib/api';
import { useAppUser } from '../../hooks/useAppUser';

export default function CreateEvent() {
    const { user, isLoading: isUserLoading } = useAppUser();
    const router = useRouter();
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        payDetails: '',
        requirements: ''
    });

    const createMutation = useMutation({
        mutationFn: createEvent,
        onSuccess: () => {
            toast.success('Event created successfully!');
            queryClient.invalidateQueries({ queryKey: ['myEvents'] });
            router.push('/dashboard');
        },
        onError: (err) => {
            console.error(err);
            const errorMessage = err.response?.data?.details?.[0]?.message || err.response?.data?.error || 'Failed to create event.';
            toast.error(errorMessage);
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        createMutation.mutate(formData);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (isUserLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    if (user?.role !== 'ORGANIZER') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ backgroundColor: 'var(--bg-primary)' }}>
                <h1 className="heading-md mb-4">Unauthorized</h1>
                <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>Only organizers can create events.</p>
                <button onClick={() => router.push('/dashboard')} className="btn-primary">
                    Go to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
            {/* Navigation */}
            <nav className="sticky top-0 z-50 glass-nav" style={{ borderBottom: '1px solid var(--border-light)' }}>
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div
                            className="flex items-center gap-3 cursor-pointer"
                            onClick={() => router.push('/dashboard')}
                        >
                            <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Buztle</span>
                        </div>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="btn-ghost flex items-center gap-2"
                        >
                            <FiArrowLeft /> Back to Dashboard
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-2xl mx-auto px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="glass-card p-8 md:p-10"
                >
                    <h1 className="heading-md text-center mb-2">
                        Create New <span className="text-accent">Event</span>
                    </h1>
                    <p className="text-center mb-8" style={{ color: 'var(--text-secondary)' }}>
                        Fill in the details below to create your event
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="input-label flex items-center gap-2">
                                <FiFileText className="text-accent" /> Event Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Enter a compelling event title..."
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="input-label flex items-center gap-2">
                                <FiFileText className="text-accent" /> Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                className="input-field resize-none"
                                placeholder="Describe your event in detail..."
                                required
                            />
                        </div>

                        {/* Date & Time */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="input-label flex items-center gap-2">
                                    <FiCalendar className="text-accent" /> Date
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div>
                                <label className="input-label flex items-center gap-2">
                                    <FiClock className="text-accent" /> Time
                                </label>
                                <input
                                    type="time"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    className="input-field"
                                    required
                                />
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="input-label flex items-center gap-2">
                                <FiMapPin className="text-accent" /> Location
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Event venue or address..."
                                required
                            />
                        </div>

                        {/* Payment Details */}
                        <div>
                            <label className="input-label flex items-center gap-2">
                                <FiDollarSign className="text-accent" /> Payment Details
                            </label>
                            <input
                                type="text"
                                name="payDetails"
                                value={formData.payDetails}
                                onChange={handleChange}
                                placeholder="e.g., ₹500 per day, Free, etc."
                                className="input-field"
                                required
                            />
                        </div>

                        {/* Requirements */}
                        <div>
                            <label className="input-label flex items-center gap-2">
                                <FiFileText className="text-accent" /> Requirements
                            </label>
                            <textarea
                                name="requirements"
                                value={formData.requirements}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Skills needed, dress code, age requirements, etc."
                                className="input-field resize-none"
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={createMutation.isPending}
                            className="btn-primary w-full py-4 text-base"
                        >
                            <FiSend />
                            {createMutation.isPending ? 'Creating...' : 'Create Event'}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
