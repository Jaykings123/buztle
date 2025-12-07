import React from 'react';
import { motion } from 'framer-motion';

const MagneticButton = ({ children, onClick, className, type = "button", disabled = false }) => {
    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className={className}
        >
            {children}
        </motion.button>
    );
};

export default MagneticButton;
