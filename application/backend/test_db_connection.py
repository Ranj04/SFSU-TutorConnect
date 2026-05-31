#!/usr/bin/env python3
"""
Test database connection and verify that we're targeting the correct schema.
"""
import os
import sys
from urllib.parse import urlparse

import pymysql
from dotenv import load_dotenv

load_dotenv()

REQUIRED_DB_NAME = os.getenv("DB_REQUIRED_SCHEMA", "csc648_tutoring_platform")
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("[ERROR] DATABASE_URL environment variable is required.")
    print("Please copy .env.example to .env and set your database credentials.")
    sys.exit(1)

parsed = urlparse(DATABASE_URL.replace("mysql+pymysql://", "mysql://"))

# Database configuration (parsed from DATABASE_URL)
DB_HOST = parsed.hostname or "localhost"
DB_PORT = parsed.port or 3306
DB_USER = parsed.username or "root"
DB_PASSWORD = parsed.password
DB_NAME = parsed.path.lstrip('/') if parsed.path else REQUIRED_DB_NAME

if DB_NAME != REQUIRED_DB_NAME:
    print(f"[ERROR] DATABASE_URL must target schema '{REQUIRED_DB_NAME}' but found '{DB_NAME}'.")
    print("Update your DATABASE_URL to point to the shared production schema before running tests.")
    sys.exit(1)

def test_mysql_connection():
    """Test if MySQL server is accessible."""
    print("=" * 60)
    print("Testing Database Connection")
    print("=" * 60)
    
    try:
        # Test 1: Can we connect to MySQL server?
        print("\n[TEST 1] Testing MySQL server connection...")
        connection = pymysql.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            charset='utf8mb4'
        )
        print("✓ MySQL server is running and accessible")
        cursor = connection.cursor()
        
        # Test 2: Does the database exist?
        print(f"\n[TEST 2] Checking if database '{DB_NAME}' exists...")
        cursor.execute("SHOW DATABASES LIKE %s", (DB_NAME,))
        db_exists = cursor.fetchone()
        
        if db_exists:
            print(f"✓ Database '{DB_NAME}' exists")
            
            # Test 3: Connect to the specific database
            print(f"\n[TEST 3] Connecting to database '{DB_NAME}'...")
            connection.select_db(DB_NAME)
            print(f"✓ Successfully connected to '{DB_NAME}'")
            
            # Test 4: Check if tables exist
            print(f"\n[TEST 4] Checking if tables exist...")
            cursor.execute("SHOW TABLES")
            tables = cursor.fetchall()
            
            if tables:
                print(f"✓ Found {len(tables)} table(s):")
                for table in tables:
                    print(f"  - {table[0]}")
                
                # Test 5: Check for key tables
                key_tables = ['users', 'tutor_profiles', 'subjects', 'courses']
                print(f"\n[TEST 5] Checking for key tables...")
                cursor.execute("SHOW TABLES")
                existing_tables = [table[0] for table in cursor.fetchall()]
                
                missing_tables = [t for t in key_tables if t not in existing_tables]
                if missing_tables:
                    print(f"⚠ Missing tables: {', '.join(missing_tables)}")
                    print("  → Run 'python setup_db.py' to create missing tables")
                else:
                    print("✓ All key tables exist")
                    
                    # Test 6: Check if data exists
                    print(f"\n[TEST 6] Checking if data exists...")
                    try:
                        cursor.execute("SELECT COUNT(*) FROM users")
                        user_count = cursor.fetchone()[0]
                        cursor.execute("SELECT COUNT(*) FROM subjects")
                        subject_count = cursor.fetchone()[0]
                        cursor.execute("SELECT COUNT(*) FROM courses")
                        course_count = cursor.fetchone()[0]
                        
                        print(f"  - Users: {user_count}")
                        print(f"  - Subjects: {subject_count}")
                        print(f"  - Courses: {course_count}")
                        
                        if user_count == 0 and subject_count == 0:
                            print("⚠ Database is empty - run 'python setup_db.py' to seed data")
                        else:
                            print("✓ Database has data")
                    except Exception as e:
                        print(f"⚠ Could not check data: {e}")
                        
            else:
                print("⚠ Database exists but has no tables")
                print("  → Run 'python setup_db.py' to create tables")
            
        else:
            print(f"✗ Database '{DB_NAME}' does NOT exist")
            print(f"\n[ACTION REQUIRED]")
            print(f"  1. Create the database:")
            print(f"     CREATE DATABASE {DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;")
            print(f"  2. Then run: python setup_db.py")
            
        connection.close()
        return True
        
    except pymysql.Error as e:
        print(f"\n✗ Database error: {e}")
        print(f"\n[TROUBLESHOOTING]")
        error_code = e.args[0] if e.args else None
        
        if error_code == 2003:
            print("  → MySQL server is not running")
            print("  → Start MySQL service and try again")
        elif error_code == 1045:
            print(f"  → Authentication failed for user '{DB_USER}'")
            print(f"  → Check the DB password in your .env / DATABASE_URL")
            print(f"  → Password is {'set' if DB_PASSWORD else 'NOT set'} in the environment")
        elif error_code == 1049:
            print(f"  → Database '{DB_NAME}' does not exist")
            print(f"  → Create it first, then run setup_db.py")
        else:
            print(f"  → Error code: {error_code}")
            print(f"  → Check MySQL is installed and running")
        
        return False
    
    except Exception as e:
        print(f"\n✗ Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_mysql_connection()
    print("\n" + "=" * 60)
    if success:
        print("✓ Connection test completed")
    else:
        print("✗ Connection test failed - see troubleshooting above")
    print("=" * 60)
    sys.exit(0 if success else 1)



