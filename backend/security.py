from functools import wraps

from flask import jsonify, session
from extensions import db
from models import User


def admin_required(view_function):
    @wraps(view_function)
    def decorated_function(*args, **kwargs):
        user_id = session.get("user_id")

        if not user_id:
            return jsonify({"error": "Admin login required"}), 401

        user = db.session.get(User, user_id)

        if not user or not user.is_admin:
            return jsonify({"error": "Admin access denied"}), 403

        return view_function(*args, **kwargs)

    return decorated_function
