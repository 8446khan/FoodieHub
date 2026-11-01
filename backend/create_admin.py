from getpass import getpass

from werkzeug.security import generate_password_hash

from app import app, db
from models import User

with app.app_context():
    print("\n--- FoodieHub Admin Account Setup ---")

    name = input("Enter admin name: ").strip()
    email = input("Enter admin email: ").strip().lower()
    password = getpass("Enter admin password: ")
    confirm_password = getpass("Confirm admin password: ")

    if not name or not email or not password:
        print("Error: All fields are required.")
        raise SystemExit

    if len(password) < 8:
        print("Error: Password must contain at least 8 characters.")
        raise SystemExit

    if password != confirm_password:
        print("Error: Passwords do not match.")
        raise SystemExit

    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        print("Error: This email already exists.")
        print("No account was changed.")
        raise SystemExit

    admin = User(
        name=name, email=email, password=generate_password_hash(password), is_admin=True
    )

    try:
        db.session.add(admin)
        db.session.commit()
        print("\nAdmin account created successfully!")
        print("Email:", admin.email)
    except Exception as error:
        db.session.rollback()
        print("Failed to create admin account:", error)
