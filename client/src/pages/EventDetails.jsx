import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getEvent, applyForEvent, getEventApplications, updateApplicationStatus } from '../api/client';
import { useAuth } from '../context/AuthContext';

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
        return <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center text-white">Loading...</div>;
    }

    const isOrganizer = user?.role === 'ORGANIZER' && event?.organizerId === user.userId;

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
                    className="max-w-4xl mx-auto bg-white/10 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/20"
                >
                    <h2 className="text-5xl font-bold text-white mb-6">{event.title}</h2>
                    <p className="text-gray-300 text-lg mb-8">{event.description}</p>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <InfoItem icon="📅" label="Date" value={event.date} />
                        <InfoItem icon="🕐" label="Time" value={event.time} />
                        <InfoItem icon="📍" label="Location" value={event.location} />
                        <InfoItem icon="💰" label="Pay" value={event.payDetails} />
                    </div>

                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-white mb-3">Requirements</h3>
                        <p className="text-gray-300">{event.requirements}</p>
                    </div>

                    {user?.role === 'VOLUNTEER' && !isOrganizer && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleApply}
                            disabled={applying}
                            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50"
                        >
                            {applying ? 'Applying...' : 'Apply for This Event'}
                        </motion.button>
                    )}

                    {isOrganizer && (
                        <div className="mt-12">
                            <h3 className="text-3xl font-bold text-white mb-6">Applications ({applications.length})</h3>
                            <div className="space-y-4">
                                {applications.map((app) => (
                                    <div key={app.id} className="p-6 bg-white/10 border border-white/20 rounded-xl">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="text-xl font-bold text-white">{app.volunteer.name}</h4>
                                                <p className="text-gray-300">{app.volunteer.phone}</p>
                                                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${app.status === 'ACCEPTED' ? 'bg-green-500/20 border border-green-500 text-green-300' :
                                                    app.status === 'REJECTED' ? 'bg-red-500/20 border border-red-500 text-red-300' :
                                                        'bg-yellow-500/20 border border-yellow-500 text-yellow-300'
                                                    }`}>
                                                    {app.status}
                                                </span>
                                            </div>
                                            {app.status === 'PENDING' && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleAccept(app.id)}
                                                        className="px-4 py-2 bg-green-500/20 border border-green-500 text-green-300 rounded-lg hover:bg-green-500/30"
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(app.id)}
                                                        className="px-4 py-2 bg-red-500/20 border border-red-500 text-red-300 rounded-lg hover:bg-red-500/30"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-center gap-3">
        <span className="text-3xl">{icon}</span>
        <div>
            <div className="text-gray-400 text-sm">{label}</div>
            <div className="text-white font-semibold">{value}</div>
        </div>
    </div>
);

export default EventDetails;
