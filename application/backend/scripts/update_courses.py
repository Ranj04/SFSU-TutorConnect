#!/usr/bin/env python3
"""
update_courses.py
-----------------
Updates all SFSU courses in the database. Runs during deployment to
ensure all courses are available for tutors to select.

Contributors: Ranjiv Jithendran

Run with: python scripts/update_courses.py

NOTE: The courses table uses 'department' (e.g., 'CSC') as a string column,
not a foreign key to subjects. This matches the models.py schema.
"""

import os
import sys
from pathlib import Path

# Add the app directory to the path
app_dir = Path(__file__).parent.parent / "app"
sys.path.insert(0, str(app_dir.parent))

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Load environment variables
load_dotenv(Path(__file__).parent.parent / ".env")

# Import course data from all data files
from scripts.sfsu_courses_data import SCIENCE_ENGINEERING_COURSES
from scripts.sfsu_courses_data2 import BUSINESS_HEALTH_COURSES
from scripts.sfsu_courses_data3 import ARTS_HUMANITIES_COURSES

# Combine all courses
ALL_COURSES = SCIENCE_ENGINEERING_COURSES + BUSINESS_HEALTH_COURSES + ARTS_HUMANITIES_COURSES


def get_database_url():
    """Get database URL from environment or use default."""
    db_url = os.getenv('DATABASE_URL')
    if not db_url:
        # Fallback for local development
        db_url = 'mysql+pymysql://root:password@localhost:3306/tutor_marketplace'
    return db_url


def update_courses():
    """Update courses in the database."""
    db_url = get_database_url()
    print(f"Connecting to database...")
    
    try:
        engine = create_engine(db_url, echo=False)
        Session = sessionmaker(bind=engine)
        session = Session()
        
        # Check if courses table exists
        try:
            session.execute(text("SELECT 1 FROM courses LIMIT 1"))
            print("Courses table exists")
        except Exception as e:
            print(f"ERROR: Courses table check failed: {e}")
            print("Please ensure the courses table exists with the correct schema.")
            return False
        
        # Insert/update courses
        # Schema: department (VARCHAR), course_number (VARCHAR), title, description, level, credits, prerequisites, subject_id
        inserted = 0
        updated = 0
        skipped = 0
        
        for course in ALL_COURSES:
            dept, number, title, description, level, credits, prereqs, subject_slug = course
            
            try:
                # Look up subject_id from subject_slug
                subject_result = session.execute(text("""
                    SELECT id FROM subjects WHERE slug = :slug
                """), {'slug': subject_slug})
                
                subject_row = subject_result.fetchone()
                if not subject_row:
                    print(f"  WARNING: Subject '{subject_slug}' not found for {dept} {number}, skipping...")
                    skipped += 1
                    continue
                
                subject_id = subject_row[0]
                
                # Check if course exists
                result = session.execute(text("""
                    SELECT id FROM courses 
                    WHERE department = :dept AND course_number = :number
                """), {'dept': dept, 'number': number})
                
                existing = result.fetchone()
                
                if existing:
                    # Update existing course
                    session.execute(text("""
                        UPDATE courses SET 
                            title = :title,
                            description = :description,
                            level = :level,
                            credits = :credits,
                            prerequisites = :prereqs,
                            subject_id = :subject_id
                        WHERE department = :dept AND course_number = :number
                    """), {
                        'dept': dept,
                        'number': number,
                        'title': title,
                        'description': description,
                        'level': level,
                        'credits': credits,
                        'prereqs': prereqs,
                        'subject_id': subject_id
                    })
                    updated += 1
                else:
                    # Insert new course
                    session.execute(text("""
                        INSERT INTO courses (department, course_number, title, description, level, credits, prerequisites, subject_id)
                        VALUES (:dept, :number, :title, :description, :level, :credits, :prereqs, :subject_id)
                    """), {
                        'dept': dept,
                        'number': number,
                        'title': title,
                        'description': description,
                        'level': level,
                        'credits': credits,
                        'prereqs': prereqs,
                        'subject_id': subject_id
                    })
                    inserted += 1
                    
            except Exception as e:
                print(f"  ERROR inserting {dept} {number}: {e}")
                skipped += 1
        
        session.commit()
        
        # Get total count
        total = session.execute(text("SELECT COUNT(*) FROM courses")).scalar()
        
        print(f"\nCourse update complete!")
        print(f"  Inserted: {inserted}")
        print(f"  Updated: {updated}")
        print(f"  Skipped: {skipped}")
        print(f"  Total courses in database: {total}")
        
        session.close()
        return True
        
    except Exception as e:
        print(f"ERROR: Failed to update courses: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    print("=" * 50)
    print("SFSU Course Database Update")
    print("=" * 50)
    print(f"\nTotal courses to process: {len(ALL_COURSES)}")
    
    success = update_courses()
    sys.exit(0 if success else 1)
