#!/usr/bin/env python3
"""
update_subjects.py
------------------
Updates SFSU subjects in the database. Safely adds new subjects without
duplicating existing ones. Runs during deployment via GitHub Actions.

Contributors: Ranjiv Jithendran

Usage:
    python scripts/update_subjects.py
"""
import os
import sys
from pathlib import Path

# Add parent directory to path to import app modules
sys.path.insert(0, str(Path(__file__).parent.parent))

import pymysql
from dotenv import load_dotenv
from urllib.parse import urlparse

# Load environment variables
load_dotenv(Path(__file__).parent.parent / '.env')

def get_db_connection():
    """Get database connection from DATABASE_URL environment variable."""
    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        raise ValueError(
            "DATABASE_URL environment variable not set. "
            "Please set it in .env file or as an environment variable."
        )
    
    # Parse DATABASE_URL
    # Format: mysql+pymysql://user:password@host:port/database
    url = database_url.replace('mysql+pymysql://', 'mysql://')
    parsed = urlparse(url)
    
    return pymysql.connect(
        host=parsed.hostname or 'localhost',
        port=parsed.port or 3306,
        user=parsed.username,
        password=parsed.password,
        database=parsed.path.lstrip('/'),
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )

def create_slug(name):
    """Convert subject name to URL-friendly slug."""
    slug = name.lower()
    slug = slug.replace(' ', '-')
    slug = ''.join(c if c.isalnum() or c == '-' else '' for c in slug)
    while '--' in slug:
        slug = slug.replace('--', '-')
    slug = slug.strip('-')
    return slug

# Comprehensive SFSU subjects list with matching slugs for courses
# Format: (Display Name, slug) - slug must match course data
SFSU_SUBJECTS_WITH_SLUGS = [
    # College of Science & Engineering
    ('Computer Science', 'computer-science'),
    ('Mathematics', 'mathematics'),
    ('Physics', 'physics'),
    ('Chemistry', 'chemistry'),
    ('Biology', 'biology'),
    ('Engineering', 'engineering'),
    ('Electrical Engineering', 'electrical-engineering'),
    ('Geosciences', 'geosciences'),
    ('Astronomy', 'astronomy'),
    ('Environmental Studies', 'environmental-studies'),
    
    # Lam Family College of Business
    ('Business Administration', 'business-administration'),
    ('Accounting', 'accounting'),
    ('Economics', 'economics'),
    ('Finance', 'finance'),
    ('Management', 'management'),
    ('Marketing', 'marketing'),
    ('Information Systems', 'information-systems'),
    
    # College of Health & Social Sciences
    ('Psychology', 'psychology'),
    ('Sociology', 'sociology'),
    ('Social Work', 'social-work'),
    ('Criminal Justice', 'criminal-justice'),
    ('Kinesiology', 'kinesiology'),
    ('Nursing', 'nursing'),
    ('Public Health', 'public-health'),
    
    # College of Liberal & Creative Arts
    ('English', 'english'),
    ('History', 'history'),
    ('Philosophy', 'philosophy'),
    ('Political Science', 'political-science'),
    ('Communication Studies', 'communication-studies'),
    ('Journalism', 'journalism'),
    ('Broadcast and Electronic Communication Arts', 'broadcast-communication-arts'),
    ('Cinema', 'cinema'),
    ('Art', 'art'),
    ('Art History', 'art-history'),
    ('Design and Industry', 'design-and-industry'),
    ('Music', 'music'),
    ('Theatre Arts', 'theatre-arts'),
    ('Dance', 'dance'),
    
    # Graduate College of Education
    ('Education', 'education'),
    ('Secondary Education', 'secondary-education'),
    ('Special Education', 'special-education'),
    ('Counseling', 'counseling'),
    
    # College of Ethnic Studies
    ('Asian American Studies', 'asian-american-studies'),
    ('Africana Studies', 'africana-studies'),
    ('Latina/Latino Studies', 'latina-latino-studies'),
    ('American Indian Studies', 'american-indian-studies'),
    ('Race and Resistance Studies', 'race-resistance-studies'),
    
    # Foreign Languages
    ('Spanish', 'spanish'),
    ('French', 'french'),
    ('German', 'german'),
    ('Italian', 'italian'),
    ('Japanese', 'japanese'),
    ('Chinese', 'chinese'),
    ('Arabic', 'arabic'),
    ('Portuguese', 'portuguese'),
    
    # Other Departments
    ('Humanities', 'humanities'),
    ('Anthropology', 'anthropology'),
    ('Geography', 'geography'),
    ('Linguistics', 'linguistics'),
    ("Women's and Gender Studies", 'womens-gender-studies'),
    ('Urban Studies', 'urban-studies'),
    ('International Relations', 'international-relations'),
    ('Hospitality and Tourism', 'hospitality-tourism'),
    
    # Additional subjects (not in current course data but at SFSU)
    ('Mechanical Engineering', 'mechanical-engineering'),
    ('International Business', 'international-business'),
    ('Entrepreneurship', 'entrepreneurship'),
    ('Health Education', 'health-education'),
    ('Recreation, Parks, and Tourism', 'recreation-parks-tourism'),
    ('Comparative Literature', 'comparative-literature'),
    ('Creative Writing', 'creative-writing'),
    ('Religious Studies', 'religious-studies'),
    ('Elementary Education', 'elementary-education'),
    ('Ethnic Studies', 'ethnic-studies'),
    ('Liberal Studies', 'liberal-studies'),
    ('Public Administration', 'public-administration'),
    ('Consumer and Family Studies', 'consumer-family-studies'),
    ('Child and Adolescent Development', 'child-adolescent-development'),
    ('Holistic Health', 'holistic-health'),
    ('Hebrew', 'hebrew'),
    ('Modern Greek', 'modern-greek'),
    ('Visual Communication Design', 'visual-communication-design'),
]

# For backwards compatibility
SFSU_SUBJECTS = [name for name, slug in SFSU_SUBJECTS_WITH_SLUGS]

def update_subjects():
    """Insert or update subjects in the database."""
    connection = get_db_connection()
    
    try:
        with connection.cursor() as cursor:
            added_count = 0
            updated_count = 0
            skipped_count = 0
            
            for subject_name, slug in SFSU_SUBJECTS_WITH_SLUGS:
                # Check if subject exists by slug OR by name
                cursor.execute(
                    "SELECT id, name, slug FROM subjects WHERE slug = %s OR name = %s",
                    (slug, subject_name)
                )
                existing = cursor.fetchone()
                
                if existing:
                    # Subject exists - check if we need to update
                    needs_update = False
                    if existing['name'] != subject_name or existing['slug'] != slug:
                        # Update to ensure both name and slug are correct
                        try:
                            cursor.execute(
                                "UPDATE subjects SET name = %s, slug = %s WHERE id = %s",
                                (subject_name, slug, existing['id'])
                            )
                            updated_count += 1
                            print(f"Updated: {subject_name} (slug: {slug})")
                        except Exception as update_err:
                            # If update fails (duplicate), just skip
                            print(f"  Skipped update for {subject_name}: {update_err}")
                            skipped_count += 1
                    else:
                        skipped_count += 1
                else:
                    # Insert new subject
                    try:
                        cursor.execute(
                            "INSERT INTO subjects (name, slug) VALUES (%s, %s)",
                            (subject_name, slug)
                        )
                        added_count += 1
                        print(f"Added: {subject_name} (slug: {slug})")
                    except Exception as insert_err:
                        # Handle duplicate key errors gracefully
                        print(f"  Skipped insert for {subject_name}: {insert_err}")
                        skipped_count += 1
            
            connection.commit()
            
            print("\n" + "="*50)
            print(f"Summary:")
            print(f"  Added: {added_count} subjects")
            print(f"  Updated: {updated_count} subjects")
            print(f"  Skipped (already exist): {skipped_count} subjects")
            print(f"  Total processed: {len(SFSU_SUBJECTS_WITH_SLUGS)} subjects")
            print("="*50)
            
    except Exception as e:
        connection.rollback()
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
    finally:
        connection.close()

if __name__ == '__main__':
    print("Updating SFSU subjects in database...")
    print(f"Using DATABASE_URL: {os.getenv('DATABASE_URL', 'Not set')[:50]}...")
    print()
    update_subjects()
    print("\nDone!")

