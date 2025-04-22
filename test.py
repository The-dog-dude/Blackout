import sqlite3

conn = sqlite3.connect(":memory:")
cursor = conn.cursor()

with open("test.sql", "r") as f:
    cursor.executescript(f.read())

password = input("Enter your password: ")

cursor.execute("SELECT username FROM users WHERE password = ?", (password,))
row = cursor.fetchone()

if row:
    print(f"Welcome, {row[0]}!")
else:
    print("Password not recognized.")

conn.close()
