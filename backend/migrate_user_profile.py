from sqlalchemy import inspect, text
from app import app, db

with app.app_context():
    inspector = inspect(db.engine)

    columns = [column["name"] for column in inspector.get_columns("users")]

    with db.engine.begin() as connection:

        if "phone" not in columns:
            connection.execute(text("ALTER TABLE users ADD COLUMN phone VARCHAR(20)"))

        if "address" not in columns:
            connection.execute(text("ALTER TABLE users ADD COLUMN address TEXT"))

    print("User profile database migration completed!")
