# ============================================
# schemas.py
# Pydantic models for request/response validation
# ============================================

from pydantic import BaseModel
from typing import Optional, List


class TeacherLogin(BaseModel):
    """Schema for teacher login request"""
    username: str
    password: str


class StudentCreate(BaseModel):
    """Schema for creating a new student"""
    roll_number: str
    name: str
    department: str
    year: int
    email: Optional[str] = None


class StudentResponse(BaseModel):
    """Schema for student response"""
    student_id: int
    roll_number: str
    name: str
    department: str
    year: int
    email: Optional[str] = None


class AttendanceRecord(BaseModel):
    """Schema for a single attendance record"""
    student_id: int
    status: str  # 'Present' or 'Absent'


class AttendanceSubmit(BaseModel):
    """Schema for submitting attendance for multiple students"""
    date: str  # Format: YYYY-MM-DD
    records: List[AttendanceRecord]
