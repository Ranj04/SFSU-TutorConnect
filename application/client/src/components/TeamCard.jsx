/**
 * TeamCard.jsx
 * ------------
 * A card component that displays a team member's photo and name on the
 * About page. Links to their full profile with more details.
 *
 * Contributors: Ranjiv Jithendran, Team 02
 */
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function TeamCard({ member, isLead }) {
  // Each card animates in and tweaks layout if this teammate is the project lead
  return (
    <motion.div
      className={`team-image-card ${isLead ? "lead-card" : "member-card"}`}
      style={{
        width: isLead ? "260px" : "220px",
        height: isLead ? "420px" : "280px",
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ scale: 1.02, y: -8 }}
    >
      <img src={member.image} alt={member.name} />
      {/* Layer social handle buttons directly on top of the portrait */}
      
      {/* Social Media Icons */}
      <div className="social-icons">
        {member.socials?.linkedin && (
          <motion.a
            href={member.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon linkedin"
            onClick={(e) => e.stopPropagation()}
            whileHover={{ scale: 1.2, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <i className="fab fa-linkedin-in"></i>
          </motion.a>
        )}
        {member.socials?.github && (
          <motion.a
            href={member.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon github"
            onClick={(e) => e.stopPropagation()}
            whileHover={{ scale: 1.2, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <i className="fab fa-github"></i>
          </motion.a>
        )}
        {member.socials?.portfolio && (
          <motion.a
            href={member.socials.portfolio}
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon portfolio"
            onClick={(e) => e.stopPropagation()}
            whileHover={{ scale: 1.2, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <i className="fas fa-globe"></i>
          </motion.a>
        )}
      </div>

      <div className="card-overlay d-flex flex-column justify-content-end">
        <motion.h5
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {member.name}
        </motion.h5>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {member.title}
        </motion.p>
        {/* draft code */}
        {/* <Link
          to={`/about/${member.id}`}
          className="btn view-profile-btn mt-2"
        >
          <span>View Profile</span>
        </Link> */}
        {/* Placeholder CTA – link will route to detail view once bios are ready */}
        <div className="btn view-profile-btn mt-2">
          <span>View Profile</span>
        </div>

      </div>
    </motion.div>
  );
}
