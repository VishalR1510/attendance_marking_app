# ============================================
# database.py
# PostgreSQL database connection helper
# ============================================

import psycopg2
from config import DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD


def get_connection():
    """
    Create and return a new PostgreSQL database connection.
    Returns a psycopg2 connection object.
    Raises an exception if connection fails.
    """
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        return conn
    except psycopg2.Error as e:
        print(f"Database connection error: {e}")
        raise e
