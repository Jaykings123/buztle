import React from 'react';
import { motion } from 'framer-motion';

const SkeletonLoader = ({ count = 3 }) => {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(count)].map((_, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20  shadow-xl"
                >
                    <div className="animate-pulse">
                        <div className="h-6 bg-white/20 rounded w-3/4 mb-3"></div>
                        <div className="h-4 bg-white/20 rounded w-full mb-2"></div>
                        <div className="h-4 bg-white/20 rounded w-5/6 mb-4"></div>
                        <div className="h-4 bg-white/20 rounded w-1/2 mb-2"></div>
                        <div className="h-4 bg-white/20 rounded w-1/3"></div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default SkeletonLoader;
