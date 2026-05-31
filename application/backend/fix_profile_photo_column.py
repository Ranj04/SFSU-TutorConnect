#!/usr/bin/env python3
"""
fix_profile_photo_column.py
----------------------------
Emergency script to fix the profile_photo_url column type.
Run this if migration 008 didn't work or if you're getting "Data too long" errors.

Usage:
    python fix_profile_photo_column.py
"""
import os
import sys
from pathlib import Path

import pymysql
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent
ENV_PATH = ROOT / ".env"

# No hardcoded password default: supply it via DATABASE_URL or DB_PASSWORD.
DEFAULTS = {
    "DB_HOST": "127.0.0.1",
    "DB_PORT": "3306",
    "DB_USER": "app_user",
    "DB_PASSWORD": "",
    "DB_NAME": "csc648_tutoring_platform",
}


def get_db_config():
    """Get database configuration from environment variables."""
    load_dotenv()
    
    database_url = os.getenv("DATABASE_URL")
    if database_url:
        from urllib.parse import urlparse
        parsed = urlparse(database_url)
        return {
            "host": parsed.hostname or DEFAULTS["DB_HOST"],
            "port": parsed.port or int(DEFAULTS["DB_PORT"]),
            "user": parsed.username or DEFAULTS["DB_USER"],
            "password": parsed.password or DEFAULTS["DB_PASSWORD"],
            "database": parsed.path.lstrip("/") or DEFAULTS["DB_NAME"],
        }
    
    return {
        "host": os.getenv("DB_HOST", DEFAULTS["DB_HOST"]),
        "port": int(os.getenv("DB_PORT", DEFAULTS["DB_PORT"])),
        "user": os.getenv("DB_USER", DEFAULTS["DB_USER"]),
        "password": os.getenv("DB_PASSWORD", DEFAULTS["DB_PASSWORD"]),
        "database": os.getenv("DB_NAME", DEFAULTS["DB_NAME"]),
}


def main() -> int:
    """Fix the profile_photo_url column type."""
    try:
        config = get_db_config()
        print(f"[INFO] Connecting to database: {config['user']}@{config['host']}:{config['port']}/{config['database']}")
        
        conn = pymysql.connect(
            host=config["host"],
            port=config["port"],
            user=config["user"],
            password=config["password"],
            database=config["database"],
            charset="utf8mb4",
            autocommit=False,
        )
        
        with conn.cursor() as cursor:
            # Check current column type
            print("[INFO] Checking current column type...")
            cursor.execute("""
                SELECT DATA_TYPE, CHARACTER_MAXIMUM_LENGTH 
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_SCHEMA = %s 
                AND TABLE_NAME = 'users' 
                AND COLUMN_NAME = 'profile_photo_url'
            """, (config['database'],))
            result = cursor.fetchone()
            
            if result:
                data_type, max_length = result
                print(f"[INFO] Current column type: {data_type}({max_length or 'N/A'})")
                
                if data_type.lower() in ('text', 'longtext', 'mediumtext'):
                    print("[SUCCESS] Column is already TEXT type - no changes needed!")
                    return 0
                
                # Clear any data that's too long
                print("[INFO] Clearing any profile photos that are too long...")
                cursor.execute("""
                    UPDATE users 
                    SET profile_photo_url = NULL 
                    WHERE profile_photo_url IS NOT NULL 
                    AND CHAR_LENGTH(profile_photo_url) > 500
                """)
                cleared = cursor.rowcount
                if cleared > 0:
                    print(f"[INFO] Cleared {cleared} profile photo(s) that were too long")
                conn.commit()
                
                # Change column type to TEXT
                print("[INFO] Changing column type to TEXT...")
                cursor.execute("ALTER TABLE users MODIFY COLUMN profile_photo_url TEXT NULL")
                conn.commit()
                
                # Verify the change
                cursor.execute("""
                    SELECT DATA_TYPE, CHARACTER_MAXIMUM_LENGTH 
                    FROM INFORMATION_SCHEMA.COLUMNS 
                    WHERE TABLE_SCHEMA = %s 
                    AND TABLE_NAME = 'users' 
                    AND COLUMN_NAME = 'profile_photo_url'
                """, (config['database'],))
                after = cursor.fetchone()
                
                if after and after[0].lower() in ('text', 'longtext', 'mediumtext'):
                    print(f"[SUCCESS] Column type changed to {after[0]} successfully!")
                    return 0
                else:
                    print(f"[ERROR] Column type change failed - still {after[0] if after else 'unknown'}")
                    return 1
            else:
                print("[ERROR] Column 'profile_photo_url' not found in users table")
                return 1
        
        conn.close()
        
    except pymysql.err.OperationalError as e:
        print(f"[ERROR] Database connection failed: {e}")
        return 1
    except Exception as e:
        print(f"[ERROR] Failed to fix column: {e}")
        return 1


if __name__ == "__main__":
    sys.exit(main())

