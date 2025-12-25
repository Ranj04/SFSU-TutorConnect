-- Messaging system for student-tutor communication
-- DROP TABLE IF EXISTS messages;

CREATE TABLE IF NOT EXISTS messages (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  sender_user_id BIGINT UNSIGNED NOT NULL,
  recipient_user_id BIGINT UNSIGNED NOT NULL,
  posting_id BIGINT UNSIGNED NULL,
  posting_title_snapshot VARCHAR(255) NULL,
  message_text TEXT NOT NULL,
  contact_info VARCHAR(255) NOT NULL DEFAULT '',
  connection_status ENUM('pending','accepted','declined') NOT NULL DEFAULT 'pending',
  sent_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  parent_message_id BIGINT UNSIGNED NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  CONSTRAINT fk_messages_sender FOREIGN KEY (sender_user_id) REFERENCES users(id) ON DELETE RESTRICT,
  CONSTRAINT fk_messages_recipient FOREIGN KEY (recipient_user_id) REFERENCES users(id) ON DELETE RESTRICT,
  CONSTRAINT fk_messages_posting FOREIGN KEY (posting_id) REFERENCES postings(id) ON DELETE SET NULL,
  CONSTRAINT fk_messages_parent FOREIGN KEY (parent_message_id) REFERENCES messages(id) ON DELETE SET NULL,
  INDEX idx_messages_recipient (recipient_user_id, is_read),
  INDEX idx_messages_sender (sender_user_id, sent_at),
  INDEX idx_messages_posting_sender_status (posting_id, sender_user_id, connection_status),
  INDEX idx_messages_posting (posting_id),
  INDEX idx_messages_thread (parent_message_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

