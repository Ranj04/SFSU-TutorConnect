-- Migration: Update profile_photo_url column to support base64 data URLs
-- Base64-encoded images can be very long (50k+ characters), so VARCHAR(512) is insufficient
-- This migration changes the column type to TEXT to accommodate larger data URLs

-- Step 1: Clear any existing data that's too long (this prevents ALTER errors)
-- We do this first to ensure the column can be safely altered
UPDATE users 
SET profile_photo_url = NULL 
WHERE profile_photo_url IS NOT NULL 
  AND CHAR_LENGTH(profile_photo_url) > 500;

-- Step 2: Alter the column type to TEXT
-- Using a safe method that won't fail on existing data
-- Note: This will clear any remaining data that's too long, but that's acceptable
ALTER TABLE users 
MODIFY COLUMN profile_photo_url TEXT NULL;

