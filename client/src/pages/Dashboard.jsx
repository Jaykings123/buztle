import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiTrash2, FiZap } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { getEvents, deleteEvent, getMyApplications, deleteApplication, getEventApplications, updateApplicationStatus } from '../api/client';
import SearchFilter from '../components/SearchFilter';
import SkeletonLoader from '../components/SkeletonLoader';
import ParticleBackground from '../components/ParticleBackground';
import TiltCard from '../components/TiltCard';
import MagneticButton from '../components/MagneticButton';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [applications, setApplications] = useState([]);
    const [eventApplications, setEventApplications] = useState({}); // Store apps by eventId
    const [expandedEvents, setExpandedEvents] = useState(new Set()); // Track which events are expanded
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/auth');
            return;
        }
        loadData();
    }, [user, navigate]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (user.role === 'VOLUNTEER') {
                const [eventsRes, appsRes] = await Promise.all([
                    getEvents(),
                    getMyApplications()
                ]);
                setEvents(eventsRes.data);
                setFilteredEvents(eventsRes.data);
                setApplications(appsRes.data);
            } else {
                // Organizer - load events and their applications
                const eventsRes = await getEvents();

                // Filter events by organizerId matching user.id
                const myEvents = eventsRes.data.filter(e => e.organizerId === user.id);

                setEvents(myEvents);
                setFilteredEvents(myEvents);

                // Load applications for each event
                const appsData = {};
                await Promise.all(
                    myEvents.map(async (event) => {
                        try {
                            const appsRes = await getEventApplications(event.id);
                            appsData[event.id] = appsRes.data;
                        } catch (err) {
                            // Keep error logging for production debugging
                            appsData[event.id] = [];
                        }
                    })
                );
                setEventApplications(appsData);
            }
        } catch (error) {
            console.error('Failed to load data', error);
        }
        setLoading(false);
    };

    const handleSearch = (term) => {
        const filtered = events.filter(event =>
            event.title.toLowerCase().includes(term.toLowerCase()) ||
            event.location.toLowerCase().includes(term.toLowerCase()) ||
            event.description.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredEvents(filtered);
    };

    const handleCancelEvent = async (eventId, e) => {
        e.stopPropagation(); // Prevent card click
        if (!window.confirm('Are you sure you want to cancel this event? This will delete all applications.')) {
            return;
        }

        try {
            await deleteEvent(eventId);
            toast.success('Event canceled successfully');
            loadData(); // Reload data
        } catch (error) {
            toast.error('Failed to cancel event');
        }
    };

    const handleCancelApplication = async (appId, e) => {
        e.stopPropagation(); // Prevent card click
        if (!window.confirm('Are you sure you want to cancel this application?')) {
            return;
        }

        try {
            await deleteApplication(appId);
            toast.success('Application canceled');
            loadData(); // Reload data
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to cancel application');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

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
                    <div className="flex items-center gap-4">
                        <span className="text-white hidden sm:inline">{user?.name}</span>
                        <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-500 text-cyan-300 rounded-full text-sm">
                            {user?.role}
                        </span>
                        <MagneticButton
                            onClick={handleLogout}
                            className="px-4 py-2 glass-morph border border-cyan-500/30 text-cyan-300 rounded-lg hover:border-cyan-500 transition"
                        >
                            Logout
                        </MagneticButton>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8 relative z-10">
                {/* Organizer View */}
                {user?.role === 'ORGANIZER' && (
                    <div>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                            <h2 className="text-4xl font-bold holographic">My Events</h2>
                            <MagneticButton
                                onClick={() => navigate('/create-event')}
                                className="px-6 py-3 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all flex items-center gap-2"
                            >
                                <FiZap /> Create Event
                            </MagneticButton>
                        </div>

                        <SearchFilter searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearch={handleSearch} />

                        {loading ? (
                            <SkeletonLoader count={6} />
                        ) : filteredEvents.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredEvents.map((event) => (
                                    <EventCard
                                        key={event.id}
                                        event={event}
                                        onClick={() => navigate(`/event/${event.id}`)}
                                        onCancel={(e) => handleCancelEvent(event.id, e)}
                                        showCancel={true}
                                        applications={eventApplications[event.id] || []}
                                        onUpdateApp={loadData}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <p className="text-gray-300 text-xl">No events found</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Volunteer View */}
                {user?.role === 'VOLUNTEER' && (
                    <div>
                        <h2 className="text-4xl font-bold text-white mb-8">Available Events</h2>

                        <SearchFilter searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearch={handleSearch} />

                        {loading ? (
                            <SkeletonLoader count={6} />
                        ) : filteredEvents.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredEvents.map((event) => (
                                    <EventCard key={event.id} event={event} onClick={() => navigate(`/event/${event.id}`)} showCancel={false} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <p className="text-gray-300 text-xl">No events found</p>
                            </div>
                        )}

                        <h2 className="text-4xl font-bold holographic mt-16 mb-8">My Applications</h2>
                        {applications.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {applications.map((app) => (
                                    <ApplicationCard
                                        key={app.id}
                                        application={app}
                                        onCancel={(e) => handleCancelApplication(app.id, e)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-300">No applications yet. Apply to events above!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const EventCard = ({ event, onClick, onCancel, showCancel, applications = [], onUpdateApp }) => {
    const [expanded, setExpanded] = useState(false);
    const [processing, setProcessing] = useState(false);



    const pendingCount = applications.filter(app => app.status === 'PENDING').length;
    const totalCount = applications.length;

    const handleApprove = async (appId, e) => {
        e.stopPropagation();
        setProcessing(true);
        try {
            await updateApplicationStatus(appId, 'ACCEPTED');
            toast.success('Application approved!');
            onUpdateApp();
        } catch (error) {
            toast.error('Failed to approve');
        }
        setProcessing(false);
    };

    const handleReject = async (appId, e) => {
        e.stopPropagation();
        setProcessing(true);
        try {
            await updateApplicationStatus(appId, 'REJECTED');
            toast.success('Application rejected');
            onUpdateApp();
        } catch (error) {
            toast.error('Failed to reject');
        }
        setProcessing(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="p-6 glass-morph rounded-2xl border border-cyan-500/20 shadow-xl relative"
        >
            {showCancel && (
                <button
                    onClick={onCancel}
                    className="absolute top-4 right-4 p-2 bg-red-500/20 border border-red-500 text-red-300 rounded-lg hover:bg-red-500/30 transition-all z-10"
                    title="Cancel Event"
                >
                    <FiTrash2 />
                </button>
            )}

            {/* Event Info - Clickable */}
            <div onClick={onClick} className="cursor-pointer">
                <h3 className="text-2xl font-bold text-white mb-2 line-clamp-1 pr-8">{event.title}</h3>
                <p className="text-gray-300 mb-4 line-clamp-2 text-sm">{event.description}</p>
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                        <span>📅 {event.date}</span>
                        <span>🕐 {event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                        <span className="line-clamp-1">📍 {event.location}</span>
                    </div>
                    <div className="text-cyan-400 font-semibold text-lg">💰 {event.payDetails}</div>
                </div>
            </div>

            {/* Applications Section - Always show for debugging */}
            <div className="mt-4 pt-4 border-t border-cyan-500/20">
                <button
                    onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
                    className="w-full flex items-center justify-between text-cyan-300 hover:text-cyan-200 transition-colors"
                >
                    <span className="font-semibold">
                        📋 Applications: {totalCount}
                        {pendingCount > 0 && <span className="ml-2 px-2 py-1 bg-yellow-500/20 border border-yellow-500 text-yellow-300 rounded-full text-xs">
                            {pendingCount} Pending
                        </span>}
                    </span>
                    <span>{expanded ? '▼' : '▶'}</span>
                </button>

                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="mt-3 space-y-2 max-h-64 overflow-y-auto"
                    >
                        {applications.length > 0 ? (
                            applications.map((app) => (
                                <div
                                    key={app.id}
                                    className="p-3 glass-morph rounded-lg border border-cyan-500/10"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-white font-semibold">{app.volunteer.name}</p>
                                            <p className="text-gray-400 text-sm">{app.volunteer.phone}</p>
                                            <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-semibold ${app.status === 'ACCEPTED' ? 'bg-green-500/20 border border-green-500 text-green-300' :
                                                app.status === 'REJECTED' ? 'bg-red-500/20 border border-red-500 text-red-300' :
                                                    'bg-yellow-500/20 border border-yellow-500 text-yellow-300'
                                                }`}>
                                                {app.status}
                                            </span>
                                        </div>
                                        {app.status === 'PENDING' && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={(e) => handleApprove(app.id, e)}
                                                    disabled={processing}
                                                    className="px-3 py-1 bg-green-500/20 border border-green-500 text-green-300 rounded-lg hover:bg-green-500/30 transition-all text-sm disabled:opacity-50"
                                                >
                                                    ✓
                                                </button>
                                                <button
                                                    onClick={(e) => handleReject(app.id, e)}
                                                    disabled={processing}
                                                    className="px-3 py-1 bg-red-500/20 border border-red-500 text-red-300 rounded-lg hover:bg-red-500/30 transition-all text-sm disabled:opacity-50"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-4 text-gray-400 text-sm">
                                No applications yet
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

const ApplicationCard = ({ application, onCancel }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl relative"
    >
        {application.status === 'PENDING' && (
            <button
                onClick={onCancel}
                className="absolute top-4 right-4 p-2 bg-red-500/20 border border-red-500 text-red-300 rounded-lg hover:bg-red-500/30 transition-all"
                title="Cancel Application"
            >
                <FiTrash2 />
            </button>
        )}
        <h3 className="text-xl font-bold text-white mb-3 pr-8">{application.event.title}</h3>
        <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${application.status === 'ACCEPTED' ? 'bg-green-500/20 border border-green-500 text-green-300' :
            application.status === 'REJECTED' ? 'bg-red-500/20 border border-red-500 text-red-300' :
                'bg-yellow-500/20 border border-yellow-500 text-yellow-300'
            }`}>
            {application.status}
        </div>
    </motion.div>
);

export default Dashboard;
