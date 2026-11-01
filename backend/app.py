from flask import Flask, jsonify
from flask_cors import CORS
from extensions import db
import os
import models
from routes.products import products_bp
from routes.orders import orders_bp
from routes.auth import auth_bp
from routes.admin import admin_bp
import models
from routes.contact import contact_bp


def create_app():
    app = Flask(__name__)

    app.config["SECRET_KEY"] = os.environ.get(
        "SECRET_KEY", "foodiehub-development-secret-change-before-deployment"
    )

    app.config["SESSION_COOKIE_HTTPONLY"] = True
    app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
    app.config["SESSION_COOKIE_SECURE"] = False
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///foodiehub.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    CORS(
        app,
        resources={r"/api/*": {"origins": ["http://localhost:5173"]}},
        supports_credentials=True,
    )

    db.init_app(app)

    app.register_blueprint(products_bp, url_prefix="/api/products")
    app.register_blueprint(orders_bp, url_prefix="/api/orders")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    app.register_blueprint(contact_bp, url_prefix="/api/contact")

    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok", "message": "FoodieHub API is running"})

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5000)
