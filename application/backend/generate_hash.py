#!/usr/bin/env python3
"""
Bcrypt Password Hash Generator
Quick utility to generate password hashes for seed data
"""
import bcrypt
import sys

def generate_hash(password: str) -> str:
    """Generate bcrypt hash for a password."""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

if __name__ == "__main__":
    if len(sys.argv) > 1:
        password = sys.argv[1]
        print(f"Password: {password}")
        print(f"Hash: {generate_hash(password)}")
    else:
        # Default: generate hash for "password123"
        password = "password123"
        hash_value = generate_hash(password)
        print(f"Generated bcrypt hash for '{password}':")
        print(hash_value)
        print("\nTo generate a hash for a custom password:")
        print("  python generate_hash.py 'your_password_here'")

