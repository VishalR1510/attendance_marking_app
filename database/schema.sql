-- ============================================
-- Attendance Marker System - Database Schema
-- Database: attendance_system
-- ============================================

-- Step 1: Create the database (run this separately in psql)
-- CREATE DATABASE attendance_system;

-- Step 2: Connect to the database and run the following

-- ============================================
-- Table: teachers
-- Stores teacher login credentials
-- ============================================
CREATE TABLE IF NOT EXISTS teachers (
    teacher_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- ============================================
-- Table: students
-- Stores student information
-- ============================================
CREATE TABLE IF NOT EXISTS students (
    student_id SERIAL PRIMARY KEY,
    roll_number VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    email VARCHAR(100)
);

-- ============================================
-- Table: attendance
-- Stores daily attendance records
-- ============================================
CREATE TABLE IF NOT EXISTS attendance (
    attendance_id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(student_id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status VARCHAR(10) NOT NULL CHECK (status IN ('Present', 'Absent')),
    UNIQUE(student_id, date)  -- Prevent duplicate attendance for same student on same date
);

-- ============================================
-- Insert default admin teacher
-- Username: admin | Password: admin123
-- ============================================
INSERT INTO teachers (username, password)
VALUES ('admin', 'admin123')
ON CONFLICT (username) DO NOTHING;

-- ============================================
-- Insert sample students
-- ============================================
INSERT INTO students (roll_number, name, department, year, email)
VALUES
    ('101', 'John Doe', 'CSE', 2, 'john.doe@college.edu'),
    ('102', 'Jane Smith', 'IT', 3, 'jane.smith@college.edu'),
    ('103', 'Alex Johnson', 'ECE', 1, 'alex.johnson@college.edu')
ON CONFLICT (roll_number) DO NOTHING;
