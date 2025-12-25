/**
 * GatorAuthBackground.jsx
 * -----------------------
 * A sleek, Gator-themed animated background for auth pages.
 * Features a subtle gator silhouette, scale patterns, and SFSU colors.
 *
 * Contributors: Ranjiv Jithendran
 */
import React from "react";
import "./GatorAuthBackground.css";

export default function GatorAuthBackground() {
  return (
    <div className="gator-auth-bg">
      {/* Gradient background */}
      <div className="gator-gradient" />
      
      {/* Animated scale pattern */}
      <div className="gator-scales" />

      {/* Floating scale particles */}
      <div className="gator-particles">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="gator-scale-particle"
            style={{
              left: `${10 + i * 12}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + (i % 3)}s`,
            }}
          />
        ))}
      </div>

      {/* Corner accents */}
      <div className="gator-corner gator-corner-tl" />
      <div className="gator-corner gator-corner-br" />
      
      {/* Subtle wave lines */}
      <svg className="gator-waves" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path
          className="gator-wave gator-wave-1"
          d="M0,60 Q300,20 600,60 T1200,60 V120 H0 Z"
        />
        <path
          className="gator-wave gator-wave-2"
          d="M0,80 Q300,40 600,80 T1200,80 V120 H0 Z"
        />
      </svg>
    </div>
  );
}

