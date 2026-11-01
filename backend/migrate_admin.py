from sqlalchemy import inspect, text
from app import app, db

with app.app_context():
    db.create_all()

    columns = {column["name"] for column in inspect(db.engine).get_columns("users")}

    if "is_admin" not in columns:
        db.session.execute(
            text("ALTER TABLE users " "ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT 0")
        )
        db.session.commit()
        print("Admin role column added successfully.")
    else:
        print("Admin role column already exists.")

    print("Database migration completed.")
