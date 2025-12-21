'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { FiTrash2 } from 'react-icons/fi';

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

export default ApplicationCard;
