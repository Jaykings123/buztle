'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useUser } from "@clerk/nextjs";
import { FiUser, FiCheck, FiArrowRight, FiBriefcase } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { updateUserRole } from '../../lib/api';

export default function Onboarding() {
    const { user } = useUser();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);

    const handleRoleSelect = async () => {
        if (!selectedRole) return;
        setLoading(true);
        try {
            await updateUserRole(selectedRole);

            // Reload user metadata
            await user.reload();

            toast.success('Welcome to Buztle! 🚀');
            router.push('/dashboard');
        } catch (error) {
            console.error(error);
            toast.error('Failed to update role. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-6"
            style={{ backgroundColor: 'var(--bg-primary)' }}
        >
            <div className="w-full max-w-4xl text-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="heading-lg mb-4">
                        Choose Your <span className="text-accent">Path</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }} className="text-lg">
                        How will you shape the future of events?
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {/* Volunteer Card */}
                    <RoleCard
                        role="VOLUNTEER"
                        icon={<FiUser className="text-5xl" />}
                        title="Volunteer"
                        description="Browse events, apply for opportunities, and build your experience."
                        selected={selectedRole === 'VOLUNTEER'}
                        onSelect={() => setSelectedRole('VOLUNTEER')}
                    />

                    {/* Organizer Card */}
                    <RoleCard
                        role="ORGANIZER"
                        icon={<FiBriefcase className="text-5xl" />}
                        title="Organizer"
                        description="Create events, manage teams, and build your community."
                        selected={selectedRole === 'ORGANIZER'}
                        onSelect={() => setSelectedRole('ORGANIZER')}
                    />
                </div>

                <button
                    disabled={!selectedRole || loading}
                    onClick={handleRoleSelect}
                    className={`btn-primary px-12 py-4 text-lg mx-auto ${!selectedRole ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading ? 'Setting up...' : 'Continue'}
                    {!loading && <FiArrowRight />}
                </button>
            </div>
        </div>
    );
}

const RoleCard = ({ role, icon, title, description, selected, onSelect }) => (
    <motion.div
        whileHover={{ scale: 1.02, y: -4 }}
        onClick={onSelect}
        className={`card p-8 cursor-pointer transition-all text-left ${selected
                ? 'ring-2 ring-accent'
                : ''
            }`}
        style={{
            backgroundColor: selected ? 'var(--accent-light)' : 'var(--bg-secondary)',
            borderColor: selected ? 'var(--accent-primary)' : 'var(--border-light)'
        }}
    >
        {selected && (
            <div className="absolute top-4 right-4 bg-accent text-white p-2 rounded-full">
                <FiCheck className="text-lg" />
            </div>
        )}
        <div
            className="mb-6 transition-colors"
            style={{ color: selected ? 'var(--accent-primary)' : 'var(--text-muted)' }}
        >
            {icon}
        </div>
        <h3
            className="text-2xl font-bold mb-3"
            style={{ color: 'var(--text-primary)' }}
        >
            {title}
        </h3>
        <p style={{ color: 'var(--text-secondary)' }}>
            {description}
        </p>
    </motion.div>
);
