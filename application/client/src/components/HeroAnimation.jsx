/**
 * HeroAnimation.jsx
 * -----------------
 * A visually engaging animated section that sits between the hero and
 * testimonials on the landing page. Features floating academic icons,
 * an aurora gradient effect, animated waves, and a pulsing orb with
 * SFSU colors.
 *
 * Contributors: Ranjiv Jithendran, Team 02
 */
import React from "react";
// eslint-disable-next-line no-unused-vars -- `motion` is used via <motion.*> JSX
import { motion } from "framer-motion";
import "./HeroAnimation.css";

// Floating academic icons as SVG
const BookIcon = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="2" fill="none"/>
  </svg>
);

const GraduationCapIcon = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 10l-10-5L2 10l10 5 10-5z"/>
    <path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5"/>
    <path d="M22 10v6"/>
  </svg>
);

const PencilIcon = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
  </svg>
);

const LightbulbIcon = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 18h6"/>
    <path d="M10 22h4"/>
    <path d="M12 2a7 7 0 0 0-4 12.7V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.3A7 7 0 0 0 12 2z"/>
  </svg>
);

const StarIcon = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const floatingElements = [
  { Icon: BookIcon, size: 40, x: "10%", delay: 0, duration: 6 },
  { Icon: GraduationCapIcon, size: 48, x: "85%", delay: 1, duration: 7 },
  { Icon: PencilIcon, size: 32, x: "20%", delay: 2, duration: 5 },
  { Icon: LightbulbIcon, size: 36, x: "75%", delay: 0.5, duration: 6.5 },
  { Icon: StarIcon, size: 24, x: "30%", delay: 3, duration: 5.5 },
  { Icon: BookIcon, size: 28, x: "65%", delay: 1.5, duration: 7.5 },
  { Icon: StarIcon, size: 20, x: "45%", delay: 2.5, duration: 6 },
  { Icon: GraduationCapIcon, size: 32, x: "55%", delay: 0.8, duration: 5.8 },
  { Icon: PencilIcon, size: 26, x: "92%", delay: 1.8, duration: 6.2 },
  { Icon: LightbulbIcon, size: 30, x: "5%", delay: 2.2, duration: 7 },
];

export default function HeroAnimation() {
  return (
    <div className="hero-animation-container">
      {/* Aurora gradient background */}
      <div className="aurora-bg">
        <div className="aurora-gradient aurora-1"></div>
        <div className="aurora-gradient aurora-2"></div>
        <div className="aurora-gradient aurora-3"></div>
      </div>

      {/* Floating particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Floating academic icons */}
      <div className="floating-icons">
        {floatingElements.map((el, index) => (
          <motion.div
            key={index}
            className="floating-icon"
            style={{ left: el.x }}
            initial={{ y: 100, opacity: 0 }}
            animate={{
              y: [100, -20, 100],
              opacity: [0, 0.7, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: el.duration,
              delay: el.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <el.Icon
              className="icon-svg"
              style={{ width: el.size, height: el.size }}
            />
          </motion.div>
        ))}
      </div>

      {/* Animated waves */}
      <svg className="waves-svg" viewBox="0 0 1440 120" preserveAspectRatio="none">
        <defs>
          <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(65, 21, 69, 0.3)" />
            <stop offset="50%" stopColor="rgba(200, 155, 60, 0.2)" />
            <stop offset="100%" stopColor="rgba(65, 21, 69, 0.3)" />
          </linearGradient>
        </defs>
        <path
          className="wave wave-1"
          fill="url(#wave-gradient)"
          d="M0,60 C320,100 420,20 720,60 C1020,100 1120,20 1440,60 L1440,120 L0,120 Z"
        />
        <path
          className="wave wave-2"
          fill="url(#wave-gradient)"
          d="M0,80 C280,40 380,100 720,80 C1060,60 1160,100 1440,80 L1440,120 L0,120 Z"
        />
      </svg>

      {/* Center content */}
      <div className="animation-content">
        <motion.div
          className="center-orb"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.6, 0.8, 0.6],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="orb-inner">
            <span className="orb-text">🎓</span>
          </div>
        </motion.div>
        <motion.p
          className="animation-tagline"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Join 500+ Gators in finding academic success
        </motion.p>
      </div>
    </div>
  );
}

