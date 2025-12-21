'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { updateApplicationStatus } from '../lib/api';

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
            if (onUpdateApp) onUpdateApp();
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
            if (onUpdateApp) onUpdateApp();
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
                </div>
                {/* Location and Organizer in one row */}
                <div className="flex flex-wrap items-center gap-4 text-gray-300 text-sm">
                    <span className="line-clamp-1">📍 {event.location}</span>
                    {event.organizer && (
                        <div className="text-sm text-cyan-200">
                            👤 Organized by: <span className="font-semibold">{event.organizer.name || 'Unknown'}</span>
                        </div>
                    )}
                </div>
                {/* Pay and Status in next row */}
                <div className="flex justify-between items-center mt-2">
                    <div className="text-cyan-400 font-semibold text-lg">💰 {event.payDetails}</div>
                    <div className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-300 border border-green-500/50">
                        ✅ Accepted: {event._count?.applications || 0}
                    </div>
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
        </motion.div >
    );
};

export default EventCard;
