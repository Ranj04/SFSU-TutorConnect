-- Core tables: users, user_profiles
-- Development resets (guarded). Comment out in production.
-- DROP TABLE IF EXISTS user_profiles;
-- DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  profile_photo_url VARCHAR(512) NULL,
  major VARCHAR(100) NULL,
  account_status ENUM('active','inactive','suspended') NOT NULL DEFAULT 'active',
  last_login DATETIME(6) NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  CONSTRAINT chk_sfsu_email CHECK (email LIKE '%@sfsu.edu'),
  CONSTRAINT uq_users_email UNIQUE (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS user_profiles (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  bio TEXT NULL,
  major VARCHAR(100) NULL,
  preferred_meeting_modes ENUM('in_person','online','hybrid') NULL DEFAULT 'hybrid',
  preferred_meeting_location VARCHAR(255) NULL,
  overall_avg_rating DECIMAL(3,2) NULL,
  overall_review_count INT UNSIGNED NOT NULL DEFAULT 0,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  CONSTRAINT uq_user_profiles_user UNIQUE (user_id),
  CONSTRAINT fk_user_profiles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
  FULLTEXT KEY ft_user_profiles_bio (bio),
  INDEX idx_user_profiles_rating (overall_avg_rating DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


