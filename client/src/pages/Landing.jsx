import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUsers, FiCalendar, FiDollarSign, FiCheckCircle } from 'react-icons/fi';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
            {/* Hero Section */}
            <div className="container mx-auto px-6 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center"
                >
                    <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-400">
                        Buztle
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
                        Connect Event Organizers with Volunteers for short-term work opportunities.
                        Find gigs. Build your network. Get verified.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/auth')}
                            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-lg font-semibold rounded-full shadow-2xl hover:shadow-cyan-500/50 transition-all"
                        >
                            Get Started
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-white/10 backdrop-blur-md text-white text-lg font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-all"
                        >
                            Learn More
                        </motion.button>
                    </div>
                </motion.div>

                {/* Features */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="grid md:grid-cols-3 gap-8 mt-24"
                >
                    <FeatureCard
                        icon={<FiCalendar className="text-5xl" />}
                        title="Find Opportunities"
                        description="Browse verified event postings with clear pay details and requirements."
                    />
                    <FeatureCard
                        icon={<FiCheckCircle className="text-5xl" />}
                        title="Get Verified"
                        description="Build trust with phone and ID verification for both organizers and volunteers."
                    />
                    <FeatureCard
                        icon={<FiDollarSign className="text-5xl" />}
                        title="Transparent Pay"
                        description="See payment details upfront. No hidden fees or surprises."
                    />
                </motion.div>

                {/* How It Works */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="mt-32"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
                        How It Works
                    </h2>
                    <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                        <StepCard
                            number="1"
                            title="For Organizers"
                            steps={[
                                "Sign up and verify your account",
                                "Post event details and requirements",
                                "Review volunteer applications",
                                "Accept qualified candidates"
                            ]}
                        />
                        <StepCard
                            number="2"
                            title="For Volunteers"
                            steps={[
                                "Create your profile",
                                "Browse available events",
                                "Apply with one click",
                                "Get notified when accepted"
                            ]}
                        />
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-8"
                >
                    <StatCard number="100+" label="Active Events" />
                    <StatCard number="500+" label="Volunteers" />
                    <StatCard number="50+" label="Organizers" />
                    <StatCard number="95%" label="Success Rate" />
                </motion.div>
            </div>

            {/* Footer */}
            <footer className="bg-black/20 backdrop-blur-md border-t border-white/10 mt-32">
                <div className="container mx-auto px-6 py-8">
                    <div className="text-center text-gray-400">
                        <p>© 2025 Buztle. All rights reserved.</p>
                        <p className="mt-2 text-sm">Built with ❤️ for event management</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <motion.div
        whileHover={{ y: -10, scale: 1.02 }}
        className="p-8 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl"
    >
        <div className="text-cyan-400 mb-4">{icon}</div>
        <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-300">{description}</p>
    </motion.div>
);

const StepCard = ({ number, title, steps }) => (
    <div className="p-8 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
        <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {number}
            </div>
            <h3 className="text-2xl font-bold text-white">{title}</h3>
        </div>
        <ul className="space-y-3">
            {steps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3 text-gray-300">
                    <FiCheckCircle className="text-cyan-400 mt-1 flex-shrink-0" />
                    <span>{step}</span>
                </li>
            ))}
        </ul>
    </div>
);

const StatCard = ({ number, label }) => (
    <motion.div
        whileHover={{ scale: 1.05 }}
        className="text-center p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20"
    >
        <div className="text-4xl md:text-5xl font-bold text-cyan-400 mb-2">{number}</div>
        <div className="text-gray-300">{label}</div>
    </motion.div>
);

export default Landing;
