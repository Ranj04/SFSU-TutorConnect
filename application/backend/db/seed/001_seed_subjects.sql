-- Seed SFSU academic subjects/departments
-- This file contains all major academic departments at San Francisco State University
-- Slugs are generated as lowercase with hyphens

INSERT INTO subjects (name, slug) VALUES
-- Sciences
('Biology', 'biology'),
('Chemistry', 'chemistry'),
('Computer Science', 'computer-science'),
('Mathematics', 'mathematics'),
('Physics', 'physics'),
('Astronomy', 'astronomy'),
('Geosciences', 'geosciences'),
('Environmental Studies', 'environmental-studies'),

-- Engineering & Technology
('Engineering', 'engineering'),
('Electrical Engineering', 'electrical-engineering'),
('Mechanical Engineering', 'mechanical-engineering'),
('Information Systems', 'information-systems'),

-- Business & Economics
('Accounting', 'accounting'),
('Business Administration', 'business-administration'),
('Economics', 'economics'),
('Finance', 'finance'),
('International Business', 'international-business'),
('Management', 'management'),
('Marketing', 'marketing'),
('Entrepreneurship', 'entrepreneurship'),

-- Social Sciences
('Anthropology', 'anthropology'),
('Criminal Justice', 'criminal-justice'),
('Geography', 'geography'),
('History', 'history'),
('International Relations', 'international-relations'),
('Political Science', 'political-science'),
('Psychology', 'psychology'),
('Sociology', 'sociology'),
('Urban Studies', 'urban-studies'),

-- Humanities & Arts
('Art', 'art'),
('Art History', 'art-history'),
('Cinema', 'cinema'),
('Communication Studies', 'communication-studies'),
('Comparative Literature', 'comparative-literature'),
('Creative Writing', 'creative-writing'),
('English', 'english'),
('Foreign Languages', 'foreign-languages'),
('French', 'french'),
('German', 'german'),
('Italian', 'italian'),
('Japanese', 'japanese'),
('Spanish', 'spanish'),
('Chinese', 'chinese'),
('Hebrew', 'hebrew'),
('Modern Greek', 'modern-greek'),
('Philosophy', 'philosophy'),
('Religious Studies', 'religious-studies'),
('Theatre Arts', 'theatre-arts'),
('Music', 'music'),
('Dance', 'dance'),

-- Education
('Education', 'education'),
('Elementary Education', 'elementary-education'),
('Secondary Education', 'secondary-education'),
('Special Education', 'special-education'),

-- Health & Kinesiology
('Health Education', 'health-education'),
('Kinesiology', 'kinesiology'),
('Nursing', 'nursing'),
('Recreation, Parks, and Tourism', 'recreation-parks-tourism'),
('Public Health', 'public-health'),

-- Journalism & Media
('Journalism', 'journalism'),
('Broadcast and Electronic Communication Arts', 'broadcast-electronic-communication-arts'),
('Visual Communication Design', 'visual-communication-design'),

-- Other Disciplines
('Africana Studies', 'africana-studies'),
('American Indian Studies', 'american-indian-studies'),
('Asian American Studies', 'asian-american-studies'),
('Chicana and Latina/o Studies', 'chicana-latina-studies'),
('Race and Resistance Studies', 'race-and-resistance-studies'),
('Women and Gender Studies', 'women-and-gender-studies'),
('Ethnic Studies', 'ethnic-studies'),
('Humanities', 'humanities'),
('Liberal Studies', 'liberal-studies'),
('Public Administration', 'public-administration'),
('Social Work', 'social-work'),
('Consumer and Family Studies', 'consumer-and-family-studies'),
('Consumer Affairs', 'consumer-affairs'),
('Hospitality and Tourism Management', 'hospitality-tourism-management'),
('Child and Adolescent Development', 'child-adolescent-development'),

-- Interdisciplinary
('Interdisciplinary Studies', 'interdisciplinary-studies'),
('Holistic Health', 'holistic-health')
ON DUPLICATE KEY UPDATE name=VALUES(name);
-- Using ON DUPLICATE KEY UPDATE to prevent errors if running seed multiple times
