/**
 * SkeletonCard.jsx
 * ----------------
 * A placeholder card with a shimmer animation shown while content is loading.
 * Respects the user's reduced motion preferences.
 *
 * Contributors: Ranjiv Jithendran, Team 02
 */
import React from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

export default function SkeletonCard() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div className="card h-100 shadow-sm skeleton-card">
      <div className="card-body">
        <div className="text-center mb-3">
          <div className="skeleton-avatar skeleton-shimmer" />
          <div className="skeleton-title skeleton-shimmer" />
        </div>
        <div className="skeleton-line skeleton-shimmer" />
        <div className="skeleton-line skeleton-shimmer" style={{ width: '80%' }} />
        <div className="skeleton-badges d-flex gap-2 justify-content-center mt-3">
          <div className="skeleton-badge skeleton-shimmer" />
          <div className="skeleton-badge skeleton-shimmer" />
        </div>
      </div>
      <style>{`
        .skeleton-card {
          opacity: 0.7;
        }
        .skeleton-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #e0e0e0;
          margin: 0 auto 12px;
        }
        .skeleton-title {
          width: 120px;
          height: 20px;
          background: #e0e0e0;
          border-radius: 4px;
          margin: 0 auto 16px;
        }
        .skeleton-line {
          height: 12px;
          background: #e0e0e0;
          border-radius: 4px;
          margin-bottom: 8px;
        }
        .skeleton-badge {
          width: 60px;
          height: 24px;
          background: #e0e0e0;
          border-radius: 12px;
        }
        ${!prefersReducedMotion ? `
          @keyframes shimmer {
            0% {
              background-position: -1000px 0;
            }
            100% {
              background-position: 1000px 0;
            }
          }
          .skeleton-shimmer {
            background: linear-gradient(
              90deg,
              #e0e0e0 0px,
              #f0f0f0 40px,
              #e0e0e0 80px
            );
            background-size: 1000px 100%;
            animation: shimmer 2s infinite linear;
          }
        ` : ''}
      `}</style>
    </div>
  );
}


