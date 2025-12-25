-- Reports and moderation workflow
-- DROP TABLE IF EXISTS reports;

CREATE TABLE IF NOT EXISTS reports (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  reporter_user_id BIGINT UNSIGNED NOT NULL,
  target_type ENUM('posting','user','media','review') NOT NULL,
  target_id BIGINT UNSIGNED NOT NULL,
  reason VARCHAR(500) NOT NULL,
  status ENUM('open','in_review','resolved','dismissed') NOT NULL DEFAULT 'open',
  admin_notes TEXT NULL,
  handled_by BIGINT UNSIGNED NULL,
  handled_at DATETIME(6) NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  CONSTRAINT fk_reports_reporter FOREIGN KEY (reporter_user_id) REFERENCES users(id) ON DELETE RESTRICT,
  CONSTRAINT fk_reports_handled_by FOREIGN KEY (handled_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_reports_status (status),
  INDEX idx_reports_target (target_type, target_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



