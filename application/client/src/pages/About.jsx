/**
 * About.jsx
 * ---------
 * The about page that introduces the team behind TutorConnect. Shows the
 * project lead prominently and lists all team members with their roles
 * and photos.
 *
 * Contributors: Ranjiv Jithendran, Team 02
 */
import TeamCard from "../components/TeamCard";
import React from 'react';
import { Link } from 'react-router-dom';
import { teamMembers } from "../data/team";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import gatorMascot from "/assets/gator-mascot.png";

export default function About() {
  // Identify our project lead so we can spotlight them in the hero column
  const lead = teamMembers.find(m => m.title.toLowerCase().includes("team leader"));
  const others = teamMembers.filter(m => m.id !== lead.id);

  return (
    <div className="about-page-container">
      {/* Floating Background Shapes */}
      <div className="floating-shapes">
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
      </div>

      <div className="container py-5 text-center">
      {/* Title with mascots */}
      <div className="d-flex justify-content-center align-items-center mb-3 position-relative">
        <motion.img
          src={gatorMascot}
          alt="SFSU Mascot Left"
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1, y: [0, -5, 0] }}
          transition={{ x: { duration: 1 }, opacity: { duration: 1 }, y: { delay: 1.2, duration: 0.6, repeat: Infinity, repeatDelay: 3 } }}
          style={{ width: "60px", height: "60px", marginRight: "15px" }}
        />

        <motion.h1
          className="about-title fw-bold text-sfsu-purple"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <motion.span
            animate={{ rotate: [0, -5, 5, -3, 3, 0] }}
            transition={{ delay: 1.2, duration: 0.6 }}
            style={{ display: "inline-block" }}
          >
            Meet Our Gators
          </motion.span>
        </motion.h1>

        <motion.img
          src={gatorMascot}
          alt="SFSU Mascot Right"
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1, y: [0, -5, 0] }}
          transition={{ x: { duration: 1 }, opacity: { duration: 1 }, y: { delay: 1.2, duration: 0.6, repeat: Infinity, repeatDelay: 3 } }}
          style={{ width: "60px", height: "60px", marginLeft: "15px", transform: "scaleX(-1)" }}
        />
      </div>

      {/* Description text */}
      <motion.p
        className="text-muted mb-5"
        style={{ fontSize: '0.9rem', maxWidth: '600px', margin: '0 auto' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
      >
        <span style={{ fontSize: '1.2rem' }}>BY SFSU students, for SFSU students.</span><br />Get to know the  SFSU students behind this project. Each team member brings unique skills, perspectives, and passion to our collaborative effort.
      </motion.p>

      {/* Team Layout */}
      <div className="team-container d-flex justify-content-center gap-5 flex-wrap">
        {/* Left: Lead */}
        <div className="lead-column d-flex justify-content-center align-items-center">
          <Link to={`/about/${lead.id}`} className="team-link" key={`lead-${lead.id}`}>
            <TeamCard member={lead} isLead={true} />
          </Link>
        </div>

        {/* Right: 2x2 grid */}
        <div className="members-grid d-grid">
          {others.map(member => (
            <Link key={member.id} to={`/about/${member.id}`} className="team-link">
              <TeamCard member={member} isLead={false} />
            </Link>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
}
