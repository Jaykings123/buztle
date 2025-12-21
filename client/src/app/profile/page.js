'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiUser, FiPhone, FiArrowLeft, FiSave } from 'react-icons/fi';

import { updateProfile } from '../../lib/api';
import { useAppUser } from '../../hooks/useAppUser';

export default function Profile() {
    const { user, isLoading: isUserLoading } = useAppUser();
    const router = useRouter();
    const queryClient = useQueryClient();

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [isInitialized, setIsInitialized] = useState(false);

    // Only set initial values once when user data first loads
    useEffect(() => {
        if (user && !isInitialized) {
            setName(user.name || '');
            setPhone(user.phone || '');
            setIsInitialized(true);
        }
    }, [user, isInitialized]);

    const updateMutation = useMutation({
        mutationFn: updateProfile,
        onSuccess: () => {
            toast.success('Profile updated successfully');
            queryClient.invalidateQueries({ queryKey: ['userProfile', user?.clerkId] });
        },
        onError: (error) => {
            console.error(error);
            toast.error(error.response?.data?.error || 'Failed to update profile');
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        updateMutation.mutate({ name, phone });
    };

    if (isUserLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
                <div className="spinner"></div>
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

            <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <div className="glass-card p-8">
                        {/* Avatar */}
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center">
                                <FiUser className="text-3xl text-accent" />
                            </div>
                        </div>

                        <h1 className="heading-md text-center mb-2">Your Profile</h1>
                        <p className="text-center text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                            Update your personal information
                        </p>

                        {/* Role Badge */}
                        <div className="flex justify-center mb-8">
                            <span className="badge badge-primary uppercase">
                                {user?.role}
                            </span>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="input-label flex items-center gap-2">
                                    <FiUser className="text-accent" /> Full Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="input-field"
                                    placeholder="Enter your name"
                                    minLength={2}
                                    required
                                />
                            </div>

                            <div>
                                <label className="input-label flex items-center gap-2">
                                    <FiPhone className="text-accent" /> Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="input-field"
                                    placeholder="1234567890"
                                    pattern="[0-9]{10}"
                                    title="10 digit mobile number"
                                    required
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => router.push('/dashboard')}
                                    className="btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={updateMutation.isPending}
                                    className="btn-primary flex-1"
                                >
                                    <FiSave />
                                    {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>

                    <p className="text-center text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
                        Email: {user?.email}
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
