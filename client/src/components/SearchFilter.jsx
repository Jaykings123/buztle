import React from 'react';
import { FiSearch } from 'react-icons/fi';
import { motion } from 'framer-motion';

const SearchFilter = ({ searchTerm, setSearchTerm, onSearch }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
        >
            <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <input
                    type="text"
                    placeholder="Search events by title, location..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        onSearch(e.target.value);
                    }}
                    className="w-full pl-12 pr-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                />
            </div>
        </motion.div>
    );
};

export default SearchFilter;
