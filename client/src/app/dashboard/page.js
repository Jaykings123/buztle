'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiPlus, FiSearch, FiUser, FiLogOut, FiCalendar, FiMapPin, FiClock, FiDollarSign, FiTrash2, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';

import { getEvents, getMyEvents, deleteEvent, getMyApplications, deleteApplication } from '../../lib/api';
import { useAppUser } from '../../hooks/useAppUser';
import ThemeToggle from '@/components/ThemeToggle';

export default function Dashboard() {
    const { user, isLoading: isUserLoading, hasRole } = useAppUser();
    const router = useRouter();
    const queryClient = useQueryClient();
    const { signOut } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredEvents, setFilteredEvents] = useState([]);

    const isOrganizer = user?.role === 'ORGANIZER';

    // Redirect to onboarding if user hasn't selected a role
    useEffect(() => {
        if (!isUserLoading && user && !hasRole) {
            router.replace('/onboarding');
        }
    }, [isUserLoading, user, hasRole, router]);

    // Query for Organizer
    const { data: myEvents, isLoading: loadingOrganizer } = useQuery({
        queryKey: ['myEvents'],
        queryFn: async () => {
            const res = await getMyEvents();
            return res.data;
        },
        enabled: !!user && isOrganizer,
    });

    // Query for Volunteer (Events)
    const { data: allEvents, isLoading: loadingVolunteerEvents } = useQuery({
        queryKey: ['events'],
        queryFn: async () => {
            const res = await getEvents();
            return res.data;
        },
        enabled: !!user && !isOrganizer,
    });

    // Query for Volunteer (Applications)
    const { data: myApplications, isLoading: loadingApplications } = useQuery({
        queryKey: ['myApplications'],
        queryFn: async () => {
            const res = await getMyApplications();
            return res.data;
        },
        enabled: !!user && !isOrganizer,
    });

    const isLoadingData = isOrganizer ? loadingOrganizer : (loadingVolunteerEvents || loadingApplications);
    const activeEvents = isOrganizer ? myEvents : allEvents;

    useEffect(() => {
        if (activeEvents) {
            setFilteredEvents(activeEvents);
        }
    }, [activeEvents]);

    const handleSearch = (term) => {
        setSearchTerm(term);
        if (!activeEvents) return;
        const lowerTerm = term.toLowerCase();
        const filtered = activeEvents.filter(event =>
            event.title.toLowerCase().includes(lowerTerm) ||
            event.location.toLowerCase().includes(lowerTerm) ||
            event.description.toLowerCase().includes(lowerTerm)
        );
        setFilteredEvents(filtered);
    };

    const cancelEventMutation = useMutation({
        mutationFn: deleteEvent,
        onSuccess: () => {
            toast.success('Event canceled successfully');
            queryClient.invalidateQueries({ queryKey: ['myEvents'] });
        },
        onError: () => toast.error('Failed to cancel event'),
    });

    const cancelAppMutation = useMutation({
        mutationFn: deleteApplication,
        onSuccess: () => {
            toast.success('Application canceled');
            queryClient.invalidateQueries({ queryKey: ['myApplications'] });
        },
        onError: (err) => toast.error(err.response?.data?.error || 'Failed to cancel application'),
    });

    const handleCancelEvent = async (eventId, e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to cancel this event?')) {
            cancelEventMutation.mutate(eventId);
        }
    };

    const handleCancelApplication = async (appId, e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to cancel this application?')) {
            cancelAppMutation.mutate(appId);
        }
    };

    // Show loading while checking user or redirecting
    if (isUserLoading || !user || !hasRole) {
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
                            onClick={() => router.push('/')}
                        >
                            <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Buztle</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="hidden sm:block text-sm" style={{ color: 'var(--text-secondary)' }}>{user?.name}</span>
                            <span className="badge badge-primary uppercase text-xs">
                                {user?.role}
                            </span>
                            <ThemeToggle />
                            <button
                                onClick={() => router.push('/profile')}
                                className="btn-ghost p-2"
                                title="Profile"
                            >
                                <FiUser className="text-lg" />
                            </button>
                            <button
                                onClick={() => signOut(() => router.push('/'))}
                                className="btn-ghost p-2"
                                title="Logout"
                            >
                                <FiLogOut className="text-lg" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header & Search */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
                    <div>
                        <h1 className="heading-md">{isOrganizer ? 'My Events' : 'Available Events'}</h1>
                        <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>
                            {isOrganizer ? 'Manage your created events' : 'Discover opportunities to volunteer'}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                        {/* Search */}
                        <div className="relative flex-1 lg:w-64">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-lg" style={{ color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                placeholder="Search events..."
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="input-field py-2.5"
                                style={{ paddingLeft: '3rem' }}
                            />
                        </div>

                        {isOrganizer && (
                            <button
                                onClick={() => router.push('/create-event')}
                                className="btn-primary whitespace-nowrap"
                            >
                                <FiPlus /> Create Event
                            </button>
                        )}
                    </div>
                </div>

                {/* Events Grid */}
                {isLoadingData ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="card card-body animate-pulse">
                                <div className="h-4 rounded w-3/4 mb-4" style={{ backgroundColor: 'var(--border-light)' }}></div>
                                <div className="h-3 rounded w-1/2 mb-2" style={{ backgroundColor: 'var(--border-light)' }}></div>
                                <div className="h-3 rounded w-2/3" style={{ backgroundColor: 'var(--border-light)' }}></div>
                            </div>
                        ))}
                    </div>
                ) : filteredEvents?.length > 0 ? (
                    <motion.div
                        layout
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        <AnimatePresence>
                            {filteredEvents.map((event) => (
                                <EventCard
                                    key={event.id}
                                    event={event}
                                    onClick={() => router.push(`/event/${event.id}`)}
                                    onCancel={isOrganizer ? (e) => handleCancelEvent(event.id, e) : null}
                                    showCancel={isOrganizer}
                                    applications={event.applications || []}
                                />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <div className="card empty-state">
                        <div className="empty-state-icon">
                            <FiCalendar />
                        </div>
                        <p className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>No events found</p>
                        <p className="mb-6" style={{ color: 'var(--text-muted)' }}>
                            {isOrganizer ? 'Create your first event to get started' : 'Check back later for new opportunities'}
                        </p>
                        {isOrganizer && (
                            <button
                                onClick={() => router.push('/create-event')}
                                className="btn-primary"
                            >
                                <FiPlus /> Create Your First Event
                            </button>
                        )}
                    </div>
                )}

                {/* Volunteer: My Applications Section */}
                {!isOrganizer && (
                    <div className="mt-16">
                        <h2 className="heading-md mb-6">
                            My <span className="text-accent">Applications</span>
                        </h2>

                        {myApplications?.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {myApplications.map((app) => (
                                    <ApplicationCard
                                        key={app.id}
                                        application={app}
                                        onCancel={(e) => handleCancelApplication(app.id, e)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="card empty-state">
                                <div className="empty-state-icon">
                                    <FiUser />
                                </div>
                                <p className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>No applications yet</p>
                                <p style={{ color: 'var(--text-muted)' }}>Apply to events above to see them here</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// Event Card Component
const EventCard = ({ event, onClick, onCancel, showCancel, applications }) => {
    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -4 }}
            onClick={onClick}
            className="card cursor-pointer group relative"
        >
            <div className="card-body">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg group-hover:text-accent transition-colors line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                        {event.title}
                    </h3>
                    {showCancel && onCancel && (
                        <button
                            onClick={onCancel}
                            className="p-2 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            style={{ color: 'var(--text-muted)' }}
                            title="Cancel Event"
                        >
                            <FiTrash2 />
                        </button>
                    )}
                </div>

                <p className="text-sm line-clamp-2 mb-4" style={{ color: 'var(--text-secondary)' }}>
                    {event.description}
                </p>

                <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                        <FiCalendar className="text-accent" />
                        <span>{formatDate(event.date)}</span>
                        {event.time && (
                            <>
                                <FiClock className="text-accent ml-2" />
                                <span>{event.time}</span>
                            </>
                        )}
                    </div>
                    <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                        <FiMapPin className="text-accent" />
                        <span className="line-clamp-1">{event.location}</span>
                    </div>
                    {event.payDetails && (
                        <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                            <FiDollarSign className="text-accent" />
                            <span>{event.payDetails}</span>
                        </div>
                    )}
                </div>

                {applications && applications.length > 0 && (
                    <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-light)' }}>
                        <span className="badge badge-pending">
                            {applications.length} Application{applications.length > 1 ? 's' : ''}
                        </span>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

// Application Card Component
const ApplicationCard = ({ application, onCancel }) => {
    const event = application.event;

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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className="card"
        >
            <div className="card-body">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>{event?.title || 'Event'}</h3>
                    <span className={getStatusBadge(application.status)}>
                        {application.status}
                    </span>
                </div>

                {event && (
                    <div className="space-y-2 text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                        <div className="flex items-center gap-2">
                            <FiMapPin className="text-accent" />
                            <span>{event.location}</span>
                        </div>
                    </div>
                )}

                {application.status === 'PENDING' && (
                    <button
                        onClick={onCancel}
                        className="w-full py-2 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                    >
                        <FiX /> Cancel Application
                    </button>
                )}
            </div>
        </motion.div>
    );
};
