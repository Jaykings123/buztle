'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiCalendar, FiClock, FiMapPin, FiDollarSign, FiFileText, FiArrowLeft, FiSend, FiCheck, FiX, FiUser } from 'react-icons/fi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { getEvent, applyForEvent, getEventApplications, updateApplicationStatus } from '../../../lib/api';
import { useAppUser } from '../../../hooks/useAppUser';

export default function EventDetails() {
    const params = useParams();
    const id = params.id;
    const { user, isLoading: isUserLoading } = useAppUser();
    const router = useRouter();
    const queryClient = useQueryClient();

    // Fetch Event Details
    const { data: event, isLoading: isEventLoading, isError } = useQuery({
        queryKey: ['event', id],
        queryFn: async () => {
            const res = await getEvent(id);
            return res.data;
        },
        enabled: !!id,
    });

    const isOrganizer = user?.role === 'ORGANIZER' && event?.organizerId === user?.id;

    // Fetch Applications (Organizer only)
    const { data: applications = [] } = useQuery({
        queryKey: ['eventApplications', id],
        queryFn: async () => {
            const res = await getEventApplications(id);
            return res.data;
        },
        enabled: !!id && !!isOrganizer,
    });

    // Mutations
    const applyMutation = useMutation({
        mutationFn: () => applyForEvent(id),
        onSuccess: () => {
            toast.success('Application submitted successfully!');
            router.push('/dashboard');
        },
        onError: (error) => {
            toast.error('Failed to apply. You may have already applied.');
        }
    });

    const statusMutation = useMutation({
        mutationFn: ({ appId, status }) => updateApplicationStatus(appId, status),
        onSuccess: (data, variables) => {
            toast.success(`Application ${variables.status.toLowerCase()}!`);
            queryClient.invalidateQueries({ queryKey: ['eventApplications', id] });
        },
        onError: () => {
            toast.error('Failed to update status');
        }
    });

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (isUserLoading || isEventLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    if (isError || !event) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ backgroundColor: 'var(--bg-primary)' }}>
                <h1 className="heading-md mb-4">Event Not Found</h1>
                <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>The event you're looking for doesn't exist.</p>
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

            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Event Details Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="glass-card p-8 md:p-10"
                >
                    {/* Title */}
                    <h1 className="heading-lg mb-4">
                        {event.title}
                    </h1>

                    {/* Description */}
                    <p className="text-lg leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
                        {event.description}
                    </p>

                    {/* Info Grid */}
                    <div className="grid md:grid-cols-2 gap-4 mb-8">
                        <InfoItem
                            icon={<FiCalendar />}
                            label="Date"
                            value={formatDate(event.date)}
                        />
                        <InfoItem
                            icon={<FiClock />}
                            label="Time"
                            value={event.time}
                        />
                        <InfoItem
                            icon={<FiMapPin />}
                            label="Location"
                            value={event.location}
                        />
                        <InfoItem
                            icon={<FiDollarSign />}
                            label="Payment"
                            value={event.payDetails}
                        />
                    </div>

                    {/* Requirements */}
                    <div className="mb-8 p-6 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                        <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                            <FiFileText className="text-accent" /> Requirements
                        </h3>
                        <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{event.requirements}</p>
                    </div>

                    {/* Apply Button (Volunteer only) */}
                    {user?.role === 'VOLUNTEER' && !isOrganizer && (
                        <button
                            onClick={() => applyMutation.mutate()}
                            disabled={applyMutation.isPending}
                            className="btn-primary w-full py-4 text-base"
                        >
                            <FiSend />
                            {applyMutation.isPending ? 'Applying...' : 'Apply for This Event'}
                        </button>
                    )}
                </motion.div>

                {/* Applications Section (Organizer only) */}
                {isOrganizer && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="mt-8"
                    >
                        <h2 className="heading-md mb-6">
                            Applications <span className="text-accent">({applications.length})</span>
                        </h2>

                        <div className="space-y-4">
                            {applications.map((app) => (
                                <ApplicationItem
                                    key={app.id}
                                    app={app}
                                    onAccept={() => statusMutation.mutate({ appId: app.id, status: 'ACCEPTED' })}
                                    onReject={() => statusMutation.mutate({ appId: app.id, status: 'REJECTED' })}
                                    isLoading={statusMutation.isPending}
                                />
                            ))}

                            {applications.length === 0 && (
                                <div className="card card-body text-center py-12">
                                    <FiUser className="text-4xl mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
                                    <p style={{ color: 'var(--text-secondary)' }}>No applications yet</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

// Info Item Component
const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-center gap-4 p-4 card">
        <div className="icon-box">
            {icon}
        </div>
        <div>
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{label}</div>
            <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>{value}</div>
        </div>
    </div>
);

// Application Item Component
const ApplicationItem = ({ app, onAccept, onReject, isLoading }) => {
    const getStatusBadge = (status) => {
        switch (status) {
            case 'ACCEPTED':
                return 'badge-success';
            case 'REJECTED':
                return 'badge bg-red-100 text-red-600';
            default:
                return 'badge-pending';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ y: -2 }}
            className="card card-body"
        >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
                        <FiUser className="text-xl" style={{ color: 'var(--text-secondary)' }} />
                    </div>
                    <div>
                        <h4 className="font-bold" style={{ color: 'var(--text-primary)' }}>
                            {app.volunteer?.name || 'Name not set'}
                        </h4>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            {app.volunteer?.phone || 'Phone not set'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className={getStatusBadge(app.status)}>
                        {app.status}
                    </span>

                    {app.status === 'PENDING' && (
                        <div className="flex gap-2">
                            <button
                                onClick={onAccept}
                                disabled={isLoading}
                                className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
                                title="Accept"
                            >
                                <FiCheck />
                            </button>
                            <button
                                onClick={onReject}
                                disabled={isLoading}
                                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                                title="Reject"
                            >
                                <FiX />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
