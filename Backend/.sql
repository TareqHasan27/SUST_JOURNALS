CREATE TABLE users (
    reg_no VARCHAR(20) PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('student', 'faculty', 'external', 'admin') NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    isVerified TINYINT(1) DEFAULT NULL,
    verificationToken VARCHAR(64) DEFAULT NULL,
    reset_token VARCHAR(6) DEFAULT NULL
);

CREATE TABLE departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    short_code VARCHAR(50) UNIQUE
);

CREATE TABLE user_profiles (
    reg_no VARCHAR(20) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    university VARCHAR(255) NOT NULL,
    department_id INT,
    profile_url VARCHAR(255),
    bio TEXT,
    google_scholar_id VARCHAR(255),
    orcid_id VARCHAR(50),
    FOREIGN KEY (reg_no) REFERENCES users(reg_no),
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE user_research_interests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reg_no VARCHAR(20),
    interest VARCHAR(255),
    FOREIGN KEY (reg_no) REFERENCES users(reg_no)
);
