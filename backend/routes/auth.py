from flask import Blueprint, jsonify, request, session
from werkzeug.security import generate_password_hash, check_password_hash

from extensions import db
from models import User

auth_bp = Blueprint("auth", __name__)


# ==========================================
# COMMON AUTHENTICATION HELPER
# ==========================================


def get_logged_in_user():
    user_id = session.get("user_id")

    if not user_id:
        return None

    return db.session.get(User, user_id)


def user_to_dict(user):
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "phone": user.phone,
        "address": user.address,
    }


# ==========================================
# CUSTOMER REGISTER
# ==========================================


@auth_bp.post("/register")
def register():
    data = request.get_json(silent=True) or {}

    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not name or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    if len(password) < 8:
        return jsonify({"error": "Password must contain at least 8 characters"}), 400

    if "@" not in email:
        return jsonify({"error": "Please enter a valid email"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email is already registered"}), 409

    new_user = User(
        name=name,
        email=email,
        password=generate_password_hash(password),
        is_admin=False,
    )

    try:
        db.session.add(new_user)
        db.session.commit()

        return (
            jsonify(
                {"message": "Registration successful", "user": user_to_dict(new_user)}
            ),
            201,
        )

    except Exception:
        db.session.rollback()
        return jsonify({"error": "Registration failed"}), 500


# ==========================================
# CUSTOMER LOGIN
# ==========================================


@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}

    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid email or password"}), 401

    session.clear()
    session["user_id"] = user.id

    return jsonify({"message": "Login successful", "user": user_to_dict(user)})


# ==========================================
# CURRENT CUSTOMER
# ==========================================


@auth_bp.get("/me")
def current_user():
    user = get_logged_in_user()

    if not user:
        session.clear()
        return jsonify({"error": "Not logged in"}), 401

    return jsonify({"user": user_to_dict(user)})


# ==========================================
# CUSTOMER LOGOUT
# ==========================================


@auth_bp.post("/logout")
def logout():
    session.clear()
    return jsonify({"message": "Logged out successfully"})


# ==========================================
# GET CUSTOMER PROFILE
# ==========================================


@auth_bp.get("/profile")
def get_profile():
    user = get_logged_in_user()

    if not user:
        return jsonify({"error": "Please login first"}), 401

    return jsonify({"user": user_to_dict(user)})


# ==========================================
# UPDATE CUSTOMER PROFILE
# ==========================================


@auth_bp.put("/profile")
def update_profile():
    user = get_logged_in_user()

    if not user:
        return jsonify({"error": "Please login first"}), 401

    data = request.get_json(silent=True) or {}

    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    phone = (data.get("phone") or "").strip()
    address = (data.get("address") or "").strip()

    if not name or not email:
        return jsonify({"error": "Name and email are required"}), 400

    if "@" not in email:
        return jsonify({"error": "Invalid email address"}), 400

    existing_user = User.query.filter(User.email == email, User.id != user.id).first()

    if existing_user:
        return jsonify({"error": "This email is already registered"}), 409

    user.name = name
    user.email = email
    user.phone = phone
    user.address = address

    try:
        db.session.commit()

        return jsonify(
            {"message": "Profile updated successfully", "user": user_to_dict(user)}
        )

    except Exception:
        db.session.rollback()
        return jsonify({"error": "Profile update failed"}), 500


# ==========================================
# CHANGE CUSTOMER PASSWORD
# ==========================================


@auth_bp.post("/change-password")
def change_password():
    user = get_logged_in_user()

    if not user:
        return jsonify({"error": "Please login first"}), 401

    data = request.get_json(silent=True) or {}

    current_password = data.get("current_password") or ""
    new_password = data.get("new_password") or ""

    if not current_password or not new_password:
        return jsonify({"error": "Current password and new password are required"}), 400

    if not check_password_hash(user.password, current_password):
        return jsonify({"error": "Current password is incorrect"}), 400

    if len(new_password) < 8:
        return (
            jsonify({"error": "New password must contain at least 8 characters"}),
            400,
        )

    user.password = generate_password_hash(new_password)

    try:
        db.session.commit()
        return jsonify({"message": "Password changed successfully"})

    except Exception:
        db.session.rollback()
        return jsonify({"error": "Unable to change password"}), 500


# ==========================================
# ADMIN LOGIN
# ==========================================


@auth_bp.post("/admin-login")
def admin_login():
    data = request.get_json(silent=True) or {}

    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid email or password"}), 401

    if not user.is_admin:
        return jsonify({"error": "You are not authorized as an admin"}), 403

    session.clear()
    session["user_id"] = user.id

    return jsonify(
        {
            "message": "Admin login successful",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "is_admin": True,
            },
        }
    )


# ==========================================
# VERIFY ADMIN SESSION
# ==========================================


@auth_bp.get("/admin-me")
def admin_me():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error": "Admin login required"}), 401

    user = db.session.get(User, user_id)

    if not user or not user.is_admin:
        session.clear()
        return jsonify({"error": "Admin access denied"}), 403

    return jsonify(
        {
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "is_admin": True,
            }
        }
    )


# ==========================================
# ADMIN LOGOUT
# ==========================================


@auth_bp.post("/admin-logout")
def admin_logout():
    session.clear()

    return jsonify({"message": "Admin logged out successfully"})
