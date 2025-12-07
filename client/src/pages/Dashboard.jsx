import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { getEvents, getMyApplications, deleteEvent, deleteApplication } from '../api/client';
import SearchFilter from '../components/SearchFilter';
import SkeletonLoader from '../components/SkeletonLoader';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [applications, setApplications] = useState([]);
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
                const eventsRes = await getEvents();
                setEvents(eventsRes.data);
                setFilteredEvents(eventsRes.data);
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
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
            {/* Header */}
            <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-white cursor-pointer" onClick={() => navigate('/dashboard')}>Buztle</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-white hidden sm:inline">{user?.name}</span>
                        <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-500 text-cyan-300 rounded-full text-sm">
                            {user?.role}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                {/* Organizer View */}
                {user?.role === 'ORGANIZER' && (
                    <div>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                            <h2 className="text-4xl font-bold text-white">My Events</h2>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/create-event')}
                                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl shadow-lg"
                            >
                                + Create Event
                            </motion.button>
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

                        <h2 className="text-4xl font-bold text-white mt-16 mb-8">My Applications</h2>
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

const EventCard = ({ event, onClick, onCancel, showCancel }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8, scale: 1.02 }}
        className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl cursor-pointer transition-all hover:border-cyan-500/50 relative"
        onClick={onClick}
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
    </motion.div>
);

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
