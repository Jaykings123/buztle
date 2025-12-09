import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { FiUsers, FiCalendar, FiDollarSign, FiCheckCircle, FiMail, FiLinkedin, FiGithub, FiZap, FiStar } from 'react-icons/fi';
import ParticleBackground from '../components/ParticleBackground';

const Landing = () => {
    const navigate = useNavigate();
    const aboutRef = useRef(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const { scrollYProgress } = useScroll();
    const yPosAnim = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const opacityAnim = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    const scrollToAbout = () => {
        aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleMouseMove = (e) => {
        setMousePosition({
            x: e.clientX,
            y: e.clientY
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden" onMouseMove={handleMouseMove}>
            {/* Particle Background */}
            <ParticleBackground />

            {/* Cyber Grid Overlay */}
            <div className="fixed inset-0 cyber-grid opacity-10 pointer-events-none z-0"></div>

            {/* Hero Section */}
            <div className="container mx-auto px-6 py-16 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    style={{ y: yPosAnim, opacity: opacityAnim }}
                    className="text-center"
                >
                    {/* Logo with Glow */}
                    <motion.div
                        className="inline-block"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.8, type: "spring" }}
                    >
                        <motion.img
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            src="/logo.png"
                            alt="Buztle Logo"
                            className="w-32 h-32 mx-auto mb-8 drop-shadow-2xl floating"
                            style={{
                                filter: 'drop-shadow(0 0 30px rgba(6, 182,212, 0.6))',
                            }}
                        />
                    </motion.div>

                    {/* Holographic Title */}
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-5xl md:text-7xl lg:text-9xl font-bold mb-6 holographic"
                        style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 900 }}
                    >
                        Buztle
                    </motion.h1>

                    {/* Subtitle with Neon Glow */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 1 }}
                        className="text-xl md:text-3xl text-cyan-300 mb-12 max-w-4xl mx-auto neon-glow font-light"
                    >
                        The Future of Event Management & Volunteer Networking
                    </motion.p>

                    {/* CTA Buttons with Magnetic Effect */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9, duration: 0.8 }}
                        className="flex flex-col sm:flex-row gap-6 justify-center"
                    >
                        <MagneticButton
                            onClick={() => navigate('/auth')}
                            className="group px-10 py-5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white text-lg font-bold rounded-full shadow-2xl hover:shadow-cyan-500/50 transition-all relative overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                <FiZap className="group-hover:rotate-12 transition-transform" />
                                Launch App
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </MagneticButton>

                        <MagneticButton
                            onClick={scrollToAbout}
                            className="px-10 py-5 glass-morph text-cyan-300 text-lg font-bold rounded-full border-2 border-cyan-500/30 hover:border-cyan-500 hover:bg-cyan-500/10 transition-all neon-border"
                        >
                            <span className="flex items-center gap-2">
                                <FiStar />
                                Explore Features
                            </span>
                        </MagneticButton>
                    </motion.div>
                </motion.div>

                {/* 3D Feature Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 md:mt-32"
                >
                    <TiltCard
                        icon={<FiCalendar className="text-6xl" />}
                        title="Smart Matching"
                        description="AI-powered event matching connects the right volunteers with perfect opportunities."
                        gradient="from-cyan-500 to-blue-600"
                    />
                    <TiltCard
                        icon={<FiCheckCircle className="text-6xl" />}
                        title="Instant Verification"
                        description="Blockchain-inspired verification system ensures trust and security for all users."
                        gradient="from-purple-500 to-pink-600"
                    />
                    <TiltCard
                        icon={<FiDollarSign className="text-6xl" />}
                        title="Crypto-Ready Payments"
                        description="Future-proof payment infrastructure with transparent pricing and instant settlements."
                        gradient="from-pink-500 to-red-600"
                    />
                </motion.div>

                {/* Animated Stats */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 1 }}
                    className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-8"
                >
                    <HolographicStat number="1000+" label="Active Events" delay={0} />
                    <HolographicStat number="5K+" label="Volunteers" delay={0.1} />
                    <HolographicStat number="500+" label="Organizers" delay={0.2} />
                    <HolographicStat number="99%" label="Success Rate" delay={0.3} />
                </motion.div>

                {/* About Section */}
                <motion.div
                    ref={aboutRef}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mt-40"
                >
                    <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-center mb-12 md:mb-20 holographic">
                        Meet the Visionary
                    </h2>

                    {/* Founder Card with 3D Effect */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="max-w-5xl mx-auto glass-morph p-6 md:p-12 rounded-3xl neon-border transform-3d"
                    >
                        <div className="flex flex-col md:flex-row items-center gap-12">
                            <motion.div
                                whileHover={{ scale: 1.05, rotateY: 5 }}
                                className="relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                                <img
                                    src="/founder.png"
                                    alt="Jay Viramgami"
                                    className="relative w-56 h-56 rounded-full border-4 border-cyan-500 shadow-2xl object-cover pulse-glow"
                                />
                            </motion.div>

                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-4xl font-bold text-white mb-2 neon-glow">Jay Viramgami</h3>
                                <p className="text-cyan-400 text-2xl mb-6 font-light">Founder & Chief Innovator</p>
                                <p className="text-gray-300 text-lg leading-relaxed mb-8">
                                    Building the future of event management through cutting-edge technology.
                                    Buztle represents a paradigm shift in how organizations connect with talent,
                                    powered by innovation and driven by purpose.
                                </p>

                                <div className="flex gap-4 justify-center md:justify-start">
                                    <SocialButton icon={<FiMail />} href="mailto:buztle.jay@gmail.com" label="Email" />
                                    <SocialButton icon={<FiLinkedin />} href="https://www.linkedin.com/in/jay-viramgami" label="LinkedIn" />
                                    <SocialButton icon={<FiGithub />} href="https://github.com/Jaykings123" label="GitHub" />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Mission Statement */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.02 }}
                        className="mt-16 max-w-4xl mx-auto glass-morph p-10 rounded-2xl border-2 border-purple-500/30 text-center"
                    >
                        <FiUsers className="text-6xl text-cyan-400 mx-auto mb-6" />
                        <h3 className="text-3xl font-bold text-white mb-6 neon-glow">Our Mission</h3>
                        <p className="text-gray-200 text-xl leading-relaxed">
                            Revolutionizing event staffing through technology, trust, and transparency.
                            We're creating a world where opportunities are accessible, verification is instant,
                            and connections are meaningful.
                        </p>
                    </motion.div>
                </motion.div>
            </div>

            {/* Futuristic Footer */}
            <footer className="relative z-10 bg-black/40 backdrop-blur-xl border-t border-cyan-500/20 mt-40">
                <div className="container mx-auto px-6 py-12">
                    <div className="text-center">
                        <div className="flex justify-center gap-8 mb-6">
                            <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Terms</a>
                            <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Privacy</a>
                            <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Contact</a>
                        </div>
                        <p className="text-gray-500 text-sm">© 2025 Buztle. Shaping the Future of Work.</p>
                        <p className="text-cyan-500 text-sm mt-2 font-mono">Created by Jay Viramgami</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

// 3D Tilt Card Component
const TiltCard = ({ icon, title, description, gradient }) => {
    const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

    const handleMouseMove = (e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        setTilt({ rotateX, rotateY });
    };

    const handleMouseLeave = () => {
        setTilt({ rotateX: 0, rotateY: 0 });
    };

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            whileHover={{ scale: 1.05 }}
            style={{
                transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
                transition: 'transform 0.1s ease-out'
            }}
            className="relative p-8 glass-morph rounded-3xl border border-white/10 overflow-hidden group"
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
            <div className="relative z-10">
                <div className="text-cyan-400 mb-6 transform group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 neon-glow">{title}</h3>
                <p className="text-gray-300 leading-relaxed">{description}</p>
            </div>
        </motion.div>
    );
};

// Magnetic Button Component
const MagneticButton = ({ children, onClick, className }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const buttonRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!buttonRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        setPosition({ x: x * 0.3, y: y * 0.3 });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    return (
        <motion.button
            ref={buttonRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: "spring", stiffness: 150, damping: 15 }}
            className={className}
        >
            {children}
        </motion.button>
    );
};

// Holographic Stat Component
const HolographicStat = ({ number, label, delay }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.5, type: "spring" }}
        whileHover={{ scale: 1.1, y: -10 }}
        className="text-center p-8 glass-morph rounded-2xl border border-cyan-500/20 neon-border transform-3d"
    >
        <div className="text-5xl md:text-6xl font-bold holographic mb-3">{number}</div>
        <div className="text-cyan-300 font-light text-lg">{label}</div>
    </motion.div>
);

// Social Button Component
const SocialButton = ({ icon, href, label }) => (
    <motion.a
        whileHover={{ scale: 1.2, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 flex items-center justify-center glass-morph border-2 border-cyan-500/30 rounded-full text-cyan-400 hover:border-cyan-500 hover:text-cyan-300 transition-all neon-border"
        aria-label={label}
    >
        {icon}
    </motion.a>
);

export default Landing;
