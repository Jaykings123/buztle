'use client';
import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { FiUsers, FiCalendar, FiDollarSign, FiCheckCircle, FiMail, FiLinkedin, FiGithub, FiArrowRight, FiArrowUp, FiZap } from 'react-icons/fi';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const aboutRef = useRef(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const { scrollYProgress } = useScroll();
  const yPosAnim = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacityAnim = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  // Show scroll-to-top button when scrolled down
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToAbout = () => {
    aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen gradient-bg" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 glass-nav rounded-full px-4 sm:px-6 py-3"
      >
        <div className="flex items-center gap-3 sm:gap-6">
          <span className="text-lg sm:text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Buztle</span>
          <div className="hidden md:flex items-center gap-6">
            <button onClick={scrollToAbout} className="nav-link text-sm">About</button>
            <a href="#features" className="nav-link text-sm">Features</a>
            <a href="#contact" className="nav-link text-sm">Contact</a>
          </div>
          <ThemeToggle />
          <button
            onClick={() => isSignedIn ? router.push('/dashboard') : router.push('/sign-in')}
            className="btn-primary text-xs sm:text-sm py-2 px-3 sm:px-4"
          >
            {isSignedIn ? 'Dashboard' : 'Get Started'}
          </button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center pt-24 sm:pt-20 pb-8 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ y: yPosAnim, opacity: opacityAnim }}
          className="text-center max-w-5xl mx-auto flex-1 flex flex-col justify-center"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            className="w-24 h-24 mx-auto mb-8 rounded-2xl overflow-hidden hero-glow"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
          >
            <img
              src="/logo.png"
              alt="Buztle Logo"
              className="w-full h-full object-contain p-2"
            />
          </motion.div>

          {/* Hero Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="heading-xl mb-6"
          >
            Event Management That{' '}
            <span className="text-accent relative">
              Scales
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                <path d="M2 6C50 2 150 2 198 6" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-body max-w-2xl mx-auto mb-10"
          >
            The future of volunteer networking. Connect with opportunities,
            manage events effortlessly, and build meaningful connections.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4"
          >
            <button
              onClick={() => isSignedIn ? router.push('/dashboard') : router.push('/sign-in')}
              className="btn-primary text-sm sm:text-base"
            >
              <FiZap className="text-lg" />
              {isSignedIn ? 'Go to Dashboard' : 'Launch App'}
              <FiArrowRight className="text-lg" />
            </button>

            <button
              onClick={scrollToAbout}
              className="btn-secondary text-sm sm:text-base"
            >
              Learn More
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6"
          >
            <StatCard number="1000+" label="Active Events" delay={0} />
            <StatCard number="5K+" label="Volunteers" delay={0.1} />
            <StatCard number="500+" label="Organizers" delay={0.2} />
            <StatCard number="99%" label="Success Rate" delay={0.3} />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="heading-lg mb-4">Why Choose <span className="text-accent">Buztle</span>?</h2>
            <p className="text-body max-w-2xl mx-auto">
              Built for modern event management with powerful features that help you succeed.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<FiCalendar className="text-2xl" />}
              title="Smart Matching"
              description="AI-powered matching connects the right volunteers with perfect opportunities."
              delay={0}
            />
            <FeatureCard
              icon={<FiCheckCircle className="text-2xl" />}
              title="Instant Verification"
              description="Secure verification system ensures trust and safety for all users."
              delay={0.1}
            />
            <FeatureCard
              icon={<FiDollarSign className="text-2xl" />}
              title="Easy Payments"
              description="Transparent pricing with instant settlements and payment tracking."
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} id="about" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="heading-lg mb-4">Meet the <span className="text-accent">Visionary</span></h2>
          </motion.div>

          {/* Founder Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-8 md:p-12 max-w-4xl mx-auto"
          >
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500 rounded-full blur-2xl opacity-20"></div>
                <img
                  src="/founder.png"
                  alt="Jay Viramgami"
                  className="relative w-40 h-40 md:w-48 md:h-48 rounded-full object-cover border-4 border-white shadow-xl"
                />
              </div>

              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Jay Viramgami</h3>
                <p className="text-accent font-semibold mb-4">Founder & Chief Innovator</p>
                <p className="text-body mb-6">
                  Building the future of event management through cutting-edge technology.
                  Buztle represents a paradigm shift in how organizations connect with talent.
                </p>

                <div className="flex gap-3 justify-center md:justify-start">
                  <SocialButton icon={<FiMail />} href="mailto:buztle.jay@gmail.com" />
                  <SocialButton icon={<FiLinkedin />} href="https://www.linkedin.com/in/jay-viramgami" />
                  <SocialButton icon={<FiGithub />} href="https://github.com/Jaykings123" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Mission Statement */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 max-w-3xl mx-auto text-center card p-8"
          >
            <div className="icon-box mx-auto mb-4">
              <FiUsers />
            </div>
            <h3 className="heading-md mb-4">Our Mission</h3>
            <p className="text-body">
              Revolutionizing event staffing through technology, trust, and transparency.
              We're creating a world where opportunities are accessible and connections are meaningful.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-12 px-6" style={{ backgroundColor: 'var(--bg-dark)', color: '#FAFAFA' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h4 className="text-2xl font-bold mb-2">Buztle</h4>
              <p className="text-gray-400 text-sm">Shaping the Future of Work</p>
            </div>

            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy</a>
              <a href="mailto:buztle.jay@gmail.com" className="text-gray-400 hover:text-white transition-colors text-sm">Contact</a>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-500 text-sm">© 2025 Buztle. All rights reserved.</p>
            <p className="text-accent text-sm mt-1">Created by Jay Viramgami</p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-50"
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: 'white',
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Scroll to top"
          >
            <FiArrowUp className="text-xl" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

// Stat Card Component
const StatCard = ({ number, label, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ y: -4 }}
    className="stat-card"
  >
    <div className="stat-number">{number}</div>
    <div className="stat-label">{label}</div>
  </motion.div>
);

// Feature Card Component
const FeatureCard = ({ icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ y: -8 }}
    className="card card-body text-center"
  >
    <div className="icon-box mx-auto mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{title}</h3>
    <p style={{ color: 'var(--text-secondary)' }}>{description}</p>
  </motion.div>
);

// Social Button Component
const SocialButton = ({ icon, href }) => (
  <motion.a
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 flex items-center justify-center rounded-full transition-all"
    style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-secondary)' }}
  >
    {icon}
  </motion.a>
);
