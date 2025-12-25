"""
Mock data for testing when database is not available.
"""

MOCK_SUBJECTS = [
    {"name": "Computer Science", "slug": "computer-science"},
    {"name": "Mathematics", "slug": "mathematics"},
    {"name": "Physics", "slug": "physics"},
    {"name": "Chemistry", "slug": "chemistry"},
    {"name": "Biology", "slug": "biology"},
]

MOCK_TUTORS = [
    {
        "user_id": 1,
        "first_name": "Alex",
        "last_name": "Johnson",
        "bio": "Senior CS major with 3 years of tutoring experience. Specializing in algorithms, data structures, and web development. Former TA for CSC 648.",
        "major": "Computer Science",
        "courses": [
            {"code": "CSC 648", "title": "Software Engineering"},
            {"code": "CSC 413", "title": "Software Development"},
            {"code": "CSC 340", "title": "Programming Methodology"},
        ],
        "subjects": ["Computer Science"],
        "avg_rating": 4.8,
        "review_count": 24
    },
    {
        "user_id": 2,
        "first_name": "Maria",
        "last_name": "Garcia",
        "bio": "Mathematics graduate student passionate about helping students understand calculus and linear algebra. Patient and thorough teaching style.",
        "major": "Mathematics",
        "courses": [
            {"code": "MATH 226", "title": "Calculus I"},
            {"code": "MATH 227", "title": "Calculus II"},
            {"code": "MATH 245", "title": "Linear Algebra"},
        ],
        "subjects": ["Mathematics"],
        "avg_rating": 4.9,
        "review_count": 31
    },
    {
        "user_id": 3,
        "first_name": "David",
        "last_name": "Chen",
        "bio": "Physics major with a love for teaching. Experienced in mechanics, electromagnetism, and quantum physics. Available for both online and in-person sessions.",
        "major": "Physics",
        "courses": [
            {"code": "PHYS 220", "title": "General Physics I"},
            {"code": "PHYS 222", "title": "General Physics II"},
        ],
        "subjects": ["Physics"],
        "avg_rating": 4.7,
        "review_count": 18
    },
    {
        "user_id": 4,
        "first_name": "Sarah",
        "last_name": "Williams",
        "bio": "Computer Science and Math double major. Strong background in Python, Java, and discrete mathematics. Great at breaking down complex concepts.",
        "major": "Computer Science / Mathematics",
        "courses": [
            {"code": "CSC 220", "title": "Data Structures"},
            {"code": "CSC 317", "title": "Database Systems"},
            {"code": "MATH 301", "title": "Discrete Mathematics"},
        ],
        "subjects": ["Computer Science", "Mathematics"],
        "avg_rating": 4.9,
        "review_count": 42
    },
    {
        "user_id": 5,
        "first_name": "James",
        "last_name": "Taylor",
        "bio": "Chemistry PhD candidate. Specializing in organic chemistry and biochemistry. Helping students prepare for exams and understand lab work.",
        "major": "Chemistry",
        "courses": [
            {"code": "CHEM 115", "title": "General Chemistry"},
            {"code": "CHEM 230", "title": "Organic Chemistry I"},
        ],
        "subjects": ["Chemistry"],
        "avg_rating": 4.6,
        "review_count": 15
    },
]

