-- Postings table: The core entity for the new design
-- DROP TABLE IF EXISTS postings;

CREATE TABLE IF NOT EXISTS postings (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  course_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  rejection_reason VARCHAR(500) NULL,
  availability_notes VARCHAR(255) NULL,
  avg_rating DECIMAL(3,2) NULL,
  review_count INT UNSIGNED NOT NULL DEFAULT 0,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  
  CONSTRAINT fk_postings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_postings_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE RESTRICT,
  
  INDEX idx_postings_user (user_id),
  INDEX idx_postings_status (status, created_at),
  INDEX idx_postings_course (course_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
