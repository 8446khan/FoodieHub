from flask import Blueprint, request, jsonify
from extensions import db
from models import ContactMessage
from datetime import datetime
import traceback

contact_bp = Blueprint("contact", __name__)


@contact_bp.route("", methods=["POST"])
def submit_contact_message():
    try:
        data = request.get_json(silent=True) or {}

        name = data.get("name", "").strip()
        email = data.get("email", "").strip().lower()
        message = data.get("message", "").strip()

        # Validate required fields
        if not name or not email or not message:
            return jsonify({"error": "Name, email and message are required."}), 400

        # Validate field lengths
        if len(name) > 100:
            return jsonify({"error": "Name is too long."}), 400

        if len(email) > 120:
            return jsonify({"error": "Email is too long."}), 400

        if len(message) > 2000:
            return jsonify({"error": "Message cannot exceed 2000 characters."}), 400

        # Basic email format validation
        if "@" not in email or "." not in email.split("@")[-1]:
            return jsonify({"error": "Please enter a valid email address."}), 400

        # Create contact message
        new_message = ContactMessage(
            name=name,
            email=email,
            message=message,
            is_read=False,
            created_at=datetime.utcnow(),
        )

        db.session.add(new_message)
        db.session.commit()

        return (
            jsonify(
                {
                    "success": True,
                    "message": "Your message has been submitted successfully.",
                    "contact_id": new_message.id,
                }
            ),
            201,
        )

    except Exception as e:
        db.session.rollback()

        print("CONTACT FORM ERROR:")
        traceback.print_exc()

        return jsonify({"error": str(e)}), 500
