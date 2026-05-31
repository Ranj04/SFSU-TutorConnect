-- Migration: Add is_admin flag to users for admin / moderation authorization
-- Date: 2026
-- Rationale: posting moderation (approve/reject) and other admin-only actions
-- must be gated on a real server-side role rather than a client-supplied flag.
-- The is_admin column defaults to 0 (false); promote admins explicitly via SQL.
ALTER TABLE users ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT 0;
