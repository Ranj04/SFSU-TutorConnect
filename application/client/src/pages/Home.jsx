/**
 * Home.jsx
 * --------
 * The main landing page for the SFSU tutoring platform. Displays the hero
 * section with the tagline, the animated hero section, testimonials marquee,
 * and value proposition cards. This is the first page visitors see.
 *
 * Contributors: Ranjiv Jithendran, Adea Mulaku
 *  Ranjiv Jithendran — styling updates
 *  M4 Implementation — unified SearchBar in navbar, animations and testimonials
 *
 * -------------------
 * File: Home.jsx
 */
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import { useInViewOnce } from "../hooks/useInViewOnce";
import TestimonialsMarquee from "../components/TestimonialsMarquee";
import HeroAnimation from "../components/HeroAnimation";

export default function Home() {
  const [heroRef, heroInView] = useInViewOnce({ threshold: 0.2 });
  const [cardsRef, cardsInView] = useInViewOnce({ threshold: 0.1 });
  const heroInnerRef = useRef(null);

  // Add animated class to hero when it enters view
  useEffect(() => {
    if (heroInView && heroInnerRef.current) {
      heroInnerRef.current.classList.add('animated');
    }
  }, [heroInView]);

  // Animation variants for value cards
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  return (
    <>
      <main className="home-main">
        {/* Hero container: centered with spacing on all sides */}
        <section className="hero-container" ref={heroRef}>
          <div className="hero-inner text-center" ref={heroInnerRef}>
            <div className="eyebrow">Your Academic Success Partner</div>
            <h1 className="hero-title">Feeling Lost this Semester?</h1>
            <p className="hero-tagline">Your SFSU academic partner</p>
            <p className="hero-sub">
              Connect with expert tutors, access quality tutorials, and get the academic support you need to excel in your SFSU courses.
            </p>
          </div>
        </section>

        {/* Animated section between hero and testimonials */}
        <HeroAnimation />

        {/* Student Reviews Marquee */}
        <TestimonialsMarquee direction="left" speed={40} pauseOnHover={true} />

        {/* What We Offer + Value Cards */}
        <section className="what-we-offer" ref={cardsRef}>
          <motion.div
            className="offer-header"
            initial={{ opacity: 0, y: 20 }}
            animate={cardsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2>What We Offer</h2>
            <p className="offer-sub">Everything you need to succeed academically</p>
          </motion.div>

          <div className="value-cards-row">
            {[
              {
                icon: "📚",
                title: "Real SFSU courses",
                desc: "Tutors matched to your exact course codes",
              },
              {
                icon: "✓",
                title: "Verified peers",
                desc: "All tutors are current SFSU students or alumni",
              },
              {
                icon: "💬",
                title: "Message before booking",
                desc: "Chat first to ensure the right fit",
              },
            ].map((card, index) => (
              <motion.div
                key={card.title}
                className="value-card"
                custom={index}
                initial="hidden"
                animate={cardsInView ? "visible" : "hidden"}
                variants={cardVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <div className="value-icon">{card.icon}</div>
                <h3>{card.title}</h3>
                <p className="muted">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="home-footer">
          <div className="footer-content">
            <Link to="/about" className="footer-link">About</Link>
            <span className="footer-separator">•</span>
            <Link to="/terms" className="footer-link">Terms of Service</Link>
            <span className="footer-separator">•</span>
            <Link to="/become-tutor" className="footer-link">Become a Tutor</Link>
          </div>
        </footer>
      </main>
    </>
  );
}
