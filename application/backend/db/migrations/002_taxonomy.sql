-- Taxonomy tables: subjects, courses
-- DROP TABLE IF EXISTS courses;
-- DROP TABLE IF EXISTS subjects;

CREATE TABLE IF NOT EXISTS subjects (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  slug VARCHAR(140) NOT NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  CONSTRAINT uq_subjects_name UNIQUE (name),
  CONSTRAINT uq_subjects_slug UNIQUE (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS courses (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  department VARCHAR(16) NOT NULL,
  course_number VARCHAR(16) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  level ENUM('undergraduate','graduate','both') NULL DEFAULT 'undergraduate',
  credits TINYINT UNSIGNED NULL,
  prerequisites TEXT NULL,
  subject_id BIGINT UNSIGNED NOT NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  CONSTRAINT uq_course_code UNIQUE (department, course_number),
  CONSTRAINT fk_courses_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE RESTRICT,
  FULLTEXT KEY ft_courses_title (title),
  FULLTEXT KEY ft_courses_search (department, course_number, title),
  FULLTEXT KEY ft_courses_description (description),  -- For M3+ enhanced course description search
  INDEX idx_courses_subject (subject_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


