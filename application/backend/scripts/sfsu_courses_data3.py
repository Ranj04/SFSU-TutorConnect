#!/usr/bin/env python3
"""
sfsu_courses_data3.py
---------------------
Course data for Liberal Arts, Creative Arts, Education, and Ethnic Studies.
Part 3 of 3 data files used by update_courses.py.

Contributors: Ranjiv Jithendran
"""

# =============================================
# COLLEGE OF LIBERAL & CREATIVE ARTS
# =============================================

ENG_COURSES = [
    ('ENG', '104', 'English Composition', 'Academic writing.', 'undergraduate', 3, None, 'english'),
    ('ENG', '105', 'First-Year Composition', 'Academic writing.', 'undergraduate', 3, None, 'english'),
    ('ENG', '114', 'Writing the First Year', 'Written communication.', 'undergraduate', 3, None, 'english'),
    ('ENG', '200', 'Introduction to Literature', 'Literary analysis.', 'undergraduate', 3, 'ENG 105', 'english'),
    ('ENG', '210', 'Creative Writing', 'Fiction and poetry.', 'undergraduate', 3, 'ENG 105', 'english'),
    ('ENG', '214', 'Advanced Composition', 'Expository writing.', 'undergraduate', 3, 'ENG 105', 'english'),
    ('ENG', '220', 'Short Story', 'Short fiction.', 'undergraduate', 3, 'ENG 200', 'english'),
    ('ENG', '230', 'Poetry', 'Poetry analysis.', 'undergraduate', 3, 'ENG 200', 'english'),
    ('ENG', '240', 'Drama', 'Dramatic literature.', 'undergraduate', 3, 'ENG 200', 'english'),
    ('ENG', '250', 'Novel', 'Novel analysis.', 'undergraduate', 3, 'ENG 200', 'english'),
    ('ENG', '302', 'Literary Criticism', 'Critical theory.', 'undergraduate', 3, 'ENG 200', 'english'),
    ('ENG', '310', 'Shakespeare', 'Shakespeare plays.', 'undergraduate', 3, 'ENG 200', 'english'),
    ('ENG', '320', 'British Literature to 1800', 'Early British literature.', 'undergraduate', 3, 'ENG 200', 'english'),
    ('ENG', '321', 'British Literature after 1800', 'Modern British literature.', 'undergraduate', 3, 'ENG 200', 'english'),
    ('ENG', '330', 'American Literature to 1865', 'Early American literature.', 'undergraduate', 3, 'ENG 200', 'english'),
    ('ENG', '331', 'American Literature after 1865', 'Modern American literature.', 'undergraduate', 3, 'ENG 200', 'english'),
    ('ENG', '340', 'World Literature', 'Global literary traditions.', 'undergraduate', 3, 'ENG 200', 'english'),
    ('ENG', '350', 'Creative Writing: Fiction', 'Fiction workshop.', 'undergraduate', 3, 'ENG 210', 'english'),
    ('ENG', '351', 'Creative Writing: Poetry', 'Poetry workshop.', 'undergraduate', 3, 'ENG 210', 'english'),
    ('ENG', '360', 'Technical Writing', 'Technical communication.', 'undergraduate', 3, 'ENG 105', 'english'),
    ('ENG', '370', 'Professional Writing', 'Workplace writing.', 'undergraduate', 3, 'ENG 105', 'english'),
    ('ENG', '400', 'Medieval Literature', 'Medieval texts.', 'undergraduate', 3, 'ENG 200', 'english'),
    ('ENG', '410', 'Renaissance Literature', 'Renaissance texts.', 'undergraduate', 3, 'ENG 200', 'english'),
    ('ENG', '420', 'Romantic Literature', 'Romantic period.', 'undergraduate', 3, 'ENG 200', 'english'),
    ('ENG', '430', 'Victorian Literature', 'Victorian era.', 'undergraduate', 3, 'ENG 200', 'english'),
    ('ENG', '440', 'Twentieth Century Literature', 'Modern literature.', 'undergraduate', 3, 'ENG 200', 'english'),
    ('ENG', '450', 'Contemporary Literature', 'Recent literature.', 'undergraduate', 3, 'ENG 200', 'english'),
    ('ENG', '460', 'Children\'s Literature', 'Literature for children.', 'undergraduate', 3, 'ENG 200', 'english'),
    ('ENG', '470', 'Postcolonial Literature', 'Colonial and postcolonial texts.', 'undergraduate', 3, 'ENG 200', 'english'),
    ('ENG', '600', 'Graduate English', 'Graduate-level English.', 'graduate', 3, None, 'english'),
    ('ENG', '700', 'Thesis', 'Graduate thesis research.', 'graduate', 6, None, 'english'),
]

HIST_COURSES = [
    ('HIST', '101', 'Introduction to World History I', 'Early world history.', 'undergraduate', 3, None, 'history'),
    ('HIST', '102', 'Introduction to World History II', 'Modern world history.', 'undergraduate', 3, None, 'history'),
    ('HIST', '110', 'Introduction to History', 'Historical thinking.', 'undergraduate', 3, None, 'history'),
    ('HIST', '130', 'United States History to 1877', 'Early American history.', 'undergraduate', 3, None, 'history'),
    ('HIST', '131', 'United States History since 1877', 'Modern American history.', 'undergraduate', 3, None, 'history'),
    ('HIST', '200', 'Historical Methods', 'Historical research.', 'undergraduate', 3, None, 'history'),
    ('HIST', '300', 'Ancient History', 'Ancient civilizations.', 'undergraduate', 3, None, 'history'),
    ('HIST', '310', 'Medieval History', 'Medieval period.', 'undergraduate', 3, None, 'history'),
    ('HIST', '320', 'Early Modern Europe', 'Renaissance and Reformation.', 'undergraduate', 3, None, 'history'),
    ('HIST', '330', 'Modern Europe', 'Modern European history.', 'undergraduate', 3, None, 'history'),
    ('HIST', '340', 'History of England', 'British history.', 'undergraduate', 3, None, 'history'),
    ('HIST', '350', 'History of East Asia', 'Chinese and Japanese history.', 'undergraduate', 3, None, 'history'),
    ('HIST', '360', 'History of Latin America', 'Latin American history.', 'undergraduate', 3, None, 'history'),
    ('HIST', '370', 'History of the Middle East', 'Middle Eastern history.', 'undergraduate', 3, None, 'history'),
    ('HIST', '380', 'History of Africa', 'African history.', 'undergraduate', 3, None, 'history'),
    ('HIST', '390', 'California History', 'California history.', 'undergraduate', 3, None, 'history'),
    ('HIST', '400', 'The American Revolution', 'Revolutionary period.', 'undergraduate', 3, 'HIST 130', 'history'),
    ('HIST', '410', 'Civil War and Reconstruction', 'Civil War era.', 'undergraduate', 3, 'HIST 131', 'history'),
    ('HIST', '420', 'The Progressive Era', 'Progressive movement.', 'undergraduate', 3, 'HIST 131', 'history'),
    ('HIST', '430', 'World War II', 'WWII history.', 'undergraduate', 3, None, 'history'),
    ('HIST', '440', 'Cold War America', 'Cold War period.', 'undergraduate', 3, 'HIST 131', 'history'),
    ('HIST', '450', 'History of Women', 'Women\'s history.', 'undergraduate', 3, None, 'history'),
    ('HIST', '460', 'Environmental History', 'Environmental history.', 'undergraduate', 3, None, 'history'),
    ('HIST', '600', 'Graduate History', 'Graduate-level history.', 'graduate', 3, None, 'history'),
    ('HIST', '700', 'Thesis', 'Graduate thesis research.', 'graduate', 6, None, 'history'),
]

PHIL_COURSES = [
    ('PHIL', '101', 'Introduction to Philosophy', 'Philosophical thinking.', 'undergraduate', 3, None, 'philosophy'),
    ('PHIL', '110', 'Critical Thinking', 'Logical reasoning.', 'undergraduate', 3, None, 'philosophy'),
    ('PHIL', '200', 'Ethics', 'Moral philosophy.', 'undergraduate', 3, None, 'philosophy'),
    ('PHIL', '210', 'Logic', 'Formal logic.', 'undergraduate', 3, None, 'philosophy'),
    ('PHIL', '220', 'Symbolic Logic', 'Mathematical logic.', 'undergraduate', 3, 'PHIL 210', 'philosophy'),
    ('PHIL', '300', 'Ancient Philosophy', 'Greek and Roman philosophy.', 'undergraduate', 3, 'PHIL 101', 'philosophy'),
    ('PHIL', '310', 'Medieval Philosophy', 'Medieval thinkers.', 'undergraduate', 3, 'PHIL 101', 'philosophy'),
    ('PHIL', '320', 'Modern Philosophy', 'Modern philosophers.', 'undergraduate', 3, 'PHIL 101', 'philosophy'),
    ('PHIL', '330', 'Contemporary Philosophy', 'Recent philosophy.', 'undergraduate', 3, 'PHIL 101', 'philosophy'),
    ('PHIL', '340', 'Epistemology', 'Theory of knowledge.', 'undergraduate', 3, 'PHIL 101', 'philosophy'),
    ('PHIL', '350', 'Metaphysics', 'Nature of reality.', 'undergraduate', 3, 'PHIL 101', 'philosophy'),
    ('PHIL', '360', 'Philosophy of Mind', 'Mind and consciousness.', 'undergraduate', 3, 'PHIL 101', 'philosophy'),
    ('PHIL', '370', 'Philosophy of Science', 'Science philosophy.', 'undergraduate', 3, 'PHIL 101', 'philosophy'),
    ('PHIL', '380', 'Political Philosophy', 'Political thought.', 'undergraduate', 3, 'PHIL 200', 'philosophy'),
    ('PHIL', '390', 'Philosophy of Religion', 'Religious philosophy.', 'undergraduate', 3, 'PHIL 101', 'philosophy'),
    ('PHIL', '400', 'Aesthetics', 'Philosophy of art.', 'undergraduate', 3, 'PHIL 101', 'philosophy'),
    ('PHIL', '410', 'Existentialism', 'Existentialist thinkers.', 'undergraduate', 3, 'PHIL 101', 'philosophy'),
    ('PHIL', '420', 'Asian Philosophy', 'Eastern philosophy.', 'undergraduate', 3, 'PHIL 101', 'philosophy'),
    ('PHIL', '430', 'Environmental Ethics', 'Environmental philosophy.', 'undergraduate', 3, 'PHIL 200', 'philosophy'),
    ('PHIL', '440', 'Bioethics', 'Medical ethics.', 'undergraduate', 3, 'PHIL 200', 'philosophy'),
    ('PHIL', '600', 'Graduate Philosophy', 'Graduate-level philosophy.', 'graduate', 3, None, 'philosophy'),
    ('PHIL', '700', 'Thesis', 'Graduate thesis research.', 'graduate', 6, None, 'philosophy'),
]

PLSI_COURSES = [
    ('PLSI', '100', 'Introduction to Political Science', 'Political science overview.', 'undergraduate', 3, None, 'political-science'),
    ('PLSI', '200', 'American Government', 'U.S. political system.', 'undergraduate', 3, None, 'political-science'),
    ('PLSI', '210', 'State and Local Government', 'State politics.', 'undergraduate', 3, 'PLSI 100', 'political-science'),
    ('PLSI', '220', 'Comparative Politics', 'Comparative government.', 'undergraduate', 3, 'PLSI 100', 'political-science'),
    ('PLSI', '230', 'International Relations', 'Global politics.', 'undergraduate', 3, 'PLSI 100', 'political-science'),
    ('PLSI', '240', 'Political Theory', 'Political philosophy.', 'undergraduate', 3, 'PLSI 100', 'political-science'),
    ('PLSI', '300', 'Research Methods', 'Political research.', 'undergraduate', 3, 'PLSI 100', 'political-science'),
    ('PLSI', '310', 'Public Policy', 'Policy analysis.', 'undergraduate', 3, 'PLSI 200', 'political-science'),
    ('PLSI', '320', 'Public Administration', 'Government administration.', 'undergraduate', 3, 'PLSI 200', 'political-science'),
    ('PLSI', '330', 'Constitutional Law', 'Constitutional issues.', 'undergraduate', 3, 'PLSI 200', 'political-science'),
    ('PLSI', '340', 'Political Parties', 'Party politics.', 'undergraduate', 3, 'PLSI 200', 'political-science'),
    ('PLSI', '350', 'Congress', 'Congressional politics.', 'undergraduate', 3, 'PLSI 200', 'political-science'),
    ('PLSI', '360', 'Presidency', 'Executive branch.', 'undergraduate', 3, 'PLSI 200', 'political-science'),
    ('PLSI', '370', 'Politics of Europe', 'European politics.', 'undergraduate', 3, 'PLSI 220', 'political-science'),
    ('PLSI', '380', 'Politics of Asia', 'Asian politics.', 'undergraduate', 3, 'PLSI 220', 'political-science'),
    ('PLSI', '390', 'Politics of Latin America', 'Latin American politics.', 'undergraduate', 3, 'PLSI 220', 'political-science'),
    ('PLSI', '400', 'International Law', 'International legal system.', 'undergraduate', 3, 'PLSI 230', 'political-science'),
    ('PLSI', '410', 'International Organizations', 'UN and global institutions.', 'undergraduate', 3, 'PLSI 230', 'political-science'),
    ('PLSI', '420', 'American Foreign Policy', 'U.S. foreign policy.', 'undergraduate', 3, 'PLSI 230', 'political-science'),
    ('PLSI', '430', 'Environmental Politics', 'Environmental policy.', 'undergraduate', 3, 'PLSI 200', 'political-science'),
    ('PLSI', '600', 'Graduate Political Science', 'Graduate-level PLSI.', 'graduate', 3, None, 'political-science'),
    ('PLSI', '700', 'Thesis', 'Graduate thesis research.', 'graduate', 6, None, 'political-science'),
]

COMM_COURSES = [
    ('COMM', '100', 'Introduction to Communication', 'Communication overview.', 'undergraduate', 3, None, 'communication-studies'),
    ('COMM', '150', 'Public Speaking', 'Speech fundamentals.', 'undergraduate', 3, None, 'communication-studies'),
    ('COMM', '200', 'Interpersonal Communication', 'Face-to-face communication.', 'undergraduate', 3, 'COMM 100', 'communication-studies'),
    ('COMM', '210', 'Small Group Communication', 'Group dynamics.', 'undergraduate', 3, 'COMM 100', 'communication-studies'),
    ('COMM', '220', 'Organizational Communication', 'Workplace communication.', 'undergraduate', 3, 'COMM 100', 'communication-studies'),
    ('COMM', '230', 'Mass Communication', 'Media and society.', 'undergraduate', 3, 'COMM 100', 'communication-studies'),
    ('COMM', '240', 'Intercultural Communication', 'Cross-cultural interaction.', 'undergraduate', 3, 'COMM 100', 'communication-studies'),
    ('COMM', '300', 'Argumentation and Debate', 'Debate skills.', 'undergraduate', 3, 'COMM 150', 'communication-studies'),
    ('COMM', '310', 'Persuasion', 'Persuasive communication.', 'undergraduate', 3, 'COMM 100', 'communication-studies'),
    ('COMM', '320', 'Communication Theory', 'Theoretical frameworks.', 'undergraduate', 3, 'COMM 100', 'communication-studies'),
    ('COMM', '330', 'Research Methods', 'Communication research.', 'undergraduate', 3, 'COMM 100', 'communication-studies'),
    ('COMM', '340', 'Rhetoric', 'Rhetorical analysis.', 'undergraduate', 3, 'COMM 100', 'communication-studies'),
    ('COMM', '350', 'Political Communication', 'Politics and media.', 'undergraduate', 3, 'COMM 230', 'communication-studies'),
    ('COMM', '360', 'Health Communication', 'Health messaging.', 'undergraduate', 3, 'COMM 100', 'communication-studies'),
    ('COMM', '400', 'Gender and Communication', 'Gender in communication.', 'undergraduate', 3, 'COMM 100', 'communication-studies'),
    ('COMM', '410', 'Digital Communication', 'Online communication.', 'undergraduate', 3, 'COMM 100', 'communication-studies'),
    ('COMM', '420', 'Crisis Communication', 'Crisis management.', 'undergraduate', 3, 'COMM 220', 'communication-studies'),
    ('COMM', '600', 'Graduate Communication', 'Graduate-level COMM.', 'graduate', 3, None, 'communication-studies'),
    ('COMM', '700', 'Thesis', 'Graduate thesis research.', 'graduate', 6, None, 'communication-studies'),
]

JOUR_COURSES = [
    ('JOUR', '200', 'Introduction to Journalism', 'Journalism overview.', 'undergraduate', 3, None, 'journalism'),
    ('JOUR', '220', 'News Writing', 'Journalistic writing.', 'undergraduate', 3, 'JOUR 200', 'journalism'),
    ('JOUR', '300', 'News Reporting', 'Reporting techniques.', 'undergraduate', 3, 'JOUR 220', 'journalism'),
    ('JOUR', '310', 'Feature Writing', 'Long-form journalism.', 'undergraduate', 3, 'JOUR 220', 'journalism'),
    ('JOUR', '320', 'Broadcast Journalism', 'TV and radio news.', 'undergraduate', 3, 'JOUR 220', 'journalism'),
    ('JOUR', '330', 'Photojournalism', 'Visual storytelling.', 'undergraduate', 3, 'JOUR 200', 'journalism'),
    ('JOUR', '340', 'Digital Journalism', 'Online news.', 'undergraduate', 3, 'JOUR 220', 'journalism'),
    ('JOUR', '350', 'Data Journalism', 'Data-driven reporting.', 'undergraduate', 3, 'JOUR 220', 'journalism'),
    ('JOUR', '400', 'Investigative Journalism', 'Investigative reporting.', 'undergraduate', 3, 'JOUR 300', 'journalism'),
    ('JOUR', '410', 'Media Law and Ethics', 'Press law.', 'undergraduate', 3, 'JOUR 200', 'journalism'),
    ('JOUR', '420', 'Magazine Writing', 'Magazine journalism.', 'undergraduate', 3, 'JOUR 310', 'journalism'),
    ('JOUR', '430', 'Sports Journalism', 'Sports reporting.', 'undergraduate', 3, 'JOUR 220', 'journalism'),
    ('JOUR', '600', 'Graduate Journalism', 'Graduate-level journalism.', 'graduate', 3, None, 'journalism'),
]

BECA_COURSES = [
    ('BECA', '200', 'Introduction to Broadcasting', 'Broadcasting overview.', 'undergraduate', 3, None, 'broadcast-communication-arts'),
    ('BECA', '220', 'Audio Production', 'Radio production.', 'undergraduate', 3, 'BECA 200', 'broadcast-communication-arts'),
    ('BECA', '240', 'Video Production', 'Television production.', 'undergraduate', 3, 'BECA 200', 'broadcast-communication-arts'),
    ('BECA', '300', 'Broadcast Writing', 'Writing for broadcast.', 'undergraduate', 3, 'BECA 200', 'broadcast-communication-arts'),
    ('BECA', '320', 'Broadcast News', 'News production.', 'undergraduate', 3, 'BECA 240', 'broadcast-communication-arts'),
    ('BECA', '340', 'Documentary Production', 'Documentary filmmaking.', 'undergraduate', 3, 'BECA 240', 'broadcast-communication-arts'),
    ('BECA', '360', 'Digital Media Production', 'Digital content.', 'undergraduate', 3, 'BECA 200', 'broadcast-communication-arts'),
    ('BECA', '400', 'Advanced Television', 'Advanced production.', 'undergraduate', 3, 'BECA 240', 'broadcast-communication-arts'),
    ('BECA', '420', 'Broadcast Management', 'Station management.', 'undergraduate', 3, 'BECA 200', 'broadcast-communication-arts'),
    ('BECA', '440', 'Multimedia Storytelling', 'Cross-platform storytelling.', 'undergraduate', 3, 'BECA 240', 'broadcast-communication-arts'),
    ('BECA', '600', 'Graduate Broadcasting', 'Graduate-level BECA.', 'graduate', 3, None, 'broadcast-communication-arts'),
]

CINE_COURSES = [
    ('CINE', '100', 'Introduction to Cinema', 'Film appreciation.', 'undergraduate', 3, None, 'cinema'),
    ('CINE', '200', 'Film History I', 'Early film history.', 'undergraduate', 3, 'CINE 100', 'cinema'),
    ('CINE', '201', 'Film History II', 'Modern film history.', 'undergraduate', 3, 'CINE 100', 'cinema'),
    ('CINE', '210', 'Screenwriting I', 'Script fundamentals.', 'undergraduate', 3, 'CINE 100', 'cinema'),
    ('CINE', '211', 'Screenwriting II', 'Advanced screenwriting.', 'undergraduate', 3, 'CINE 210', 'cinema'),
    ('CINE', '220', 'Cinematography', 'Camera and lighting.', 'undergraduate', 3, 'CINE 100', 'cinema'),
    ('CINE', '230', 'Film Production I', 'Basic filmmaking.', 'undergraduate', 3, 'CINE 100', 'cinema'),
    ('CINE', '231', 'Film Production II', 'Intermediate filmmaking.', 'undergraduate', 3, 'CINE 230', 'cinema'),
    ('CINE', '240', 'Film Editing', 'Post-production.', 'undergraduate', 3, 'CINE 230', 'cinema'),
    ('CINE', '250', 'Sound Design', 'Film audio.', 'undergraduate', 3, 'CINE 230', 'cinema'),
    ('CINE', '300', 'Film Theory', 'Theoretical approaches.', 'undergraduate', 3, 'CINE 200', 'cinema'),
    ('CINE', '310', 'Directing', 'Film directing.', 'undergraduate', 3, 'CINE 231', 'cinema'),
    ('CINE', '320', 'Documentary Film', 'Non-fiction film.', 'undergraduate', 3, 'CINE 231', 'cinema'),
    ('CINE', '330', 'Animation', 'Animated film.', 'undergraduate', 3, 'CINE 100', 'cinema'),
    ('CINE', '340', 'National Cinemas', 'World cinema.', 'undergraduate', 3, 'CINE 201', 'cinema'),
    ('CINE', '400', 'Advanced Production', 'Thesis film.', 'undergraduate', 3, 'CINE 310', 'cinema'),
    ('CINE', '600', 'Graduate Cinema', 'Graduate-level cinema.', 'graduate', 3, None, 'cinema'),
    ('CINE', '700', 'Thesis', 'Graduate thesis film.', 'graduate', 6, None, 'cinema'),
]

ART_COURSES = [
    ('ART', '100', 'Introduction to Art', 'Art appreciation.', 'undergraduate', 3, None, 'art'),
    ('ART', '150', 'Two-Dimensional Design', 'Design fundamentals.', 'undergraduate', 3, None, 'art'),
    ('ART', '151', 'Three-Dimensional Design', '3D design.', 'undergraduate', 3, None, 'art'),
    ('ART', '200', 'Drawing I', 'Basic drawing.', 'undergraduate', 3, None, 'art'),
    ('ART', '201', 'Drawing II', 'Intermediate drawing.', 'undergraduate', 3, 'ART 200', 'art'),
    ('ART', '210', 'Painting I', 'Oil painting.', 'undergraduate', 3, 'ART 200', 'art'),
    ('ART', '211', 'Painting II', 'Advanced painting.', 'undergraduate', 3, 'ART 210', 'art'),
    ('ART', '220', 'Sculpture I', 'Basic sculpture.', 'undergraduate', 3, 'ART 151', 'art'),
    ('ART', '221', 'Sculpture II', 'Advanced sculpture.', 'undergraduate', 3, 'ART 220', 'art'),
    ('ART', '230', 'Printmaking I', 'Print techniques.', 'undergraduate', 3, 'ART 200', 'art'),
    ('ART', '231', 'Printmaking II', 'Advanced printmaking.', 'undergraduate', 3, 'ART 230', 'art'),
    ('ART', '240', 'Ceramics I', 'Pottery fundamentals.', 'undergraduate', 3, None, 'art'),
    ('ART', '241', 'Ceramics II', 'Advanced ceramics.', 'undergraduate', 3, 'ART 240', 'art'),
    ('ART', '250', 'Photography I', 'Basic photography.', 'undergraduate', 3, None, 'art'),
    ('ART', '251', 'Photography II', 'Advanced photography.', 'undergraduate', 3, 'ART 250', 'art'),
    ('ART', '300', 'Figure Drawing', 'Life drawing.', 'undergraduate', 3, 'ART 201', 'art'),
    ('ART', '310', 'Watercolor', 'Watercolor painting.', 'undergraduate', 3, 'ART 210', 'art'),
    ('ART', '320', 'Installation Art', 'Site-specific art.', 'undergraduate', 3, 'ART 221', 'art'),
    ('ART', '330', 'Digital Art', 'Computer-based art.', 'undergraduate', 3, 'ART 150', 'art'),
    ('ART', '340', 'Mixed Media', 'Multimedia art.', 'undergraduate', 3, 'ART 200', 'art'),
    ('ART', '400', 'Senior Studio', 'Advanced studio practice.', 'undergraduate', 3, 'ART 201', 'art'),
    ('ART', '600', 'Graduate Art', 'Graduate-level art.', 'graduate', 3, None, 'art'),
    ('ART', '700', 'Thesis', 'MFA thesis exhibition.', 'graduate', 6, None, 'art'),
]

ARTH_COURSES = [
    ('ARTH', '100', 'Art History Survey I', 'Ancient to medieval.', 'undergraduate', 3, None, 'art-history'),
    ('ARTH', '101', 'Art History Survey II', 'Renaissance to modern.', 'undergraduate', 3, None, 'art-history'),
    ('ARTH', '200', 'Methods in Art History', 'Art historical methods.', 'undergraduate', 3, 'ARTH 100', 'art-history'),
    ('ARTH', '300', 'Ancient Art', 'Greek and Roman art.', 'undergraduate', 3, 'ARTH 100', 'art-history'),
    ('ARTH', '310', 'Medieval Art', 'Medieval period.', 'undergraduate', 3, 'ARTH 100', 'art-history'),
    ('ARTH', '320', 'Renaissance Art', 'Italian Renaissance.', 'undergraduate', 3, 'ARTH 101', 'art-history'),
    ('ARTH', '330', 'Baroque Art', 'Baroque period.', 'undergraduate', 3, 'ARTH 101', 'art-history'),
    ('ARTH', '340', 'Nineteenth Century Art', '19th century.', 'undergraduate', 3, 'ARTH 101', 'art-history'),
    ('ARTH', '350', 'Modern Art', 'Modern movements.', 'undergraduate', 3, 'ARTH 101', 'art-history'),
    ('ARTH', '360', 'Contemporary Art', 'Contemporary art.', 'undergraduate', 3, 'ARTH 101', 'art-history'),
    ('ARTH', '370', 'Asian Art', 'East Asian art.', 'undergraduate', 3, 'ARTH 100', 'art-history'),
    ('ARTH', '380', 'African Art', 'African art traditions.', 'undergraduate', 3, 'ARTH 100', 'art-history'),
    ('ARTH', '390', 'American Art', 'Art of the Americas.', 'undergraduate', 3, 'ARTH 101', 'art-history'),
    ('ARTH', '400', 'Museum Studies', 'Museum practices.', 'undergraduate', 3, 'ARTH 200', 'art-history'),
    ('ARTH', '600', 'Graduate Art History', 'Graduate-level ARTH.', 'graduate', 3, None, 'art-history'),
    ('ARTH', '700', 'Thesis', 'Graduate thesis research.', 'graduate', 6, None, 'art-history'),
]

DAM_COURSES = [
    ('DAM', '100', 'Introduction to Design', 'Design fundamentals.', 'undergraduate', 3, None, 'design-and-industry'),
    ('DAM', '150', 'Visual Communication', 'Visual design.', 'undergraduate', 3, None, 'design-and-industry'),
    ('DAM', '200', 'Typography', 'Type design.', 'undergraduate', 3, 'DAM 150', 'design-and-industry'),
    ('DAM', '210', 'Graphic Design I', 'Design foundations.', 'undergraduate', 3, 'DAM 150', 'design-and-industry'),
    ('DAM', '211', 'Graphic Design II', 'Intermediate design.', 'undergraduate', 3, 'DAM 210', 'design-and-industry'),
    ('DAM', '220', 'Web Design', 'Web interface design.', 'undergraduate', 3, 'DAM 150', 'design-and-industry'),
    ('DAM', '230', 'UX Design', 'User experience design.', 'undergraduate', 3, 'DAM 220', 'design-and-industry'),
    ('DAM', '240', 'Motion Graphics', 'Animation and motion.', 'undergraduate', 3, 'DAM 210', 'design-and-industry'),
    ('DAM', '300', 'Brand Identity', 'Branding and identity.', 'undergraduate', 3, 'DAM 211', 'design-and-industry'),
    ('DAM', '310', 'Publication Design', 'Editorial design.', 'undergraduate', 3, 'DAM 211', 'design-and-industry'),
    ('DAM', '320', 'Packaging Design', 'Package design.', 'undergraduate', 3, 'DAM 211', 'design-and-industry'),
    ('DAM', '330', 'Interaction Design', 'Interactive design.', 'undergraduate', 3, 'DAM 230', 'design-and-industry'),
    ('DAM', '400', 'Senior Design Project', 'Capstone project.', 'undergraduate', 3, 'DAM 300', 'design-and-industry'),
    ('DAM', '600', 'Graduate Design', 'Graduate-level design.', 'graduate', 3, None, 'design-and-industry'),
]

MUS_COURSES = [
    ('MUS', '100', 'Music Appreciation', 'Music fundamentals.', 'undergraduate', 3, None, 'music'),
    ('MUS', '101', 'World Music', 'Global music traditions.', 'undergraduate', 3, None, 'music'),
    ('MUS', '150', 'Music Theory I', 'Basic theory.', 'undergraduate', 3, None, 'music'),
    ('MUS', '151', 'Music Theory II', 'Intermediate theory.', 'undergraduate', 3, 'MUS 150', 'music'),
    ('MUS', '160', 'Aural Skills I', 'Ear training.', 'undergraduate', 1, 'MUS 150', 'music'),
    ('MUS', '161', 'Aural Skills II', 'Advanced ear training.', 'undergraduate', 1, 'MUS 160', 'music'),
    ('MUS', '200', 'Music History I', 'Ancient to Baroque.', 'undergraduate', 3, 'MUS 150', 'music'),
    ('MUS', '201', 'Music History II', 'Classical to Modern.', 'undergraduate', 3, 'MUS 200', 'music'),
    ('MUS', '250', 'Music Theory III', 'Advanced theory.', 'undergraduate', 3, 'MUS 151', 'music'),
    ('MUS', '251', 'Music Theory IV', 'Contemporary theory.', 'undergraduate', 3, 'MUS 250', 'music'),
    ('MUS', '300', 'Applied Music', 'Private lessons.', 'undergraduate', 2, None, 'music'),
    ('MUS', '310', 'Jazz Studies', 'Jazz performance.', 'undergraduate', 3, 'MUS 151', 'music'),
    ('MUS', '320', 'Conducting', 'Ensemble conducting.', 'undergraduate', 3, 'MUS 251', 'music'),
    ('MUS', '330', 'Composition', 'Music composition.', 'undergraduate', 3, 'MUS 251', 'music'),
    ('MUS', '340', 'Orchestration', 'Instrumental arrangement.', 'undergraduate', 3, 'MUS 251', 'music'),
    ('MUS', '350', 'Music Technology', 'Digital music.', 'undergraduate', 3, 'MUS 150', 'music'),
    ('MUS', '360', 'Music Education', 'Music pedagogy.', 'undergraduate', 3, 'MUS 201', 'music'),
    ('MUS', '400', 'Senior Recital', 'Performance recital.', 'undergraduate', 1, 'MUS 300', 'music'),
    ('MUS', '600', 'Graduate Music', 'Graduate-level music.', 'graduate', 3, None, 'music'),
    ('MUS', '700', 'Thesis', 'Graduate thesis/recital.', 'graduate', 6, None, 'music'),
]

TH_A_COURSES = [
    ('TH A', '100', 'Introduction to Theatre', 'Theatre overview.', 'undergraduate', 3, None, 'theatre-arts'),
    ('TH A', '110', 'Acting I', 'Basic acting.', 'undergraduate', 3, None, 'theatre-arts'),
    ('TH A', '111', 'Acting II', 'Intermediate acting.', 'undergraduate', 3, 'TH A 110', 'theatre-arts'),
    ('TH A', '120', 'Stagecraft', 'Technical theatre.', 'undergraduate', 3, None, 'theatre-arts'),
    ('TH A', '130', 'Theatre History I', 'Greek to Renaissance.', 'undergraduate', 3, 'TH A 100', 'theatre-arts'),
    ('TH A', '131', 'Theatre History II', 'Modern theatre.', 'undergraduate', 3, 'TH A 130', 'theatre-arts'),
    ('TH A', '200', 'Voice and Movement', 'Physical theatre.', 'undergraduate', 3, 'TH A 110', 'theatre-arts'),
    ('TH A', '210', 'Acting III', 'Scene study.', 'undergraduate', 3, 'TH A 111', 'theatre-arts'),
    ('TH A', '220', 'Costume Design', 'Costume creation.', 'undergraduate', 3, 'TH A 120', 'theatre-arts'),
    ('TH A', '230', 'Lighting Design', 'Stage lighting.', 'undergraduate', 3, 'TH A 120', 'theatre-arts'),
    ('TH A', '240', 'Scene Design', 'Set design.', 'undergraduate', 3, 'TH A 120', 'theatre-arts'),
    ('TH A', '300', 'Directing I', 'Basic directing.', 'undergraduate', 3, 'TH A 210', 'theatre-arts'),
    ('TH A', '310', 'Playwriting', 'Script writing.', 'undergraduate', 3, 'TH A 100', 'theatre-arts'),
    ('TH A', '320', 'Acting for the Camera', 'Film acting.', 'undergraduate', 3, 'TH A 111', 'theatre-arts'),
    ('TH A', '330', 'Musical Theatre', 'Musical performance.', 'undergraduate', 3, 'TH A 111', 'theatre-arts'),
    ('TH A', '400', 'Advanced Production', 'Production practicum.', 'undergraduate', 3, 'TH A 300', 'theatre-arts'),
    ('TH A', '600', 'Graduate Theatre', 'Graduate-level theatre.', 'graduate', 3, None, 'theatre-arts'),
    ('TH A', '700', 'Thesis', 'MFA thesis production.', 'graduate', 6, None, 'theatre-arts'),
]

DANC_COURSES = [
    ('DANC', '100', 'Introduction to Dance', 'Dance appreciation.', 'undergraduate', 3, None, 'dance'),
    ('DANC', '110', 'Ballet I', 'Beginning ballet.', 'undergraduate', 2, None, 'dance'),
    ('DANC', '111', 'Ballet II', 'Intermediate ballet.', 'undergraduate', 2, 'DANC 110', 'dance'),
    ('DANC', '120', 'Modern Dance I', 'Beginning modern.', 'undergraduate', 2, None, 'dance'),
    ('DANC', '121', 'Modern Dance II', 'Intermediate modern.', 'undergraduate', 2, 'DANC 120', 'dance'),
    ('DANC', '130', 'Jazz Dance', 'Jazz technique.', 'undergraduate', 2, None, 'dance'),
    ('DANC', '140', 'World Dance', 'Global dance forms.', 'undergraduate', 2, None, 'dance'),
    ('DANC', '200', 'Dance History', 'History of dance.', 'undergraduate', 3, 'DANC 100', 'dance'),
    ('DANC', '210', 'Choreography I', 'Dance composition.', 'undergraduate', 3, 'DANC 121', 'dance'),
    ('DANC', '211', 'Choreography II', 'Advanced choreography.', 'undergraduate', 3, 'DANC 210', 'dance'),
    ('DANC', '300', 'Dance Pedagogy', 'Teaching dance.', 'undergraduate', 3, 'DANC 200', 'dance'),
    ('DANC', '310', 'Advanced Ballet', 'Ballet III.', 'undergraduate', 2, 'DANC 111', 'dance'),
    ('DANC', '320', 'Advanced Modern', 'Modern III.', 'undergraduate', 2, 'DANC 121', 'dance'),
    ('DANC', '400', 'Senior Concert', 'Performance project.', 'undergraduate', 3, 'DANC 211', 'dance'),
    ('DANC', '600', 'Graduate Dance', 'Graduate-level dance.', 'graduate', 3, None, 'dance'),
]

# =============================================
# GRADUATE COLLEGE OF EDUCATION
# =============================================

ED_COURSES = [
    ('ED', '100', 'Introduction to Education', 'Education overview.', 'undergraduate', 3, None, 'education'),
    ('ED', '200', 'Foundations of Education', 'Educational foundations.', 'undergraduate', 3, 'ED 100', 'education'),
    ('ED', '210', 'Child Development', 'Child development.', 'undergraduate', 3, None, 'education'),
    ('ED', '220', 'Educational Psychology', 'Psychology of learning.', 'undergraduate', 3, 'PSY 200', 'education'),
    ('ED', '300', 'Curriculum and Instruction', 'Curriculum design.', 'undergraduate', 3, 'ED 200', 'education'),
    ('ED', '310', 'Classroom Management', 'Behavior management.', 'undergraduate', 3, 'ED 200', 'education'),
    ('ED', '320', 'Assessment and Evaluation', 'Educational assessment.', 'undergraduate', 3, 'ED 200', 'education'),
    ('ED', '330', 'Special Education', 'Exceptional learners.', 'undergraduate', 3, 'ED 200', 'education'),
    ('ED', '340', 'Multicultural Education', 'Diverse learners.', 'undergraduate', 3, 'ED 200', 'education'),
    ('ED', '350', 'Educational Technology', 'Technology in education.', 'undergraduate', 3, 'ED 200', 'education'),
    ('ED', '400', 'Student Teaching', 'Teaching practicum.', 'undergraduate', 12, 'ED 300', 'education'),
    ('ED', '600', 'Graduate Education', 'Graduate-level education.', 'graduate', 3, None, 'education'),
    ('ED', '610', 'Educational Research', 'Research methods.', 'graduate', 3, None, 'education'),
    ('ED', '620', 'School Leadership', 'Administration.', 'graduate', 3, None, 'education'),
    ('ED', '630', 'Curriculum Theory', 'Curriculum development.', 'graduate', 3, None, 'education'),
    ('ED', '700', 'Thesis', 'Graduate thesis research.', 'graduate', 6, None, 'education'),
]

ISED_COURSES = [
    ('ISED', '300', 'Secondary Teaching Methods', 'Teaching methods.', 'undergraduate', 3, None, 'secondary-education'),
    ('ISED', '310', 'Content Area Literacy', 'Reading instruction.', 'undergraduate', 3, None, 'secondary-education'),
    ('ISED', '400', 'Student Teaching Secondary', 'Secondary practicum.', 'undergraduate', 12, 'ISED 300', 'secondary-education'),
    ('ISED', '600', 'Graduate Secondary Education', 'Graduate-level ISED.', 'graduate', 3, None, 'secondary-education'),
]

SPED_COURSES = [
    ('SPED', '200', 'Introduction to Special Education', 'Special education overview.', 'undergraduate', 3, None, 'special-education'),
    ('SPED', '300', 'Learning Disabilities', 'LD identification.', 'undergraduate', 3, 'SPED 200', 'special-education'),
    ('SPED', '310', 'Emotional and Behavioral Disorders', 'EBD instruction.', 'undergraduate', 3, 'SPED 200', 'special-education'),
    ('SPED', '320', 'Autism Spectrum Disorders', 'ASD strategies.', 'undergraduate', 3, 'SPED 200', 'special-education'),
    ('SPED', '330', 'Intellectual Disabilities', 'ID instruction.', 'undergraduate', 3, 'SPED 200', 'special-education'),
    ('SPED', '400', 'Assessment in Special Education', 'SPED assessment.', 'undergraduate', 3, 'SPED 300', 'special-education'),
    ('SPED', '410', 'Transition Planning', 'Post-secondary transition.', 'undergraduate', 3, 'SPED 300', 'special-education'),
    ('SPED', '600', 'Graduate Special Education', 'Graduate-level SPED.', 'graduate', 3, None, 'special-education'),
]

COUN_COURSES = [
    ('COUN', '600', 'Introduction to Counseling', 'Counseling overview.', 'graduate', 3, None, 'counseling'),
    ('COUN', '610', 'Counseling Theories', 'Theoretical approaches.', 'graduate', 3, 'COUN 600', 'counseling'),
    ('COUN', '620', 'Group Counseling', 'Group work.', 'graduate', 3, 'COUN 600', 'counseling'),
    ('COUN', '630', 'Career Counseling', 'Career development.', 'graduate', 3, 'COUN 600', 'counseling'),
    ('COUN', '640', 'Multicultural Counseling', 'Diverse populations.', 'graduate', 3, 'COUN 600', 'counseling'),
    ('COUN', '650', 'Assessment in Counseling', 'Testing and assessment.', 'graduate', 3, 'COUN 610', 'counseling'),
    ('COUN', '660', 'Ethics in Counseling', 'Professional ethics.', 'graduate', 3, 'COUN 600', 'counseling'),
    ('COUN', '700', 'Counseling Practicum', 'Clinical experience.', 'graduate', 3, 'COUN 620', 'counseling'),
    ('COUN', '710', 'Counseling Internship', 'Advanced practicum.', 'graduate', 6, 'COUN 700', 'counseling'),
]

# =============================================
# COLLEGE OF ETHNIC STUDIES
# =============================================

AAS_COURSES = [
    ('AAS', '100', 'Introduction to Asian American Studies', 'AAS overview.', 'undergraduate', 3, None, 'asian-american-studies'),
    ('AAS', '200', 'Asian American History', 'Historical perspectives.', 'undergraduate', 3, 'AAS 100', 'asian-american-studies'),
    ('AAS', '210', 'Asian American Communities', 'Community dynamics.', 'undergraduate', 3, 'AAS 100', 'asian-american-studies'),
    ('AAS', '220', 'Asian American Politics', 'Political participation.', 'undergraduate', 3, 'AAS 100', 'asian-american-studies'),
    ('AAS', '300', 'Asian American Literature', 'Literary traditions.', 'undergraduate', 3, 'AAS 100', 'asian-american-studies'),
    ('AAS', '310', 'Asian American Film', 'Cinema representation.', 'undergraduate', 3, 'AAS 100', 'asian-american-studies'),
    ('AAS', '320', 'Asian American Psychology', 'Mental health.', 'undergraduate', 3, 'AAS 100', 'asian-american-studies'),
    ('AAS', '400', 'Research in AAS', 'Research methods.', 'undergraduate', 3, 'AAS 200', 'asian-american-studies'),
    ('AAS', '600', 'Graduate Asian American Studies', 'Graduate-level AAS.', 'graduate', 3, None, 'asian-american-studies'),
]

AFRS_COURSES = [
    ('AFRS', '100', 'Introduction to Africana Studies', 'Africana Studies overview.', 'undergraduate', 3, None, 'africana-studies'),
    ('AFRS', '200', 'African American History I', 'Pre-Emancipation.', 'undergraduate', 3, 'AFRS 100', 'africana-studies'),
    ('AFRS', '201', 'African American History II', 'Post-Emancipation.', 'undergraduate', 3, 'AFRS 200', 'africana-studies'),
    ('AFRS', '210', 'African History', 'African continent.', 'undergraduate', 3, 'AFRS 100', 'africana-studies'),
    ('AFRS', '220', 'African American Literature', 'Literary traditions.', 'undergraduate', 3, 'AFRS 100', 'africana-studies'),
    ('AFRS', '230', 'African American Music', 'Music traditions.', 'undergraduate', 3, 'AFRS 100', 'africana-studies'),
    ('AFRS', '300', 'Black Politics', 'Political movements.', 'undergraduate', 3, 'AFRS 100', 'africana-studies'),
    ('AFRS', '310', 'Black Psychology', 'Psychological perspectives.', 'undergraduate', 3, 'AFRS 100', 'africana-studies'),
    ('AFRS', '320', 'Caribbean Studies', 'Caribbean diaspora.', 'undergraduate', 3, 'AFRS 100', 'africana-studies'),
    ('AFRS', '400', 'Research in Africana Studies', 'Research methods.', 'undergraduate', 3, 'AFRS 201', 'africana-studies'),
    ('AFRS', '600', 'Graduate Africana Studies', 'Graduate-level AFRS.', 'graduate', 3, None, 'africana-studies'),
]

LTNS_COURSES = [
    ('LTNS', '100', 'Introduction to Latina/Latino Studies', 'LTNS overview.', 'undergraduate', 3, None, 'latina-latino-studies'),
    ('LTNS', '200', 'Chicana/Chicano History', 'Mexican American history.', 'undergraduate', 3, 'LTNS 100', 'latina-latino-studies'),
    ('LTNS', '210', 'Central American Studies', 'Central American experiences.', 'undergraduate', 3, 'LTNS 100', 'latina-latino-studies'),
    ('LTNS', '220', 'Latina/Latino Politics', 'Political engagement.', 'undergraduate', 3, 'LTNS 100', 'latina-latino-studies'),
    ('LTNS', '230', 'Latina/Latino Literature', 'Literary traditions.', 'undergraduate', 3, 'LTNS 100', 'latina-latino-studies'),
    ('LTNS', '300', 'Latina/Latino Culture', 'Cultural studies.', 'undergraduate', 3, 'LTNS 100', 'latina-latino-studies'),
    ('LTNS', '310', 'Immigration Studies', 'Migration experiences.', 'undergraduate', 3, 'LTNS 100', 'latina-latino-studies'),
    ('LTNS', '320', 'Latina/Latino Education', 'Educational issues.', 'undergraduate', 3, 'LTNS 100', 'latina-latino-studies'),
    ('LTNS', '400', 'Research in LTNS', 'Research methods.', 'undergraduate', 3, 'LTNS 200', 'latina-latino-studies'),
    ('LTNS', '600', 'Graduate Latina/Latino Studies', 'Graduate-level LTNS.', 'graduate', 3, None, 'latina-latino-studies'),
]

AIS_COURSES = [
    ('AIS', '100', 'Introduction to American Indian Studies', 'AIS overview.', 'undergraduate', 3, None, 'american-indian-studies'),
    ('AIS', '200', 'American Indian History', 'Indigenous history.', 'undergraduate', 3, 'AIS 100', 'american-indian-studies'),
    ('AIS', '210', 'Native American Literature', 'Literary traditions.', 'undergraduate', 3, 'AIS 100', 'american-indian-studies'),
    ('AIS', '220', 'Native American Art', 'Visual traditions.', 'undergraduate', 3, 'AIS 100', 'american-indian-studies'),
    ('AIS', '230', 'Native American Politics', 'Sovereignty and rights.', 'undergraduate', 3, 'AIS 100', 'american-indian-studies'),
    ('AIS', '300', 'California Indians', 'California tribes.', 'undergraduate', 3, 'AIS 100', 'american-indian-studies'),
    ('AIS', '310', 'Federal Indian Policy', 'Policy history.', 'undergraduate', 3, 'AIS 200', 'american-indian-studies'),
    ('AIS', '400', 'Research in AIS', 'Research methods.', 'undergraduate', 3, 'AIS 200', 'american-indian-studies'),
    ('AIS', '600', 'Graduate American Indian Studies', 'Graduate-level AIS.', 'graduate', 3, None, 'american-indian-studies'),
]

RRS_COURSES = [
    ('RRS', '100', 'Introduction to Race and Resistance Studies', 'RRS overview.', 'undergraduate', 3, None, 'race-resistance-studies'),
    ('RRS', '200', 'Race and Racism', 'Racial formations.', 'undergraduate', 3, 'RRS 100', 'race-resistance-studies'),
    ('RRS', '210', 'Social Movements', 'Resistance movements.', 'undergraduate', 3, 'RRS 100', 'race-resistance-studies'),
    ('RRS', '300', 'Intersectionality', 'Race, gender, class.', 'undergraduate', 3, 'RRS 100', 'race-resistance-studies'),
    ('RRS', '310', 'Critical Race Theory', 'CRT approaches.', 'undergraduate', 3, 'RRS 200', 'race-resistance-studies'),
    ('RRS', '400', 'Research in RRS', 'Research methods.', 'undergraduate', 3, 'RRS 200', 'race-resistance-studies'),
]

# =============================================
# FOREIGN LANGUAGES
# =============================================

SPAN_COURSES = [
    ('SPAN', '101', 'Elementary Spanish I', 'Beginning Spanish.', 'undergraduate', 4, None, 'spanish'),
    ('SPAN', '102', 'Elementary Spanish II', 'Continuing Spanish.', 'undergraduate', 4, 'SPAN 101', 'spanish'),
    ('SPAN', '201', 'Intermediate Spanish I', 'Intermediate level.', 'undergraduate', 4, 'SPAN 102', 'spanish'),
    ('SPAN', '202', 'Intermediate Spanish II', 'Continued intermediate.', 'undergraduate', 4, 'SPAN 201', 'spanish'),
    ('SPAN', '220', 'Spanish for Heritage Speakers', 'Heritage speakers.', 'undergraduate', 4, None, 'spanish'),
    ('SPAN', '300', 'Advanced Grammar', 'Grammar and composition.', 'undergraduate', 3, 'SPAN 202', 'spanish'),
    ('SPAN', '310', 'Spanish Conversation', 'Speaking practice.', 'undergraduate', 3, 'SPAN 202', 'spanish'),
    ('SPAN', '320', 'Spanish Composition', 'Writing skills.', 'undergraduate', 3, 'SPAN 300', 'spanish'),
    ('SPAN', '330', 'Introduction to Spanish Literature', 'Literary survey.', 'undergraduate', 3, 'SPAN 202', 'spanish'),
    ('SPAN', '340', 'Spanish Civilization', 'Culture of Spain.', 'undergraduate', 3, 'SPAN 202', 'spanish'),
    ('SPAN', '350', 'Latin American Civilization', 'Latin American culture.', 'undergraduate', 3, 'SPAN 202', 'spanish'),
    ('SPAN', '400', 'Spanish Phonetics', 'Pronunciation.', 'undergraduate', 3, 'SPAN 300', 'spanish'),
    ('SPAN', '410', 'Spanish Linguistics', 'Language structure.', 'undergraduate', 3, 'SPAN 300', 'spanish'),
    ('SPAN', '420', 'Spanish Literature I', 'Medieval to Golden Age.', 'undergraduate', 3, 'SPAN 330', 'spanish'),
    ('SPAN', '421', 'Spanish Literature II', 'Modern literature.', 'undergraduate', 3, 'SPAN 420', 'spanish'),
    ('SPAN', '430', 'Latin American Literature I', 'Colonial period.', 'undergraduate', 3, 'SPAN 330', 'spanish'),
    ('SPAN', '431', 'Latin American Literature II', 'Modern period.', 'undergraduate', 3, 'SPAN 430', 'spanish'),
    ('SPAN', '440', 'Translation', 'Spanish-English translation.', 'undergraduate', 3, 'SPAN 320', 'spanish'),
    ('SPAN', '600', 'Graduate Spanish', 'Graduate-level Spanish.', 'graduate', 3, None, 'spanish'),
]

FREN_COURSES = [
    ('FREN', '101', 'Elementary French I', 'Beginning French.', 'undergraduate', 4, None, 'french'),
    ('FREN', '102', 'Elementary French II', 'Continuing French.', 'undergraduate', 4, 'FREN 101', 'french'),
    ('FREN', '201', 'Intermediate French I', 'Intermediate level.', 'undergraduate', 4, 'FREN 102', 'french'),
    ('FREN', '202', 'Intermediate French II', 'Continued intermediate.', 'undergraduate', 4, 'FREN 201', 'french'),
    ('FREN', '300', 'French Conversation', 'Speaking practice.', 'undergraduate', 3, 'FREN 202', 'french'),
    ('FREN', '310', 'Advanced Grammar', 'Grammar study.', 'undergraduate', 3, 'FREN 202', 'french'),
    ('FREN', '320', 'French Civilization', 'French culture.', 'undergraduate', 3, 'FREN 202', 'french'),
    ('FREN', '330', 'Introduction to French Literature', 'Literary survey.', 'undergraduate', 3, 'FREN 202', 'french'),
    ('FREN', '400', 'French Literature I', 'Medieval to 18th century.', 'undergraduate', 3, 'FREN 330', 'french'),
    ('FREN', '401', 'French Literature II', 'Modern literature.', 'undergraduate', 3, 'FREN 400', 'french'),
    ('FREN', '410', 'French Linguistics', 'Language structure.', 'undergraduate', 3, 'FREN 310', 'french'),
    ('FREN', '420', 'Francophone Studies', 'Francophone world.', 'undergraduate', 3, 'FREN 320', 'french'),
    ('FREN', '600', 'Graduate French', 'Graduate-level French.', 'graduate', 3, None, 'french'),
]

GERM_COURSES = [
    ('GERM', '101', 'Elementary German I', 'Beginning German.', 'undergraduate', 4, None, 'german'),
    ('GERM', '102', 'Elementary German II', 'Continuing German.', 'undergraduate', 4, 'GERM 101', 'german'),
    ('GERM', '201', 'Intermediate German I', 'Intermediate level.', 'undergraduate', 4, 'GERM 102', 'german'),
    ('GERM', '202', 'Intermediate German II', 'Continued intermediate.', 'undergraduate', 4, 'GERM 201', 'german'),
    ('GERM', '300', 'Advanced German', 'Advanced level.', 'undergraduate', 3, 'GERM 202', 'german'),
    ('GERM', '310', 'German Civilization', 'German culture.', 'undergraduate', 3, 'GERM 202', 'german'),
    ('GERM', '320', 'Introduction to German Literature', 'Literary survey.', 'undergraduate', 3, 'GERM 202', 'german'),
    ('GERM', '400', 'German Literature', 'Advanced literature.', 'undergraduate', 3, 'GERM 320', 'german'),
    ('GERM', '600', 'Graduate German', 'Graduate-level German.', 'graduate', 3, None, 'german'),
]

ITAL_COURSES = [
    ('ITAL', '101', 'Elementary Italian I', 'Beginning Italian.', 'undergraduate', 4, None, 'italian'),
    ('ITAL', '102', 'Elementary Italian II', 'Continuing Italian.', 'undergraduate', 4, 'ITAL 101', 'italian'),
    ('ITAL', '201', 'Intermediate Italian I', 'Intermediate level.', 'undergraduate', 4, 'ITAL 102', 'italian'),
    ('ITAL', '202', 'Intermediate Italian II', 'Continued intermediate.', 'undergraduate', 4, 'ITAL 201', 'italian'),
    ('ITAL', '300', 'Advanced Italian', 'Advanced level.', 'undergraduate', 3, 'ITAL 202', 'italian'),
    ('ITAL', '310', 'Italian Civilization', 'Italian culture.', 'undergraduate', 3, 'ITAL 202', 'italian'),
    ('ITAL', '320', 'Italian Literature', 'Literary survey.', 'undergraduate', 3, 'ITAL 202', 'italian'),
]

JPNS_COURSES = [
    ('JPNS', '101', 'Elementary Japanese I', 'Beginning Japanese.', 'undergraduate', 4, None, 'japanese'),
    ('JPNS', '102', 'Elementary Japanese II', 'Continuing Japanese.', 'undergraduate', 4, 'JPNS 101', 'japanese'),
    ('JPNS', '201', 'Intermediate Japanese I', 'Intermediate level.', 'undergraduate', 4, 'JPNS 102', 'japanese'),
    ('JPNS', '202', 'Intermediate Japanese II', 'Continued intermediate.', 'undergraduate', 4, 'JPNS 201', 'japanese'),
    ('JPNS', '300', 'Advanced Japanese I', 'Advanced level.', 'undergraduate', 4, 'JPNS 202', 'japanese'),
    ('JPNS', '301', 'Advanced Japanese II', 'Continued advanced.', 'undergraduate', 4, 'JPNS 300', 'japanese'),
    ('JPNS', '310', 'Japanese Culture', 'Japanese culture.', 'undergraduate', 3, 'JPNS 202', 'japanese'),
    ('JPNS', '320', 'Japanese Literature', 'Literary survey.', 'undergraduate', 3, 'JPNS 202', 'japanese'),
    ('JPNS', '400', 'Classical Japanese', 'Classical language.', 'undergraduate', 3, 'JPNS 301', 'japanese'),
]

CHIN_COURSES = [
    ('CHIN', '101', 'Elementary Chinese I', 'Beginning Mandarin.', 'undergraduate', 4, None, 'chinese'),
    ('CHIN', '102', 'Elementary Chinese II', 'Continuing Mandarin.', 'undergraduate', 4, 'CHIN 101', 'chinese'),
    ('CHIN', '201', 'Intermediate Chinese I', 'Intermediate level.', 'undergraduate', 4, 'CHIN 102', 'chinese'),
    ('CHIN', '202', 'Intermediate Chinese II', 'Continued intermediate.', 'undergraduate', 4, 'CHIN 201', 'chinese'),
    ('CHIN', '300', 'Advanced Chinese I', 'Advanced level.', 'undergraduate', 4, 'CHIN 202', 'chinese'),
    ('CHIN', '301', 'Advanced Chinese II', 'Continued advanced.', 'undergraduate', 4, 'CHIN 300', 'chinese'),
    ('CHIN', '310', 'Chinese Culture', 'Chinese culture.', 'undergraduate', 3, 'CHIN 202', 'chinese'),
    ('CHIN', '320', 'Chinese Literature', 'Literary survey.', 'undergraduate', 3, 'CHIN 202', 'chinese'),
    ('CHIN', '400', 'Classical Chinese', 'Classical language.', 'undergraduate', 3, 'CHIN 301', 'chinese'),
]

ARAB_COURSES = [
    ('ARAB', '101', 'Elementary Arabic I', 'Beginning Arabic.', 'undergraduate', 4, None, 'arabic'),
    ('ARAB', '102', 'Elementary Arabic II', 'Continuing Arabic.', 'undergraduate', 4, 'ARAB 101', 'arabic'),
    ('ARAB', '201', 'Intermediate Arabic I', 'Intermediate level.', 'undergraduate', 4, 'ARAB 102', 'arabic'),
    ('ARAB', '202', 'Intermediate Arabic II', 'Continued intermediate.', 'undergraduate', 4, 'ARAB 201', 'arabic'),
    ('ARAB', '300', 'Advanced Arabic', 'Advanced level.', 'undergraduate', 3, 'ARAB 202', 'arabic'),
    ('ARAB', '310', 'Arabic Culture', 'Arab world culture.', 'undergraduate', 3, 'ARAB 202', 'arabic'),
]

PORT_COURSES = [
    ('PORT', '101', 'Elementary Portuguese I', 'Beginning Portuguese.', 'undergraduate', 4, None, 'portuguese'),
    ('PORT', '102', 'Elementary Portuguese II', 'Continuing Portuguese.', 'undergraduate', 4, 'PORT 101', 'portuguese'),
    ('PORT', '201', 'Intermediate Portuguese', 'Intermediate level.', 'undergraduate', 4, 'PORT 102', 'portuguese'),
    ('PORT', '300', 'Advanced Portuguese', 'Advanced level.', 'undergraduate', 3, 'PORT 201', 'portuguese'),
    ('PORT', '310', 'Brazilian Culture', 'Brazilian culture.', 'undergraduate', 3, 'PORT 201', 'portuguese'),
]

HUM_COURSES = [
    ('HUM', '300', 'Introduction to Humanities', 'Humanities overview.', 'undergraduate', 3, None, 'humanities'),
    ('HUM', '310', 'Classical Humanities', 'Ancient world.', 'undergraduate', 3, 'HUM 300', 'humanities'),
    ('HUM', '320', 'Renaissance Humanities', 'Renaissance period.', 'undergraduate', 3, 'HUM 300', 'humanities'),
    ('HUM', '330', 'Modern Humanities', 'Modern era.', 'undergraduate', 3, 'HUM 300', 'humanities'),
    ('HUM', '400', 'Contemporary Humanities', 'Contemporary issues.', 'undergraduate', 3, 'HUM 300', 'humanities'),
    ('HUM', '600', 'Graduate Humanities', 'Graduate-level HUM.', 'graduate', 3, None, 'humanities'),
]

ANTH_COURSES = [
    ('ANTH', '100', 'Introduction to Anthropology', 'Anthropology overview.', 'undergraduate', 3, None, 'anthropology'),
    ('ANTH', '110', 'Introduction to Physical Anthropology', 'Biological anthropology.', 'undergraduate', 3, None, 'anthropology'),
    ('ANTH', '120', 'Introduction to Archaeology', 'Archaeological methods.', 'undergraduate', 3, None, 'anthropology'),
    ('ANTH', '200', 'Cultural Anthropology', 'Cultural perspectives.', 'undergraduate', 3, 'ANTH 100', 'anthropology'),
    ('ANTH', '210', 'Linguistic Anthropology', 'Language and culture.', 'undergraduate', 3, 'ANTH 100', 'anthropology'),
    ('ANTH', '300', 'Ethnographic Methods', 'Field methods.', 'undergraduate', 3, 'ANTH 200', 'anthropology'),
    ('ANTH', '310', 'Anthropological Theory', 'Theoretical frameworks.', 'undergraduate', 3, 'ANTH 200', 'anthropology'),
    ('ANTH', '320', 'Medical Anthropology', 'Health and culture.', 'undergraduate', 3, 'ANTH 200', 'anthropology'),
    ('ANTH', '330', 'Urban Anthropology', 'Cities and culture.', 'undergraduate', 3, 'ANTH 200', 'anthropology'),
    ('ANTH', '340', 'Environmental Anthropology', 'Environment and culture.', 'undergraduate', 3, 'ANTH 200', 'anthropology'),
    ('ANTH', '350', 'Anthropology of Religion', 'Religious practices.', 'undergraduate', 3, 'ANTH 200', 'anthropology'),
    ('ANTH', '400', 'Human Evolution', 'Evolutionary history.', 'undergraduate', 3, 'ANTH 110', 'anthropology'),
    ('ANTH', '410', 'North American Archaeology', 'American archaeology.', 'undergraduate', 3, 'ANTH 120', 'anthropology'),
    ('ANTH', '600', 'Graduate Anthropology', 'Graduate-level ANTH.', 'graduate', 3, None, 'anthropology'),
]

GEOG_COURSES = [
    ('GEOG', '100', 'Introduction to Geography', 'Geography overview.', 'undergraduate', 3, None, 'geography'),
    ('GEOG', '110', 'Physical Geography', 'Physical landscape.', 'undergraduate', 3, None, 'geography'),
    ('GEOG', '120', 'Human Geography', 'Human patterns.', 'undergraduate', 3, None, 'geography'),
    ('GEOG', '200', 'World Regional Geography', 'Regional analysis.', 'undergraduate', 3, 'GEOG 100', 'geography'),
    ('GEOG', '210', 'Cartography', 'Map making.', 'undergraduate', 3, 'GEOG 100', 'geography'),
    ('GEOG', '300', 'Geographic Information Systems', 'GIS fundamentals.', 'undergraduate', 3, 'GEOG 210', 'geography'),
    ('GEOG', '310', 'Remote Sensing', 'Satellite imagery.', 'undergraduate', 3, 'GEOG 300', 'geography'),
    ('GEOG', '320', 'Urban Geography', 'City analysis.', 'undergraduate', 3, 'GEOG 120', 'geography'),
    ('GEOG', '330', 'Economic Geography', 'Economic patterns.', 'undergraduate', 3, 'GEOG 120', 'geography'),
    ('GEOG', '340', 'Political Geography', 'Geopolitics.', 'undergraduate', 3, 'GEOG 120', 'geography'),
    ('GEOG', '350', 'Climatology', 'Climate patterns.', 'undergraduate', 3, 'GEOG 110', 'geography'),
    ('GEOG', '400', 'Biogeography', 'Species distribution.', 'undergraduate', 3, 'GEOG 110', 'geography'),
    ('GEOG', '410', 'Resource Geography', 'Natural resources.', 'undergraduate', 3, 'GEOG 110', 'geography'),
    ('GEOG', '600', 'Graduate Geography', 'Graduate-level GEOG.', 'graduate', 3, None, 'geography'),
]

LING_COURSES = [
    ('LING', '200', 'Introduction to Linguistics', 'Linguistics overview.', 'undergraduate', 3, None, 'linguistics'),
    ('LING', '300', 'Phonetics', 'Sound systems.', 'undergraduate', 3, 'LING 200', 'linguistics'),
    ('LING', '310', 'Phonology', 'Sound patterns.', 'undergraduate', 3, 'LING 300', 'linguistics'),
    ('LING', '320', 'Morphology', 'Word structure.', 'undergraduate', 3, 'LING 200', 'linguistics'),
    ('LING', '330', 'Syntax', 'Sentence structure.', 'undergraduate', 3, 'LING 200', 'linguistics'),
    ('LING', '340', 'Semantics', 'Meaning.', 'undergraduate', 3, 'LING 200', 'linguistics'),
    ('LING', '350', 'Sociolinguistics', 'Language and society.', 'undergraduate', 3, 'LING 200', 'linguistics'),
    ('LING', '360', 'Psycholinguistics', 'Language and mind.', 'undergraduate', 3, 'LING 200', 'linguistics'),
    ('LING', '400', 'Historical Linguistics', 'Language change.', 'undergraduate', 3, 'LING 200', 'linguistics'),
    ('LING', '410', 'Computational Linguistics', 'NLP fundamentals.', 'undergraduate', 3, 'LING 200', 'linguistics'),
    ('LING', '420', 'Language Acquisition', 'First language learning.', 'undergraduate', 3, 'LING 200', 'linguistics'),
    ('LING', '430', 'Second Language Acquisition', 'L2 learning.', 'undergraduate', 3, 'LING 200', 'linguistics'),
    ('LING', '600', 'Graduate Linguistics', 'Graduate-level LING.', 'graduate', 3, None, 'linguistics'),
]

WGSS_COURSES = [
    ('WGSS', '100', 'Introduction to Women and Gender Studies', 'WGSS overview.', 'undergraduate', 3, None, 'womens-gender-studies'),
    ('WGSS', '200', 'Feminist Theory', 'Feminist perspectives.', 'undergraduate', 3, 'WGSS 100', 'womens-gender-studies'),
    ('WGSS', '210', 'Women in History', 'Women historical analysis.', 'undergraduate', 3, 'WGSS 100', 'womens-gender-studies'),
    ('WGSS', '220', 'Women and Work', 'Labor and gender.', 'undergraduate', 3, 'WGSS 100', 'womens-gender-studies'),
    ('WGSS', '230', 'Women and Health', 'Health and gender.', 'undergraduate', 3, 'WGSS 100', 'womens-gender-studies'),
    ('WGSS', '300', 'Sexuality Studies', 'Sexuality and society.', 'undergraduate', 3, 'WGSS 100', 'womens-gender-studies'),
    ('WGSS', '310', 'Queer Studies', 'LGBTQ perspectives.', 'undergraduate', 3, 'WGSS 100', 'womens-gender-studies'),
    ('WGSS', '320', 'Gender and Media', 'Media representations.', 'undergraduate', 3, 'WGSS 100', 'womens-gender-studies'),
    ('WGSS', '400', 'Transnational Feminisms', 'Global feminism.', 'undergraduate', 3, 'WGSS 200', 'womens-gender-studies'),
    ('WGSS', '600', 'Graduate WGSS', 'Graduate-level WGSS.', 'graduate', 3, None, 'womens-gender-studies'),
]

USPS_COURSES = [
    ('USPS', '300', 'Introduction to Urban Studies', 'Urban studies overview.', 'undergraduate', 3, None, 'urban-studies'),
    ('USPS', '310', 'Urban Planning', 'City planning.', 'undergraduate', 3, 'USPS 300', 'urban-studies'),
    ('USPS', '320', 'Urban Policy', 'Urban policy analysis.', 'undergraduate', 3, 'USPS 300', 'urban-studies'),
    ('USPS', '330', 'Community Development', 'Community building.', 'undergraduate', 3, 'USPS 300', 'urban-studies'),
    ('USPS', '340', 'Housing Policy', 'Housing issues.', 'undergraduate', 3, 'USPS 300', 'urban-studies'),
    ('USPS', '400', 'Transportation Planning', 'Transit systems.', 'undergraduate', 3, 'USPS 310', 'urban-studies'),
    ('USPS', '600', 'Graduate Urban Studies', 'Graduate-level USPS.', 'graduate', 3, None, 'urban-studies'),
]

IR_COURSES = [
    ('IR', '200', 'Introduction to International Relations', 'IR overview.', 'undergraduate', 3, None, 'international-relations'),
    ('IR', '300', 'International Organizations', 'Global institutions.', 'undergraduate', 3, 'IR 200', 'international-relations'),
    ('IR', '310', 'International Security', 'Security studies.', 'undergraduate', 3, 'IR 200', 'international-relations'),
    ('IR', '320', 'International Political Economy', 'Global economy.', 'undergraduate', 3, 'IR 200', 'international-relations'),
    ('IR', '330', 'Human Rights', 'Human rights issues.', 'undergraduate', 3, 'IR 200', 'international-relations'),
    ('IR', '400', 'Foreign Policy Analysis', 'Policy making.', 'undergraduate', 3, 'IR 300', 'international-relations'),
    ('IR', '600', 'Graduate International Relations', 'Graduate-level IR.', 'graduate', 3, None, 'international-relations'),
]

HTM_COURSES = [
    ('HTM', '100', 'Introduction to Hospitality and Tourism', 'HTM overview.', 'undergraduate', 3, None, 'hospitality-tourism'),
    ('HTM', '200', 'Hotel Management', 'Hotel operations.', 'undergraduate', 3, 'HTM 100', 'hospitality-tourism'),
    ('HTM', '210', 'Restaurant Management', 'Food service.', 'undergraduate', 3, 'HTM 100', 'hospitality-tourism'),
    ('HTM', '220', 'Tourism Management', 'Tourism industry.', 'undergraduate', 3, 'HTM 100', 'hospitality-tourism'),
    ('HTM', '300', 'Event Management', 'Event planning.', 'undergraduate', 3, 'HTM 100', 'hospitality-tourism'),
    ('HTM', '310', 'Hospitality Marketing', 'Marketing strategies.', 'undergraduate', 3, 'HTM 100', 'hospitality-tourism'),
    ('HTM', '320', 'Revenue Management', 'Pricing strategies.', 'undergraduate', 3, 'HTM 200', 'hospitality-tourism'),
    ('HTM', '400', 'Hospitality Leadership', 'Management skills.', 'undergraduate', 3, 'HTM 300', 'hospitality-tourism'),
]

# Combine all arts and humanities courses
ARTS_HUMANITIES_COURSES = (
    ENG_COURSES + HIST_COURSES + PHIL_COURSES + PLSI_COURSES + 
    COMM_COURSES + JOUR_COURSES + BECA_COURSES + CINE_COURSES + 
    ART_COURSES + ARTH_COURSES + DAM_COURSES + MUS_COURSES + 
    TH_A_COURSES + DANC_COURSES + ED_COURSES + ISED_COURSES + 
    SPED_COURSES + COUN_COURSES + AAS_COURSES + AFRS_COURSES + 
    LTNS_COURSES + AIS_COURSES + RRS_COURSES + SPAN_COURSES + 
    FREN_COURSES + GERM_COURSES + ITAL_COURSES + JPNS_COURSES + 
    CHIN_COURSES + ARAB_COURSES + PORT_COURSES + HUM_COURSES + 
    ANTH_COURSES + GEOG_COURSES + LING_COURSES + WGSS_COURSES + 
    USPS_COURSES + IR_COURSES + HTM_COURSES
)

