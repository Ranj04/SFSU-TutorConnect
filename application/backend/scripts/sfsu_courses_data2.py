#!/usr/bin/env python3
"""
sfsu_courses_data2.py
---------------------
Course data for Business, Social Sciences, Humanities, and Arts at SFSU.
Part 2 of 3 data files used by update_courses.py.

Contributors: Ranjiv Jithendran
"""

# =============================================
# LAM FAMILY COLLEGE OF BUSINESS
# =============================================

BUS_COURSES = [
    ('BUS', '100', 'Introduction to Business', 'Business fundamentals overview.', 'undergraduate', 3, None, 'business-administration'),
    ('BUS', '201', 'Legal Environment of Business', 'Business law basics.', 'undergraduate', 3, None, 'business-administration'),
    ('BUS', '300', 'Business Communication', 'Professional communication skills.', 'undergraduate', 3, None, 'business-administration'),
    ('BUS', '350', 'Business Ethics', 'Ethical decision-making.', 'undergraduate', 3, None, 'business-administration'),
    ('BUS', '360', 'Operations Management', 'Production and operations.', 'undergraduate', 3, None, 'business-administration'),
    ('BUS', '370', 'Business Analytics', 'Data-driven decision making.', 'undergraduate', 3, 'MATH 124', 'business-administration'),
    ('BUS', '380', 'International Business', 'Global business strategies.', 'undergraduate', 3, None, 'business-administration'),
    ('BUS', '400', 'Entrepreneurship', 'Starting new ventures.', 'undergraduate', 3, None, 'business-administration'),
    ('BUS', '682', 'Strategic Management', 'Competitive strategy.', 'graduate', 3, None, 'business-administration'),
    ('BUS', '690', 'Business Consulting', 'Consulting methodology.', 'graduate', 3, None, 'business-administration'),
    ('BUS', '700', 'MBA Capstone', 'Integrative business project.', 'graduate', 3, None, 'business-administration'),
]

ACCT_COURSES = [
    ('ACCT', '100', 'Introduction to Accounting', 'Accounting principles.', 'undergraduate', 3, None, 'accounting'),
    ('ACCT', '200', 'Financial Accounting', 'Financial statement preparation.', 'undergraduate', 3, 'ACCT 100', 'accounting'),
    ('ACCT', '201', 'Managerial Accounting', 'Cost and management accounting.', 'undergraduate', 3, 'ACCT 200', 'accounting'),
    ('ACCT', '301', 'Intermediate Accounting I', 'Advanced financial accounting.', 'undergraduate', 3, 'ACCT 200', 'accounting'),
    ('ACCT', '302', 'Intermediate Accounting II', 'Equity and special topics.', 'undergraduate', 3, 'ACCT 301', 'accounting'),
    ('ACCT', '310', 'Accounting Information Systems', 'IT in accounting.', 'undergraduate', 3, 'ACCT 200', 'accounting'),
    ('ACCT', '410', 'Cost Accounting', 'Cost analysis and control.', 'undergraduate', 3, 'ACCT 201', 'accounting'),
    ('ACCT', '420', 'Government Accounting', 'Public sector accounting.', 'undergraduate', 3, 'ACCT 301', 'accounting'),
    ('ACCT', '500', 'Advanced Accounting', 'Consolidations and partnerships.', 'undergraduate', 3, 'ACCT 302', 'accounting'),
    ('ACCT', '510', 'Auditing', 'Audit procedures and standards.', 'undergraduate', 3, 'ACCT 302', 'accounting'),
    ('ACCT', '520', 'Federal Taxation I', 'Individual taxation.', 'undergraduate', 3, 'ACCT 301', 'accounting'),
    ('ACCT', '521', 'Federal Taxation II', 'Corporate taxation.', 'undergraduate', 3, 'ACCT 520', 'accounting'),
    ('ACCT', '610', 'Forensic Accounting', 'Fraud detection and investigation.', 'graduate', 3, 'ACCT 510', 'accounting'),
    ('ACCT', '700', 'Accounting Research', 'Research in accounting.', 'graduate', 3, None, 'accounting'),
]

ECON_COURSES = [
    ('ECON', '101', 'Principles of Macroeconomics', 'National economy and policy.', 'undergraduate', 3, None, 'economics'),
    ('ECON', '102', 'Principles of Microeconomics', 'Supply, demand, and markets.', 'undergraduate', 3, None, 'economics'),
    ('ECON', '200', 'Economic Statistics', 'Statistics for economics.', 'undergraduate', 3, 'MATH 124', 'economics'),
    ('ECON', '301', 'Intermediate Microeconomics', 'Consumer and producer theory.', 'undergraduate', 3, 'ECON 102', 'economics'),
    ('ECON', '302', 'Intermediate Macroeconomics', 'Macroeconomic models.', 'undergraduate', 3, 'ECON 101', 'economics'),
    ('ECON', '311', 'Money and Banking', 'Financial institutions.', 'undergraduate', 3, 'ECON 101', 'economics'),
    ('ECON', '312', 'Public Finance', 'Government taxation and spending.', 'undergraduate', 3, 'ECON 102', 'economics'),
    ('ECON', '320', 'Labor Economics', 'Labor markets and wages.', 'undergraduate', 3, 'ECON 102', 'economics'),
    ('ECON', '330', 'International Trade', 'Trade theory and policy.', 'undergraduate', 3, 'ECON 102', 'economics'),
    ('ECON', '331', 'International Finance', 'Exchange rates and capital flows.', 'undergraduate', 3, 'ECON 101', 'economics'),
    ('ECON', '340', 'Environmental Economics', 'Economics of environment.', 'undergraduate', 3, 'ECON 102', 'economics'),
    ('ECON', '350', 'Urban Economics', 'Cities and regional development.', 'undergraduate', 3, 'ECON 102', 'economics'),
    ('ECON', '360', 'Health Economics', 'Economics of healthcare.', 'undergraduate', 3, 'ECON 102', 'economics'),
    ('ECON', '400', 'Industrial Organization', 'Market structure and competition.', 'undergraduate', 3, 'ECON 301', 'economics'),
    ('ECON', '410', 'Economic Development', 'Developing economies.', 'undergraduate', 3, 'ECON 102', 'economics'),
    ('ECON', '420', 'History of Economic Thought', 'Evolution of economic ideas.', 'undergraduate', 3, 'ECON 102', 'economics'),
    ('ECON', '431', 'Econometrics', 'Statistical methods in economics.', 'undergraduate', 3, 'ECON 200', 'economics'),
    ('ECON', '432', 'Applied Econometrics', 'Econometric applications.', 'undergraduate', 3, 'ECON 431', 'economics'),
    ('ECON', '600', 'Graduate Economics', 'Graduate-level economics.', 'graduate', 3, None, 'economics'),
    ('ECON', '700', 'Thesis', 'Graduate thesis research.', 'graduate', 6, None, 'economics'),
]

FIN_COURSES = [
    ('FIN', '350', 'Business Finance', 'Corporate finance fundamentals.', 'undergraduate', 3, 'ACCT 200', 'finance'),
    ('FIN', '400', 'Investments', 'Securities analysis.', 'undergraduate', 3, 'FIN 350', 'finance'),
    ('FIN', '410', 'Financial Markets', 'Market structure and trading.', 'undergraduate', 3, 'FIN 350', 'finance'),
    ('FIN', '420', 'International Finance', 'Global financial management.', 'undergraduate', 3, 'FIN 350', 'finance'),
    ('FIN', '430', 'Financial Institutions', 'Banking and finance.', 'undergraduate', 3, 'FIN 350', 'finance'),
    ('FIN', '440', 'Portfolio Management', 'Investment portfolio theory.', 'undergraduate', 3, 'FIN 400', 'finance'),
    ('FIN', '450', 'Derivatives', 'Options and futures.', 'undergraduate', 3, 'FIN 400', 'finance'),
    ('FIN', '460', 'Real Estate Finance', 'Real estate investments.', 'undergraduate', 3, 'FIN 350', 'finance'),
    ('FIN', '470', 'Corporate Finance', 'Advanced corporate finance.', 'undergraduate', 3, 'FIN 350', 'finance'),
    ('FIN', '480', 'Financial Statement Analysis', 'Financial analysis.', 'undergraduate', 3, 'ACCT 302', 'finance'),
    ('FIN', '600', 'Graduate Finance', 'Graduate-level finance.', 'graduate', 3, None, 'finance'),
]

MGMT_COURSES = [
    ('MGMT', '300', 'Principles of Management', 'Management fundamentals.', 'undergraduate', 3, None, 'management'),
    ('MGMT', '310', 'Organizational Behavior', 'Behavior in organizations.', 'undergraduate', 3, 'MGMT 300', 'management'),
    ('MGMT', '320', 'Human Resource Management', 'HR practices and policies.', 'undergraduate', 3, 'MGMT 300', 'management'),
    ('MGMT', '330', 'Operations Management', 'Production and operations.', 'undergraduate', 3, 'MGMT 300', 'management'),
    ('MGMT', '340', 'Leadership', 'Leadership theory and practice.', 'undergraduate', 3, 'MGMT 300', 'management'),
    ('MGMT', '350', 'Project Management', 'Project planning and control.', 'undergraduate', 3, 'MGMT 300', 'management'),
    ('MGMT', '360', 'Supply Chain Management', 'Logistics and supply chain.', 'undergraduate', 3, 'MGMT 330', 'management'),
    ('MGMT', '400', 'Negotiation', 'Negotiation skills.', 'undergraduate', 3, 'MGMT 300', 'management'),
    ('MGMT', '410', 'Change Management', 'Organizational change.', 'undergraduate', 3, 'MGMT 310', 'management'),
    ('MGMT', '420', 'Cross-Cultural Management', 'Managing diverse teams.', 'undergraduate', 3, 'MGMT 310', 'management'),
    ('MGMT', '600', 'Graduate Management', 'Graduate-level management.', 'graduate', 3, None, 'management'),
]

MKTG_COURSES = [
    ('MKTG', '300', 'Principles of Marketing', 'Marketing fundamentals.', 'undergraduate', 3, None, 'marketing'),
    ('MKTG', '310', 'Consumer Behavior', 'Consumer psychology.', 'undergraduate', 3, 'MKTG 300', 'marketing'),
    ('MKTG', '320', 'Marketing Research', 'Market research methods.', 'undergraduate', 3, 'MKTG 300', 'marketing'),
    ('MKTG', '330', 'Digital Marketing', 'Online marketing strategies.', 'undergraduate', 3, 'MKTG 300', 'marketing'),
    ('MKTG', '340', 'Advertising', 'Advertising campaigns.', 'undergraduate', 3, 'MKTG 300', 'marketing'),
    ('MKTG', '350', 'Sales Management', 'Sales strategies.', 'undergraduate', 3, 'MKTG 300', 'marketing'),
    ('MKTG', '360', 'Brand Management', 'Brand strategy.', 'undergraduate', 3, 'MKTG 300', 'marketing'),
    ('MKTG', '400', 'International Marketing', 'Global marketing.', 'undergraduate', 3, 'MKTG 300', 'marketing'),
    ('MKTG', '410', 'Social Media Marketing', 'Social media strategies.', 'undergraduate', 3, 'MKTG 330', 'marketing'),
    ('MKTG', '420', 'Marketing Analytics', 'Data-driven marketing.', 'undergraduate', 3, 'MKTG 320', 'marketing'),
    ('MKTG', '600', 'Graduate Marketing', 'Graduate-level marketing.', 'graduate', 3, None, 'marketing'),
]

ISYS_COURSES = [
    ('ISYS', '263', 'Introduction to Information Systems', 'IS fundamentals.', 'undergraduate', 3, None, 'information-systems'),
    ('ISYS', '350', 'Business Application Development', 'Application development.', 'undergraduate', 3, 'ISYS 263', 'information-systems'),
    ('ISYS', '363', 'Data and Information Management', 'Database management.', 'undergraduate', 3, 'ISYS 263', 'information-systems'),
    ('ISYS', '464', 'Business Data Communications', 'Network technologies.', 'undergraduate', 3, 'ISYS 263', 'information-systems'),
    ('ISYS', '465', 'Systems Analysis and Design', 'System development.', 'undergraduate', 3, 'ISYS 350', 'information-systems'),
    ('ISYS', '466', 'IT Project Management', 'IT project management.', 'undergraduate', 3, 'ISYS 465', 'information-systems'),
    ('ISYS', '520', 'Information Security', 'Cybersecurity principles.', 'undergraduate', 3, 'ISYS 464', 'information-systems'),
    ('ISYS', '530', 'Enterprise Resource Planning', 'ERP systems.', 'undergraduate', 3, 'ISYS 363', 'information-systems'),
    ('ISYS', '540', 'Business Intelligence', 'BI and analytics.', 'undergraduate', 3, 'ISYS 363', 'information-systems'),
    ('ISYS', '550', 'E-Commerce', 'Electronic commerce.', 'undergraduate', 3, 'ISYS 263', 'information-systems'),
    ('ISYS', '600', 'Graduate Information Systems', 'Graduate-level IS.', 'graduate', 3, None, 'information-systems'),
]

# =============================================
# COLLEGE OF HEALTH & SOCIAL SCIENCES
# =============================================

PSY_COURSES = [
    ('PSY', '200', 'General Psychology', 'Introduction to psychology.', 'undergraduate', 3, None, 'psychology'),
    ('PSY', '210', 'Psychology of Personal Growth', 'Personal development.', 'undergraduate', 3, None, 'psychology'),
    ('PSY', '250', 'Research Methods', 'Research design in psychology.', 'undergraduate', 3, 'PSY 200', 'psychology'),
    ('PSY', '260', 'Biological Psychology', 'Brain and behavior.', 'undergraduate', 3, 'PSY 200', 'psychology'),
    ('PSY', '301', 'Child Development', 'Child psychological development.', 'undergraduate', 3, 'PSY 200', 'psychology'),
    ('PSY', '302', 'Adolescent Development', 'Teenage development.', 'undergraduate', 3, 'PSY 200', 'psychology'),
    ('PSY', '303', 'Adult Development and Aging', 'Adult lifespan.', 'undergraduate', 3, 'PSY 200', 'psychology'),
    ('PSY', '310', 'Learning', 'Learning processes.', 'undergraduate', 3, 'PSY 200', 'psychology'),
    ('PSY', '315', 'Memory and Cognition', 'Memory processes.', 'undergraduate', 3, 'PSY 200', 'psychology'),
    ('PSY', '320', 'Social Psychology', 'Social behavior.', 'undergraduate', 3, 'PSY 200', 'psychology'),
    ('PSY', '330', 'Industrial-Organizational Psychology', 'Workplace psychology.', 'undergraduate', 3, 'PSY 200', 'psychology'),
    ('PSY', '340', 'Cognitive Psychology', 'Perception and thinking.', 'undergraduate', 3, 'PSY 200', 'psychology'),
    ('PSY', '350', 'Health Psychology', 'Health and behavior.', 'undergraduate', 3, 'PSY 200', 'psychology'),
    ('PSY', '360', 'Abnormal Psychology', 'Psychological disorders.', 'undergraduate', 3, 'PSY 200', 'psychology'),
    ('PSY', '370', 'Personality', 'Personality theories.', 'undergraduate', 3, 'PSY 200', 'psychology'),
    ('PSY', '371', 'Statistics for Psychology', 'Statistical analysis.', 'undergraduate', 3, 'PSY 250', 'psychology'),
    ('PSY', '380', 'Cross-Cultural Psychology', 'Culture and psychology.', 'undergraduate', 3, 'PSY 200', 'psychology'),
    ('PSY', '400', 'History of Psychology', 'Psychology history.', 'undergraduate', 3, 'PSY 200', 'psychology'),
    ('PSY', '410', 'Sensation and Perception', 'Sensory processes.', 'undergraduate', 3, 'PSY 200', 'psychology'),
    ('PSY', '420', 'Motivation', 'Motivational psychology.', 'undergraduate', 3, 'PSY 200', 'psychology'),
    ('PSY', '430', 'Clinical Psychology', 'Clinical approaches.', 'undergraduate', 3, 'PSY 360', 'psychology'),
    ('PSY', '440', 'Counseling Psychology', 'Counseling techniques.', 'undergraduate', 3, 'PSY 360', 'psychology'),
    ('PSY', '450', 'Biological Psychology', 'Neuroscience of behavior.', 'undergraduate', 3, 'PSY 260', 'psychology'),
    ('PSY', '460', 'Drugs and Behavior', 'Psychopharmacology.', 'undergraduate', 3, 'PSY 260', 'psychology'),
    ('PSY', '600', 'Graduate Psychology', 'Graduate-level psychology.', 'graduate', 3, None, 'psychology'),
    ('PSY', '700', 'Thesis', 'Graduate thesis research.', 'graduate', 6, None, 'psychology'),
]

SOC_COURSES = [
    ('SOC', '200', 'Introduction to Sociology', 'Sociological perspective.', 'undergraduate', 3, None, 'sociology'),
    ('SOC', '260', 'Social Interaction', 'Microsociology.', 'undergraduate', 3, 'SOC 200', 'sociology'),
    ('SOC', '301', 'Social Research Methods', 'Research methodologies.', 'undergraduate', 3, 'SOC 200', 'sociology'),
    ('SOC', '302', 'Quantitative Methods', 'Quantitative analysis.', 'undergraduate', 3, 'SOC 301', 'sociology'),
    ('SOC', '310', 'Social Theory', 'Sociological theories.', 'undergraduate', 3, 'SOC 200', 'sociology'),
    ('SOC', '320', 'Social Stratification', 'Class and inequality.', 'undergraduate', 3, 'SOC 200', 'sociology'),
    ('SOC', '330', 'Sociology of Gender', 'Gender and society.', 'undergraduate', 3, 'SOC 200', 'sociology'),
    ('SOC', '340', 'Sociology of the Family', 'Family structure.', 'undergraduate', 3, 'SOC 200', 'sociology'),
    ('SOC', '350', 'Criminology', 'Crime and deviance.', 'undergraduate', 3, 'SOC 200', 'sociology'),
    ('SOC', '360', 'Sociology of Religion', 'Religion and society.', 'undergraduate', 3, 'SOC 200', 'sociology'),
    ('SOC', '370', 'Race and Ethnicity', 'Racial relations.', 'undergraduate', 3, 'SOC 200', 'sociology'),
    ('SOC', '380', 'Urban Sociology', 'Cities and urbanization.', 'undergraduate', 3, 'SOC 200', 'sociology'),
    ('SOC', '390', 'Medical Sociology', 'Health and medicine.', 'undergraduate', 3, 'SOC 200', 'sociology'),
    ('SOC', '400', 'Sociology of Work', 'Labor and occupation.', 'undergraduate', 3, 'SOC 200', 'sociology'),
    ('SOC', '410', 'Environmental Sociology', 'Environment and society.', 'undergraduate', 3, 'SOC 200', 'sociology'),
    ('SOC', '420', 'Political Sociology', 'Power and politics.', 'undergraduate', 3, 'SOC 200', 'sociology'),
    ('SOC', '430', 'Globalization', 'Global social change.', 'undergraduate', 3, 'SOC 200', 'sociology'),
    ('SOC', '600', 'Graduate Sociology', 'Graduate-level sociology.', 'graduate', 3, None, 'sociology'),
    ('SOC', '700', 'Thesis', 'Graduate thesis research.', 'graduate', 6, None, 'sociology'),
]

SW_COURSES = [
    ('SW', '200', 'Introduction to Social Work', 'Social work overview.', 'undergraduate', 3, None, 'social-work'),
    ('SW', '310', 'Human Behavior and Social Environment I', 'Human development.', 'undergraduate', 3, 'SW 200', 'social-work'),
    ('SW', '311', 'Human Behavior and Social Environment II', 'Social context.', 'undergraduate', 3, 'SW 310', 'social-work'),
    ('SW', '400', 'Social Work Practice I', 'Practice methods.', 'undergraduate', 3, 'SW 311', 'social-work'),
    ('SW', '401', 'Social Work Practice II', 'Advanced practice.', 'undergraduate', 3, 'SW 400', 'social-work'),
    ('SW', '410', 'Social Welfare Policy', 'Policy analysis.', 'undergraduate', 3, 'SW 200', 'social-work'),
    ('SW', '420', 'Social Work Research', 'Research methods.', 'undergraduate', 3, 'SW 200', 'social-work'),
    ('SW', '450', 'Field Practicum I', 'Field experience.', 'undergraduate', 4, 'SW 400', 'social-work'),
    ('SW', '451', 'Field Practicum II', 'Advanced field experience.', 'undergraduate', 4, 'SW 450', 'social-work'),
    ('SW', '600', 'Graduate Social Work', 'Graduate-level SW.', 'graduate', 3, None, 'social-work'),
    ('SW', '700', 'Thesis', 'Graduate thesis research.', 'graduate', 6, None, 'social-work'),
]

CJ_COURSES = [
    ('CJ', '200', 'Introduction to Criminal Justice', 'Criminal justice overview.', 'undergraduate', 3, None, 'criminal-justice'),
    ('CJ', '210', 'Criminal Law', 'Substantive criminal law.', 'undergraduate', 3, 'CJ 200', 'criminal-justice'),
    ('CJ', '220', 'Policing', 'Law enforcement.', 'undergraduate', 3, 'CJ 200', 'criminal-justice'),
    ('CJ', '230', 'Courts and Adjudication', 'Court processes.', 'undergraduate', 3, 'CJ 200', 'criminal-justice'),
    ('CJ', '240', 'Corrections', 'Correctional systems.', 'undergraduate', 3, 'CJ 200', 'criminal-justice'),
    ('CJ', '300', 'Research Methods in CJ', 'Research methodologies.', 'undergraduate', 3, 'CJ 200', 'criminal-justice'),
    ('CJ', '310', 'Criminological Theory', 'Crime theories.', 'undergraduate', 3, 'CJ 200', 'criminal-justice'),
    ('CJ', '320', 'Juvenile Justice', 'Youth and crime.', 'undergraduate', 3, 'CJ 200', 'criminal-justice'),
    ('CJ', '330', 'Victimology', 'Crime victims.', 'undergraduate', 3, 'CJ 200', 'criminal-justice'),
    ('CJ', '340', 'White-Collar Crime', 'Corporate crime.', 'undergraduate', 3, 'CJ 200', 'criminal-justice'),
    ('CJ', '350', 'Drugs and Crime', 'Substance abuse and crime.', 'undergraduate', 3, 'CJ 200', 'criminal-justice'),
    ('CJ', '400', 'Criminal Investigation', 'Investigation methods.', 'undergraduate', 3, 'CJ 220', 'criminal-justice'),
    ('CJ', '410', 'Forensic Science', 'Scientific evidence.', 'undergraduate', 3, 'CJ 200', 'criminal-justice'),
    ('CJ', '420', 'Cybercrime', 'Computer crime.', 'undergraduate', 3, 'CJ 200', 'criminal-justice'),
    ('CJ', '430', 'Terrorism', 'Terrorism studies.', 'undergraduate', 3, 'CJ 200', 'criminal-justice'),
    ('CJ', '600', 'Graduate Criminal Justice', 'Graduate-level CJ.', 'graduate', 3, None, 'criminal-justice'),
]

KIN_COURSES = [
    ('KIN', '100', 'Introduction to Kinesiology', 'Kinesiology overview.', 'undergraduate', 3, None, 'kinesiology'),
    ('KIN', '200', 'Physical Activity and Health', 'Health and fitness.', 'undergraduate', 3, None, 'kinesiology'),
    ('KIN', '250', 'Anatomy and Physiology I', 'Human anatomy.', 'undergraduate', 4, None, 'kinesiology'),
    ('KIN', '251', 'Anatomy and Physiology II', 'Human physiology.', 'undergraduate', 4, 'KIN 250', 'kinesiology'),
    ('KIN', '300', 'Motor Development', 'Movement development.', 'undergraduate', 3, 'KIN 100', 'kinesiology'),
    ('KIN', '310', 'Biomechanics', 'Movement mechanics.', 'undergraduate', 3, 'KIN 250', 'kinesiology'),
    ('KIN', '320', 'Exercise Physiology', 'Physiological responses.', 'undergraduate', 3, 'KIN 251', 'kinesiology'),
    ('KIN', '330', 'Sport Psychology', 'Psychology in sport.', 'undergraduate', 3, 'PSY 200', 'kinesiology'),
    ('KIN', '340', 'Fitness Assessment', 'Fitness testing.', 'undergraduate', 3, 'KIN 320', 'kinesiology'),
    ('KIN', '350', 'Strength and Conditioning', 'Training principles.', 'undergraduate', 3, 'KIN 320', 'kinesiology'),
    ('KIN', '360', 'Nutrition for Sport', 'Sports nutrition.', 'undergraduate', 3, 'KIN 320', 'kinesiology'),
    ('KIN', '400', 'Athletic Training', 'Injury prevention.', 'undergraduate', 3, 'KIN 250', 'kinesiology'),
    ('KIN', '410', 'Motor Learning', 'Skill acquisition.', 'undergraduate', 3, 'KIN 300', 'kinesiology'),
    ('KIN', '420', 'Physical Therapy Principles', 'PT fundamentals.', 'undergraduate', 3, 'KIN 310', 'kinesiology'),
    ('KIN', '430', 'Sports Medicine', 'Medical aspects of sport.', 'undergraduate', 3, 'KIN 400', 'kinesiology'),
    ('KIN', '600', 'Graduate Kinesiology', 'Graduate-level KIN.', 'graduate', 3, None, 'kinesiology'),
    ('KIN', '700', 'Thesis', 'Graduate thesis research.', 'graduate', 6, None, 'kinesiology'),
]

NURS_COURSES = [
    ('NURS', '200', 'Introduction to Nursing', 'Nursing profession.', 'undergraduate', 3, None, 'nursing'),
    ('NURS', '300', 'Health Assessment', 'Patient assessment.', 'undergraduate', 4, 'NURS 200', 'nursing'),
    ('NURS', '310', 'Fundamentals of Nursing', 'Nursing fundamentals.', 'undergraduate', 4, 'NURS 200', 'nursing'),
    ('NURS', '320', 'Pharmacology', 'Drug therapy.', 'undergraduate', 3, 'NURS 310', 'nursing'),
    ('NURS', '330', 'Pathophysiology', 'Disease processes.', 'undergraduate', 3, 'NURS 310', 'nursing'),
    ('NURS', '400', 'Adult Health Nursing I', 'Adult patient care.', 'undergraduate', 6, 'NURS 330', 'nursing'),
    ('NURS', '401', 'Adult Health Nursing II', 'Complex adult care.', 'undergraduate', 6, 'NURS 400', 'nursing'),
    ('NURS', '410', 'Maternal-Child Nursing', 'Obstetric and pediatric care.', 'undergraduate', 6, 'NURS 330', 'nursing'),
    ('NURS', '420', 'Mental Health Nursing', 'Psychiatric nursing.', 'undergraduate', 6, 'NURS 330', 'nursing'),
    ('NURS', '430', 'Community Health Nursing', 'Public health nursing.', 'undergraduate', 6, 'NURS 400', 'nursing'),
    ('NURS', '440', 'Leadership in Nursing', 'Nursing management.', 'undergraduate', 3, 'NURS 400', 'nursing'),
    ('NURS', '450', 'Nursing Research', 'Evidence-based practice.', 'undergraduate', 3, 'NURS 400', 'nursing'),
    ('NURS', '600', 'Graduate Nursing', 'Graduate-level nursing.', 'graduate', 3, None, 'nursing'),
    ('NURS', '700', 'Thesis', 'Graduate thesis research.', 'graduate', 6, None, 'nursing'),
]

PH_COURSES = [
    ('PH', '200', 'Introduction to Public Health', 'Public health overview.', 'undergraduate', 3, None, 'public-health'),
    ('PH', '300', 'Epidemiology', 'Disease patterns.', 'undergraduate', 3, 'PH 200', 'public-health'),
    ('PH', '310', 'Biostatistics', 'Statistics for health.', 'undergraduate', 3, 'MATH 124', 'public-health'),
    ('PH', '320', 'Environmental Health', 'Environmental factors.', 'undergraduate', 3, 'PH 200', 'public-health'),
    ('PH', '330', 'Health Behavior', 'Behavioral health.', 'undergraduate', 3, 'PH 200', 'public-health'),
    ('PH', '340', 'Health Policy', 'Health care policy.', 'undergraduate', 3, 'PH 200', 'public-health'),
    ('PH', '350', 'Global Health', 'International health.', 'undergraduate', 3, 'PH 200', 'public-health'),
    ('PH', '400', 'Health Program Planning', 'Program development.', 'undergraduate', 3, 'PH 300', 'public-health'),
    ('PH', '410', 'Community Health', 'Community assessment.', 'undergraduate', 3, 'PH 300', 'public-health'),
    ('PH', '420', 'Health Communication', 'Health messaging.', 'undergraduate', 3, 'PH 330', 'public-health'),
    ('PH', '600', 'Graduate Public Health', 'Graduate-level PH.', 'graduate', 3, None, 'public-health'),
    ('PH', '700', 'Thesis', 'Graduate thesis research.', 'graduate', 6, None, 'public-health'),
]

# Combine business and health courses
BUSINESS_HEALTH_COURSES = (
    BUS_COURSES + ACCT_COURSES + ECON_COURSES + FIN_COURSES + 
    MGMT_COURSES + MKTG_COURSES + ISYS_COURSES + PSY_COURSES + 
    SOC_COURSES + SW_COURSES + CJ_COURSES + KIN_COURSES + 
    NURS_COURSES + PH_COURSES
)

