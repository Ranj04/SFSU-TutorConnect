-- =====================================================================
-- Migration 011: Enforce one initial message per (sender, recipient, posting)
-- =====================================================================
-- The messaging API enforces a one-initial-message rule with a pre-check, which
-- is subject to a TOCTOU race under concurrency. This unique constraint makes the
-- database the source of truth; the API now catches the resulting IntegrityError
-- and returns a clean 400 instead of allowing duplicates.
--
-- Note: posting_id is nullable. In MySQL, a UNIQUE index treats multiple NULLs as
-- distinct, so general (posting-less) messages are not constrained by this index,
-- which is the intended behavior (the rule is per-posting).
--
-- If existing data already contains duplicates, de-duplicate before applying.
ALTER TABLE messages
  ADD CONSTRAINT uq_messages_sender_recipient_posting
  UNIQUE (sender_user_id, recipient_user_id, posting_id);
