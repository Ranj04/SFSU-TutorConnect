-- Social features: favorites and reviews
-- DROP TABLE IF EXISTS reviews;
-- DROP TABLE IF EXISTS favorites;

CREATE TABLE IF NOT EXISTS favorites (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  student_user_id BIGINT UNSIGNED NOT NULL,
  posting_id BIGINT UNSIGNED NOT NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  CONSTRAINT uq_favorites_student_posting UNIQUE (student_user_id, posting_id),
  CONSTRAINT fk_favorites_student FOREIGN KEY (student_user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_favorites_posting FOREIGN KEY (posting_id) REFERENCES postings(id) ON DELETE CASCADE,
  INDEX idx_favorites_student (student_user_id),
  INDEX idx_favorites_posting (posting_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS reviews (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  reviewer_user_id BIGINT UNSIGNED NOT NULL,
  target_type ENUM('posting','user') NOT NULL,
  target_id BIGINT UNSIGNED NOT NULL,
  rating TINYINT UNSIGNED NOT NULL,
  comment TEXT NULL,
  is_approved BOOLEAN NOT NULL DEFAULT TRUE,
  is_flagged BOOLEAN NOT NULL DEFAULT FALSE,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  CONSTRAINT chk_reviews_rating CHECK (rating BETWEEN 1 AND 5),
  CONSTRAINT fk_reviews_reviewer FOREIGN KEY (reviewer_user_id) REFERENCES users(id) ON DELETE RESTRICT,
  CONSTRAINT uq_reviews_reviewer_target UNIQUE (reviewer_user_id, target_type, target_id),
  INDEX idx_reviews_target (target_type, target_id),
  INDEX idx_reviews_reviewer (reviewer_user_id),
  INDEX idx_reviews_moderation (is_approved, is_flagged)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


