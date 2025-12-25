/**
 * TestimonialsMarquee.jsx
 * -----------------------
 * An infinite horizontal scrolling marquee of student testimonials.
 * Pauses on hover, supports manual scroll on mobile, and respects
 * reduced motion preferences. Has gradient fades on the edges.
 *
 * Contributors: Ranjiv Jithendran, Team 02
 */
import React, { useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const SAMPLE_TESTIMONIALS = [
  {
    id: 1,
    name: 'Sarah Chen',
    major: 'Computer Science',
    year: 'Junior',
    course: 'CSC 340',
    rating: 5,
    quote: 'My tutor helped me understand data structures in a way that finally clicked. Highly recommend!',
    verified: true,
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    major: 'Business',
    year: 'Sophomore',
    course: 'FIN 350',
    rating: 5,
    quote: 'Great experience! The tutor was patient and really knows their stuff. Aced my final!',
    verified: true,
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    major: 'Psychology',
    year: 'Senior',
    course: 'PSY 200',
    rating: 5,
    quote: 'So grateful for Tutor Connect. Found the perfect tutor for my statistics class.',
    verified: true,
  },
  {
    id: 4,
    name: 'David Kim',
    major: 'Engineering',
    year: 'Junior',
    course: 'MATH 226',
    rating: 5,
    quote: 'Calculus was impossible until I found my tutor here. Worth every minute!',
    verified: true,
  },
  {
    id: 5,
    name: 'Jessica Martinez',
    major: 'Biology',
    year: 'Sophomore',
    course: 'BIOL 230',
    rating: 5,
    quote: 'The best tutoring platform at SFSU. My tutor made organic chemistry manageable.',
    verified: true,
  },
  {
    id: 6,
    name: 'Ryan Thompson',
    major: 'Economics',
    year: 'Senior',
    course: 'ECON 301',
    rating: 4,
    quote: 'Really helpful for understanding macroeconomics concepts. Great communication!',
    verified: true,
  },
  {
    id: 7,
    name: 'Aisha Patel',
    major: 'Chemistry',
    year: 'Junior',
    course: 'CHEM 115',
    rating: 5,
    quote: 'My tutor broke down complex reactions into simple steps. Couldn\'t have done it without them!',
    verified: true,
  },
  {
    id: 8,
    name: 'Jordan Lee',
    major: 'Mathematics',
    year: 'Sophomore',
    course: 'MATH 227',
    rating: 5,
    quote: 'Linear algebra was tough, but my tutor made it clear. Excellent teaching style!',
    verified: true,
  },
  {
    id: 9,
    name: 'Taylor Brown',
    major: 'Physics',
    year: 'Senior',
    course: 'PHYS 220',
    rating: 5,
    quote: 'Physics became my favorite class thanks to the amazing tutors on this platform.',
    verified: true,
  },
  {
    id: 10,
    name: 'Alex Rivera',
    major: 'Computer Science',
    year: 'Junior',
    course: 'CSC 510',
    rating: 5,
    quote: 'Perfect for upper-division CS courses. Found help for algorithms and got an A!',
    verified: true,
  },
  {
    id: 11,
    name: 'Morgan Davis',
    major: 'Statistics',
    year: 'Senior',
    course: 'STAT 301',
    rating: 4,
    quote: 'Great platform for connecting with peer tutors. Very responsive and helpful!',
    verified: true,
  },
  {
    id: 12,
    name: 'Casey Wilson',
    major: 'Business',
    year: 'Junior',
    course: 'MKTG 431',
    rating: 5,
    quote: 'Marketing concepts finally make sense. My tutor was professional and knowledgeable.',
    verified: true,
  },
];

/**
 * Render star rating
 */
function StarRating({ rating }) {
  return (
    <div className="testimonial-rating" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`star ${i < rating ? 'star-filled' : 'star-empty'}`}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </div>
  );
}

/**
 * TestimonialsMarquee Component
 * @param {Object} props
 * @param {string} props.direction - 'left' or 'right' (default: 'left')
 * @param {number} props.speed - Animation duration in seconds (default: 40)
 * @param {number} props.pauseOnHover - Whether to pause on hover (default: true)
 */
export default function TestimonialsMarquee({ 
  direction = 'left', 
  speed = 40,
  pauseOnHover = true 
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Duplicate testimonials for seamless loop
  const duplicatedTestimonials = [...SAMPLE_TESTIMONIALS, ...SAMPLE_TESTIMONIALS];

  // For reduced motion, show static scrollable list
  if (prefersReducedMotion) {
    return (
      <section 
        className="testimonials-section"
        aria-label="Student reviews"
      >
        <div className="testimonials-header">
          <h2 className="testimonials-title">What Students Say</h2>
          <p className="testimonials-subtitle">Real reviews from SFSU students</p>
        </div>
        <div 
          className="testimonials-container-static"
          role="region"
          aria-label="Scrollable student reviews"
        >
          <div className="testimonials-list-static">
            {SAMPLE_TESTIMONIALS.map((testimonial) => (
              <div key={testimonial.id} className="testimonial-card">
                <StarRating rating={testimonial.rating} />
                <p className="testimonial-quote">"{testimonial.quote}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-author-info">
                    <strong>{testimonial.name}</strong>
                    <span className="testimonial-meta">
                      {testimonial.major} • {testimonial.year}
                    </span>
                    <span className="testimonial-course">{testimonial.course}</span>
                  </div>
                  {testimonial.verified && (
                    <span className="testimonial-badge" aria-label="Verified SFSU student">
                      ✓ Verified
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Animated marquee
  const animationDirection = direction === 'right' ? 'reverse' : 'normal';
  const animationStyle = {
    animationDuration: `${speed}s`,
    animationDirection: animationDirection,
    animationPlayState: pauseOnHover && isHovered ? 'paused' : 'running',
  };

  return (
    <section 
      className="testimonials-section"
      aria-label="Student reviews marquee"
    >
      <div className="testimonials-header">
        <h2 className="testimonials-title">What Students Say</h2>
        <p className="testimonials-subtitle">Real reviews from SFSU students</p>
      </div>
      
      <div 
        className="testimonials-marquee-wrapper"
        onMouseEnter={() => pauseOnHover && setIsHovered(true)}
        onMouseLeave={() => pauseOnHover && setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setIsHovered(false)}
      >
        {/* Left gradient fade */}
        <div className="testimonials-fade testimonials-fade-left" aria-hidden="true"></div>
        
        {/* Scrollable container */}
        <div 
          className="testimonials-container"
          ref={containerRef}
          style={animationStyle}
        >
          <div className="testimonials-track">
            {duplicatedTestimonials.map((testimonial, index) => (
              <div 
                key={`${testimonial.id}-${index}`} 
                className="testimonial-card"
              >
                <StarRating rating={testimonial.rating} />
                <p className="testimonial-quote">"{testimonial.quote}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-author-info">
                    <strong>{testimonial.name}</strong>
                    <span className="testimonial-meta">
                      {testimonial.major} • {testimonial.year}
                    </span>
                    <span className="testimonial-course">{testimonial.course}</span>
                  </div>
                  {testimonial.verified && (
                    <span className="testimonial-badge" aria-label="Verified SFSU student">
                      ✓ Verified
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Right gradient fade */}
        <div className="testimonials-fade testimonials-fade-right" aria-hidden="true"></div>
      </div>
    </section>
  );
}

