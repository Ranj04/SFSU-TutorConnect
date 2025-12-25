#!/usr/bin/env python3
"""
run_migrations.py
-----------------
Simple script to run database migrations during deployment.
This script runs all SQL files in db/migrations/ directory.

Usage:
    python run_migrations.py

Environment variables:
    DATABASE_URL - Full database connection string (mysql+pymysql://user:pass@host:port/db)
    Or individual variables:
    DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME

Contributors: Ranjiv Jithendran, Team 02
"""
import os
import sys
from pathlib import Path
from urllib.parse import urlparse

import pymysql
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent
MIGRATIONS_DIR = ROOT / "db" / "migrations"

DEFAULTS = {
    "DB_HOST": "127.0.0.1",
    "DB_PORT": "3306",
    "DB_USER": "app_user",
    "DB_PASSWORD": "team02db",
    "DB_NAME": "csc648_tutoring_platform",
}


def parse_database_url(database_url: str):
    """Parse DATABASE_URL into components."""
    parsed = urlparse(database_url)
    return {
        "host": parsed.hostname or DEFAULTS["DB_HOST"],
        "port": parsed.port or int(DEFAULTS["DB_PORT"]),
        "user": parsed.username or DEFAULTS["DB_USER"],
        "password": parsed.password or DEFAULTS["DB_PASSWORD"],
        "database": parsed.path.lstrip("/") or DEFAULTS["DB_NAME"],
    }


def get_db_config():
    """Get database configuration from environment variables."""
    load_dotenv()
    
    database_url = os.getenv("DATABASE_URL")
    if database_url:
        return parse_database_url(database_url)
    
    return {
        "host": os.getenv("DB_HOST", DEFAULTS["DB_HOST"]),
        "port": int(os.getenv("DB_PORT", DEFAULTS["DB_PORT"])),
        "user": os.getenv("DB_USER", DEFAULTS["DB_USER"]),
        "password": os.getenv("DB_PASSWORD", DEFAULTS["DB_PASSWORD"]),
        "database": os.getenv("DB_NAME", DEFAULTS["DB_NAME"]),
    }


def execute_sql_file(cursor, filepath: Path, conn=None):
    """Execute all SQL statements in a file (split on semicolons)."""
    sql_content = filepath.read_text(encoding="utf-8")
    statements = [s.strip() for s in sql_content.split(";") if s.strip()]
    for i, stmt in enumerate(statements):
        if stmt:
            cursor.execute(stmt)
            # For migration 008, commit after UPDATE to ensure data is cleared before ALTER
            if "008_update_profile_photo_url.sql" in str(filepath) and "UPDATE" in stmt.upper() and conn:
                conn.commit()
                print(f"[INFO] Committed UPDATE statement to clear long data before ALTER")


def main() -> int:
    """Run all migration files."""
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
        
        # Get all migration files sorted by name
        migrations = sorted(MIGRATIONS_DIR.glob("*.sql"))
        
        if not migrations:
            print(f"[WARN] No migration files found in {MIGRATIONS_DIR}")
            return 0
        
        print(f"[INFO] Found {len(migrations)} migration file(s)")
        
        with conn.cursor() as cursor:
            cursor.execute("SET FOREIGN_KEY_CHECKS=0;")
            for migration_file in migrations:
                print(f"[MIGRATION] Running {migration_file.name}...")
                try:
                    # Special handling for migration 008 - verify column type before and after
                    if "008_update_profile_photo_url.sql" in str(migration_file):
                        # Check current column type
                        cursor.execute("""
                            SELECT DATA_TYPE, CHARACTER_MAXIMUM_LENGTH 
                            FROM INFORMATION_SCHEMA.COLUMNS 
                            WHERE TABLE_SCHEMA = %s 
                            AND TABLE_NAME = 'users' 
                            AND COLUMN_NAME = 'profile_photo_url'
                        """, (config['database'],))
                        before = cursor.fetchone()
                        if before:
                            data_type = before[0].lower() if before[0] else None
                            print(f"[INFO] Current column type: {before[0]}({before[1] or 'N/A'})")
                            
                            # If already TEXT type, skip the migration but verify it's correct
                            if data_type in ('text', 'longtext', 'mediumtext'):
                                print(f"[INFO] Column is already {before[0]} type - skipping migration")
                                # Still verify it's working correctly
                                conn.commit()
                            else:
                                # Column is not TEXT, need to fix it
                                print(f"[INFO] Column type is {before[0]}, needs to be changed to TEXT")
                                
                                # First, clear any data that's too long to prevent errors
                                try:
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
                                except Exception as cleanup_e:
                                    print(f"[WARN] Could not clean up long data: {cleanup_e}")
                                    conn.rollback()
                                
                                # Run the migration
                                execute_sql_file(cursor, migration_file, conn)
                                conn.commit()
                        else:
                            # Column doesn't exist? Run migration anyway
                            print(f"[WARN] Column 'profile_photo_url' not found, running migration...")
                            execute_sql_file(cursor, migration_file, conn)
                            conn.commit()
                        
                        # Verify column type after migration
                        cursor.execute("""
                            SELECT DATA_TYPE, CHARACTER_MAXIMUM_LENGTH 
                            FROM INFORMATION_SCHEMA.COLUMNS 
                            WHERE TABLE_SCHEMA = %s 
                            AND TABLE_NAME = 'users' 
                            AND COLUMN_NAME = 'profile_photo_url'
                        """, (config['database'],))
                        after = cursor.fetchone()
                        if after:
                            after_type = after[0].lower() if after[0] else None
                            print(f"[INFO] Column type after migration: {after[0]}({after[1] or 'N/A'})")
                            if after_type not in ('text', 'longtext', 'mediumtext'):
                                print(f"[ERROR] Column type is still {after[0]}, attempting direct fix...")
                                # Try direct ALTER as fallback
                                try:
                                    conn.rollback()
                                    cursor.execute("UPDATE users SET profile_photo_url = NULL WHERE profile_photo_url IS NOT NULL AND CHAR_LENGTH(profile_photo_url) > 500")
                                    conn.commit()
                                    cursor.execute("ALTER TABLE users MODIFY COLUMN profile_photo_url TEXT NULL")
                                    conn.commit()
                                    print(f"[SUCCESS] Column type fixed directly to TEXT")
                                except Exception as direct_fix_e:
                                    print(f"[ERROR] Direct fix also failed: {direct_fix_e}")
                                    return 1
                            else:
                                print(f"[SUCCESS] Column type verified as {after[0]}")
                        else:
                            print(f"[ERROR] Could not verify column type after migration")
                            return 1
                    else:
                        # Run the migration normally for other files
                        execute_sql_file(cursor, migration_file, conn)
                    
                    print(f"[SUCCESS] {migration_file.name} completed")
                except Exception as e:
                    # Check if it's a "duplicate column" or "column already exists" error
                    error_msg = str(e).lower()
                    if "duplicate column" in error_msg or "already exists" in error_msg:
                        print(f"[SKIP] {migration_file.name} - changes already applied (column exists)")
                    elif "data too long" in error_msg or "1406" in str(e):
                        # Handle data too long errors - this means we need to clean data first
                        print(f"[WARN] {migration_file.name} - data too long, attempting to clean and retry...")
                        conn.rollback()
                        # Try to clean up long data
                        try:
                            cursor.execute("UPDATE users SET profile_photo_url = NULL WHERE profile_photo_url IS NOT NULL AND LENGTH(profile_photo_url) > 500;")
                            conn.commit()
                            print(f"[INFO] Cleaned up long profile_photo_url data, retrying migration...")
                            # Retry the migration
                            execute_sql_file(cursor, migration_file)
                            print(f"[SUCCESS] {migration_file.name} completed after cleanup")
                        except Exception as retry_e:
                            print(f"[ERROR] {migration_file.name} failed even after cleanup: {retry_e}")
                            conn.rollback()
                            return 1
                    else:
                        print(f"[ERROR] {migration_file.name} failed: {e}")
                        conn.rollback()
                        return 1
            cursor.execute("SET FOREIGN_KEY_CHECKS=1;")
        
        conn.commit()
        conn.close()
        
        print("[SUCCESS] All migrations completed successfully")
        return 0
        
    except pymysql.err.OperationalError as e:
        print(f"[ERROR] Database connection failed: {e}")
        return 1
    except Exception as e:
        print(f"[ERROR] Migration failed: {e}")
        return 1


if __name__ == "__main__":
    sys.exit(main())

