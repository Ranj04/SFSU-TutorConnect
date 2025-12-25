```mermaid
erDiagram
  users {
    BIGINT id PK
    VARCHAR(255) email
    VARCHAR(255) password_hash
    VARCHAR(50) first_name
    VARCHAR(50) last_name
    VARCHAR(512) profile_photo_url
    VARCHAR(100) major
    ENUM account_status
    DATETIME(6) last_login
    DATETIME(6) created_at
    DATETIME(6) updated_at
  }

  user_profiles {
    BIGINT id PK
    BIGINT user_id FK
    TEXT bio
    VARCHAR(100) major
    ENUM preferred_meeting_modes
    VARCHAR(255) preferred_meeting_location
    DECIMAL(3,2) overall_avg_rating
    INT overall_review_count
    DATETIME(6) created_at
    DATETIME(6) updated_at
  }

  subjects {
    BIGINT id PK
    VARCHAR(120) name
    VARCHAR(140) slug
    DATETIME(6) created_at
    DATETIME(6) updated_at
  }

  courses {
    BIGINT id PK
    VARCHAR(16) department
    VARCHAR(16) course_number
    VARCHAR(255) title
    TEXT description
    ENUM level
    TINYINT credits
    TEXT prerequisites
    BIGINT subject_id FK
    DATETIME(6) created_at
    DATETIME(6) updated_at
  }

  postings {
    BIGINT id PK
    BIGINT user_id FK
    BIGINT course_id FK
    VARCHAR(255) title
    TEXT description
    ENUM status
    VARCHAR(500) rejection_reason
    VARCHAR(255) availability_notes
    DECIMAL(3,2) avg_rating
    INT review_count
    DATETIME(6) created_at
    DATETIME(6) updated_at
  }

  favorites {
    BIGINT id PK
    BIGINT student_user_id FK
    BIGINT posting_id FK
    DATETIME(6) created_at
  }

  reviews {
    BIGINT id PK
    BIGINT reviewer_user_id FK
    ENUM target_type
    BIGINT target_id
    TINYINT rating
    TEXT comment
    BOOLEAN is_approved
    BOOLEAN is_flagged
    BOOLEAN is_deleted
    DATETIME(6) created_at
    DATETIME(6) updated_at
  }

  reports {
    BIGINT id PK
    BIGINT reporter_user_id FK
    ENUM target_type
    BIGINT target_id
    VARCHAR(500) reason
    ENUM status
    TEXT admin_notes
    BIGINT handled_by FK
    DATETIME(6) handled_at
    DATETIME(6) created_at
    DATETIME(6) updated_at
  }

  messages {
    BIGINT id PK
    BIGINT sender_user_id FK
    BIGINT recipient_user_id FK
    BIGINT tutor_profile_id FK
    BIGINT posting_id FK
    VARCHAR(255) posting_title_snapshot
    TEXT message_text
    DATETIME(6) sent_at
    BOOLEAN is_read
    BIGINT parent_message_id FK
    DATETIME(6) created_at
    DATETIME(6) updated_at
  }

  media_assets {
    BIGINT id PK
    BIGINT posting_id FK
    BIGINT user_id FK
    VARCHAR(180) title
    TEXT description
    VARCHAR(500) url
    ENUM media_type
    VARCHAR(100) mime_type
    BIGINT byte_size
    INT view_count
    INT display_order
    ENUM status
    BIGINT reviewed_by FK
    DATETIME(6) reviewed_at
    VARCHAR(500) rejection_reason
    DATETIME(6) created_at
    DATETIME(6) updated_at
  }

  %% Relationships
  users ||--|| user_profiles : "has profile"
  users ||--o{ postings : "creates"
  users ||--o{ favorites : "saves posting"
  users ||--o{ reviews : "writes"
  users ||--o{ reports : "files"
  users ||--o{ reports : "handles"
  users ||--o{ messages : "sends"
  users ||--o{ messages : "receives"
  users ||--o{ media_assets : "uploads/reviews"

  user_profiles ||--|| users : "belongs to"

  subjects ||--o{ courses : "has courses"
  courses ||--o{ postings : "listed for"

  postings ||--o{ favorites : "favorited"
  postings ||--o{ media_assets : "has media"
  postings ||--o{ messages : "conversation context"

  reviews }o--|| users : "reviewer"
  reviews }o--|| postings : "target (target_type=posting)"
  reviews }o--|| users : "target (target_type=user)"

  reports }o--|| users : "reporter"
  reports }o--|| users : "handler"
  reports }o--|| postings : "target (target_type=posting)"
  reports }o--|| users : "target (target_type=user)"
  reports }o--|| media_assets : "target (target_type=media)"
  reports }o--|| reviews : "target (target_type=review)"

  messages ||--o{ messages : "threaded reply"
  messages }o--|| user_profiles : "legacy tutor_profile"

  media_assets }o--|| users : "uploader"
```
