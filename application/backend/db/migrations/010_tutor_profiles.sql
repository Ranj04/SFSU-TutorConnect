-- =====================================================================
-- Migration 010: Tutor Profiles & Associations
-- =====================================================================
-- The application's ORM (app/db/models.py) and the tutor-profile API
-- endpoints (PATCH /api/auth/users/{id}/tutor-profile, GET .../profile)
-- operate on a `tutor_profiles` table plus `tutor_subjects` / `tutor_courses`
-- association tables. Earlier migrations only created a vestigial
-- `user_profiles` table, so those endpoints failed at runtime against the
-- migrated database. This migration creates the tables the ORM expects,
-- column-for-column, reconciling the schema with the code.
-- =====================================================================

CREATE TABLE IF NOT EXISTS tutor_profiles (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL UNIQUE,
    bio TEXT NULL,
    years_of_experience INT NULL,
    tutoring_format ENUM('in_person', 'online', 'hybrid') NULL DEFAULT 'hybrid',
    preferred_meeting_location VARCHAR(255) NULL,
    verification_status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    verified_at DATETIME(6) NULL,
    verified_by BIGINT UNSIGNED NULL,
    rejection_reason VARCHAR(500) NULL,
    avg_rating DECIMAL(3,2) NULL,
    review_count INT NOT NULL DEFAULT 0,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    CONSTRAINT fk_tutor_profiles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_tutor_profiles_verifier FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_tutor_profiles_status (verification_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS tutor_subjects (
    tutor_profile_id BIGINT UNSIGNED NOT NULL,
    subject_id BIGINT UNSIGNED NOT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (tutor_profile_id, subject_id),
    CONSTRAINT fk_tutor_subjects_profile FOREIGN KEY (tutor_profile_id) REFERENCES tutor_profiles(id) ON DELETE CASCADE,
    CONSTRAINT fk_tutor_subjects_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS tutor_courses (
    tutor_profile_id BIGINT UNSIGNED NOT NULL,
    course_id BIGINT UNSIGNED NOT NULL,
    qualification VARCHAR(500) NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (tutor_profile_id, course_id),
    CONSTRAINT fk_tutor_courses_profile FOREIGN KEY (tutor_profile_id) REFERENCES tutor_profiles(id) ON DELETE CASCADE,
    CONSTRAINT fk_tutor_courses_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================================
-- End of Migration 010
-- =====================================================================
