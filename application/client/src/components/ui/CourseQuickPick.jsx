/**
 * CourseQuickPick.jsx
 * -------------------
 * A helper component that shows a dropdown of SFSU courses.
 * Used on the posting form to help tutors quickly add classes.
 *
 * Contributors: Ranjiv Jithendran, Team 02
 */
import React, { useEffect, useState } from "react";
import { getCourses } from "../../services/api";

export default function CourseQuickPick({
  label = "SFSU Course",
  value, // course ID
  onChange,
  helperText = "Pick a course code to help tutees find you by SFSU class.",
}) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadCourses() {
      try {
        setLoading(true);
        setError(null);
        const data = await getCourses();
        setCourses(data.courses || []);
      } catch (err) {
        console.error("Failed to load courses:", err);
        setError("Unable to load SFSU courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, []);

  // Bubble up the selected course so parent forms can store it
  const handleChange = (e) => {
    const selectedId = e.target.value ? parseInt(e.target.value, 10) : null;
    const course = courses.find((c) => c.id === selectedId) || null;
    if (onChange) onChange(course);
  };

  return (
    <div className="form-group mb-3">
      {label && <label className="form-label">{label}</label>}
      <select
        className="form-select"
        value={value || ""}
        onChange={handleChange}
        disabled={loading || !!error}
      >
        <option value="">Select a course (optional)</option>
        {courses.map((course) => {
          const labelText = `${course.department} ${course.course_number} - ${course.title}`;
          return (
            <option key={course.id} value={course.id}>
              {labelText}
            </option>
          );
        })}
      </select>
      {loading && (
        <small className="form-text text-muted d-block mt-1">
          Loading courses...
        </small>
      )}
      {error && (
        <small className="form-text text-danger d-block mt-1">
          {error}
        </small>
      )}
      {helperText && (
        <small className="form-text text-muted d-block mt-1">
          {helperText}
        </small>
      )}
    </div>
  );
}
