/**
 * MemberDetail.jsx
 * ----------------
 * Shows the full profile for an individual team member from the About page.
 * Displays their photo, title, bio, and social links like GitHub and LinkedIn.
 *
 * Contributors: Ranjiv Jithendran, Adea Mulaku
 *  Team Members Data Authors — content, images, and profile information
 *
 * ------------------
 * File: MemberDetail.jsx
 */
import { useParams, Link } from "react-router-dom";
import { teamMembers } from "../data/team";

export default function MemberDetail() {
  const { id } = useParams();
  const member = teamMembers.find(m => m.id === id); // look up teammate via route param slug

  if (!member) {
    return (
      <div className="container py-5 text-center">
        <p className="text-danger">Member not found</p>
        <Link to="/about" className="btn btn-sfsu-purple mt-3">Back to Team</Link>
      </div>
    );
  }

  return (
    <div className="container py-5 bg-cream rounded-4 shadow-sm">
      {/* Profile */}
      <div className="text-center mb-4">
        <img
          src={member.image}
          alt={member.name}
          className="rounded-circle mb-3 shadow"
          style={{ width: "200px", height: "200px", objectFit: "cover" }}
        />
        <h2 className="text-sfsu-purple fw-bold">{member.name}</h2>
        <p className="text-muted mb-2">{member.title}</p>
      </div>

      {/* Bio with newline support */}
      <div className="text-center mb-4 px-3">
        <p className="fs-5" style={{ whiteSpace: 'pre-wrap' }}>
          {member.bio.split('\n').map((line, idx) => (
            <span key={idx}>
              {line}
              {idx !== member.bio.split('\n').length - 1 && <br />}
            </span>
          ))}
        </p>
      </div>

      {/* Social Links */}
      <div className="text-center mt-4 d-flex justify-content-center gap-4">
        {member.socials?.linkedin && (
          <a
            href={member.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
          >
            <i className="bi bi-linkedin fs-2"></i>
          </a>
        )}
        {member.socials?.github && (
          <a
            href={member.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
          >
            <i className="bi bi-github fs-2"></i>
          </a>
        )}
        {member.socials?.portfolio && (
          <a
            href={member.socials.portfolio}
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
          >
            <i className="bi bi-globe fs-2"></i>
          </a>
        )}
      </div>

      {/* Back button */}
      <div className="text-center mt-5">
        <Link to="/about" className="btn btn-sfsu-purple">
          Back to Team
        </Link>
      </div>
    </div>
  );
}
