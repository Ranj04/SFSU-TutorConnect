-- Simplified media system for tutor file uploads with moderation
-- DROP TABLE IF EXISTS media_assets;

CREATE TABLE IF NOT EXISTS media_assets (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  posting_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(180) NULL,
  description TEXT NULL,
  url VARCHAR(500) NOT NULL,
  media_type ENUM('image','video','document') NOT NULL,
  mime_type VARCHAR(100) NULL,
  byte_size BIGINT UNSIGNED NULL,
  view_count INT UNSIGNED NOT NULL DEFAULT 0,
  display_order INT UNSIGNED NULL,
  status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  reviewed_by BIGINT UNSIGNED NULL,
  reviewed_at DATETIME(6) NULL,
  rejection_reason VARCHAR(500) NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  CONSTRAINT fk_media_assets_posting FOREIGN KEY (posting_id) REFERENCES postings(id) ON DELETE CASCADE,
  CONSTRAINT fk_media_assets_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_media_assets_reviewer FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_media_posting (posting_id, created_at),
  INDEX idx_media_status (status, created_at),
  INDEX idx_media_display_order (posting_id, display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
