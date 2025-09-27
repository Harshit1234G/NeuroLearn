students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    scholar_no TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    class TEXT,
    section TEXT,
    password TEXT
);

parents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    student_scholar_no TEXT NOT NULL,
    password TEXT,
    FOREIGN KEY (student_scholar_no) REFERENCES students(scholar_no) ON DELETE CASCADE
);

teachers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    teacher_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    subject TEXT,
    email TEXT,
    password TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

student_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_scholar_no TEXT NOT NULL,
    topic TEXT NOT NULL,
    accuracy REAL NOT NULL, -- eg 85.5, 99.9
    attempted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_scholar_no) REFERENCES students(scholar_no)
);
