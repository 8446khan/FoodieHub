from flask import Flask, jsonify
from flask_cors import CORS
from extensions import db
import os
from dotenv import load_dotenv
import models

from routes.products import products_bp
from routes.orders import orders_bp
from routes.auth import auth_bp
from routes.admin import admin_bp
from routes.contact import contact_bp

load_dotenv()


def create_app():
    app = Flask(__name__)

    # Secret key
    app.config["SECRET_KEY"] = os.environ.get(
        "SECRET_KEY", "foodiehub-local-development-secret"
    )

    # Session configuration
    is_production = os.environ.get("FLASK_ENV") == "production"

    app.config["SESSION_COOKIE_HTTPONLY"] = True
    app.config["SESSION_COOKIE_SECURE"] = is_production
    app.config["SESSION_COOKIE_SAMESITE"] = "None" if is_production else "Lax"

    # Database configuration
    database_url = os.environ.get("DATABASE_URL", "sqlite:///foodiehub.db")

    # Render PostgreSQL URL compatibility
    if database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://", 1)

    app.config["SQLALCHEMY_DATABASE_URI"] = database_url
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # CORS configuration
    frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:5173")

    allowed_origins = [
        origin.strip() for origin in frontend_url.split(",") if origin.strip()
    ]

    if "http://localhost:5173" not in allowed_origins:
        allowed_origins.append("http://localhost:5173")

    CORS(
        app,
        resources={r"/api/*": {"origins": allowed_origins}},
        supports_credentials=True,
    )

    # Initialize database
    db.init_app(app)

    # Create database tables
    with app.app_context():
        db.create_all()

    # Register blueprints
    app.register_blueprint(products_bp, url_prefix="/api/products")
    app.register_blueprint(orders_bp, url_prefix="/api/orders")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    app.register_blueprint(contact_bp, url_prefix="/api/contact")

    # Home route
    @app.route("/")
    def home():
        return jsonify({"message": "FoodieHub API is running", "status": "success"})

    # Health route
    @app.route("/api/health")
    def health():
        return jsonify({"status": "ok", "message": "FoodieHub API is running"})

    # Temporary diagnostic route
    @app.route("/api/routes")
    def show_routes():
        return jsonify(
            [
                {
                    "endpoint": rule.endpoint,
                    "path": rule.rule,
                    "methods": list(rule.methods),
                }
                for rule in app.url_map.iter_rules()
            ]
        )

    return app


app = create_app()


if __name__ == "__main__":
    app.run(debug=True, port=5000)
