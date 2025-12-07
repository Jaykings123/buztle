import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiCalendar, FiClock, FiMapPin, FiDollarSign, FiFileText, FiZap, FiCheck, FiX } from 'react-icons/fi';
import { getEvent, applyForEvent, getEventApplications, updateApplicationStatus } from '../api/client';
import { useAuth } from '../context/AuthContext';
import ParticleBackground from '../components/ParticleBackground';
import MagneticButton from '../components/MagneticButton';
import TiltCard from '../components/TiltCard';

const EventDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);

    useEffect(() => {
        loadEvent();
    }, [id]);

    const loadEvent = async () => {
        setLoading(true);
        try {
            const res = await getEvent(id);
            setEvent(res.data);

            // If organizer, load applications
            if (user?.role === 'ORGANIZER' && res.data.organizerId === user.userId) {
                const appsRes = await getEventApplications(id);
                setApplications(appsRes.data);
            }
        } catch (error) {
            console.error('Failed to load event', error);
        }
        setLoading(false);
    };

    const handleApply = async () => {
        setApplying(true);
        try {
            await applyForEvent(parseInt(id));
            toast.success('Application submitted successfully!');
            navigate('/dashboard');
        } catch (error) {
            toast.error('Failed to apply. You may have already applied.');
        }
        setApplying(false);
    };

    const handleAccept = async (appId) => {
        try {
            await updateApplicationStatus(appId, 'ACCEPTED');
            toast.success('Application accepted!');
            loadEvent();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleReject = async (appId) => {
        try {
            await updateApplicationStatus(appId, 'REJECTED');
            toast.success('Application rejected');
            loadEvent();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
                <div className="text-cyan-400 text-2xl neon-glow">Loading...</div>
            </div>
        );
    }

    const isOrganizer = user?.role === 'ORGANIZER' && event?.organizerId === user.userId;

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
                >
                    <TiltCard className="max-w-4xl mx-auto glass-morph p-10 rounded-3xl neon-border">
                        <h2 className="text-5xl font-bold holographic mb-6">{event.title}</h2>
                        <p className="text-gray-300 text-lg mb-8 leading-relaxed">{event.description}</p>

                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            <InfoItem icon={<FiCalendar className="text-cyan-400" />} label="Date" value={event.date} />
                            <InfoItem icon={<FiClock className="text-cyan-400" />} label="Time" value={event.time} />
                            <InfoItem icon={<FiMapPin className="text-cyan-400" />} label="Location" value={event.location} />
                            <InfoItem icon={<FiDollarSign className="text-cyan-400" />} label="Pay" value={event.payDetails} />
                        </div>

                        <div className="mb-8 p-6 glass-morph rounded-xl border border-cyan-500/20">
                            <h3 className="text-2xl font-bold text-cyan-300 mb-3 flex items-center gap-2">
                                <FiFileText /> Requirements
                            </h3>
                            <p className="text-gray-300 leading-relaxed">{event.requirements}</p>
                        </div>

                        {user?.role === 'VOLUNTEER' && !isOrganizer && (
                            <MagneticButton
                                onClick={handleApply}
                                disabled={applying}
                                className="w-full py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <FiZap />
                                {applying ? 'Applying...' : 'Apply for This Event'}
                            </MagneticButton>
                        )}
                    </TiltCard>

                    {isOrganizer && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="mt-12 max-w-4xl mx-auto"
                        >
                            <h3 className="text-3xl font-bold holographic mb-6">
                                Applications ({applications.length})
                            </h3>
                            <div className="space-y-4">
                                {applications.map((app) => (
                                    <motion.div
                                        key={app.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        whileHover={{ scale: 1.02 }}
                                        className="p-6 glass-morph border border-cyan-500/20 rounded-xl"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="text-xl font-bold text-white mb-1">{app.volunteer.name}</h4>
                                                <p className="text-gray-400 mb-3">{app.volunteer.phone}</p>
                                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${app.status === 'ACCEPTED' ? 'bg-green-500/20 border border-green-500 text-green-300' :
                                                    app.status === 'REJECTED' ? 'bg-red-500/20 border border-red-500 text-red-300' :
                                                        'bg-yellow-500/20 border border-yellow-500 text-yellow-300'
                                                    }`}>
                                                    {app.status}
                                                </span>
                                            </div>
                                            {app.status === 'PENDING' && (
                                                <div className="flex gap-2">
                                                    <MagneticButton
                                                        onClick={() => handleAccept(app.id)}
                                                        className="px-4 py-2 bg-green-500/20 border border-green-500 text-green-300 rounded-lg hover:bg-green-500/30 transition-all flex items-center gap-1"
                                                    >
                                                        <FiCheck /> Accept
                                                    </MagneticButton>
                                                    <MagneticButton
                                                        onClick={() => handleReject(app.id)}
                                                        className="px-4 py-2 bg-red-500/20 border border-red-500 text-red-300 rounded-lg hover:bg-red-500/30 transition-all flex items-center gap-1"
                                                    >
                                                        <FiX /> Reject
                                                    </MagneticButton>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                                {applications.length === 0 && (
                                    <div className="text-center py-12 glass-morph rounded-xl">
                                        <p className="text-gray-400 text-lg">No applications yet</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-center gap-4 p-4 glass-morph rounded-xl border border-cyan-500/20">
        <span className="text-3xl">{icon}</span>
        <div>
            <div className="text-gray-400 text-sm">{label}</div>
            <div className="text-white font-semibold">{value}</div>
        </div>
    </div>
);

export default EventDetails;
