from flask import Blueprint, jsonify, request

from extensions import db
from models import Product, Order, ContactMessage
from security import admin_required

admin_bp = Blueprint("admin", __name__)

ORDER_STATUSES = [
    "Pending",
    "Confirmed",
    "Preparing",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
]


# ==========================================
# ORDER SERIALIZATION
# ==========================================


def order_to_dict(order):
    customer = order.customer

    return {
        "id": order.id,
        "customer_name": order.customer_name,
        "customer_email": customer.email if customer else None,
        "phone": order.phone,
        "address": order.address,
        "total_amount": order.total_amount,
        "status": order.status,
        "created_at": (order.created_at.isoformat() if order.created_at else None),
        "items": [
            {
                "id": item.id,
                "product_id": item.product_id,
                "product_name": item.product_name,
                "product_image": item.product_image,
                "price": item.price,
                "quantity": item.quantity,
                "subtotal": item.price * item.quantity,
            }
            for item in order.items
        ],
    }


# ==========================================
# DASHBOARD SUMMARY
# ==========================================


@admin_bp.get("/summary")
@admin_required
def summary():
    products_count = Product.query.count()
    orders = Order.query.all()

    orders_count = len(orders)

    # Count delivered orders as completed revenue
    revenue = sum(order.total_amount for order in orders if order.status == "Delivered")

    pending_orders = sum(1 for order in orders if order.status == "Pending")

    return jsonify(
        {
            "products": products_count,
            "orders": orders_count,
            "revenue": round(revenue, 2),
            "pending_orders": pending_orders,
        }
    )


# ==========================================
# GET ALL PRODUCTS
# ==========================================


@admin_bp.get("/products")
@admin_required
def get_admin_products():
    products = Product.query.order_by(Product.id.desc()).all()

    items = [
        {
            "id": p.id,
            "name": p.name,
            "description": p.description,
            "price": p.price,
            "category": p.category,
            "image": p.image,
            "rating": p.rating,
            "time": p.time,
            "tag": p.tag,
        }
        for p in products
    ]

    return jsonify({"items": items})


# ==========================================
# ADD PRODUCT
# ==========================================


@admin_bp.post("/products")
@admin_required
def add_product():
    data = request.get_json(silent=True) or {}

    required_fields = [
        "name",
        "description",
        "price",
        "category",
        "image",
        "time",
    ]

    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"{field} is required"}), 400

    try:
        price = float(data["price"])
        rating = float(data.get("rating", 0))

        if price <= 0 or rating < 0 or rating > 5:
            return jsonify({"error": "Invalid price or rating"}), 400

    except (ValueError, TypeError):
        return jsonify({"error": "Price and rating must be numbers"}), 400

    product = Product(
        name=data["name"].strip(),
        description=data["description"].strip(),
        price=price,
        category=data["category"].strip(),
        image=data["image"].strip(),
        rating=rating,
        time=data["time"].strip(),
        tag=data.get("tag", "").strip() or None,
    )

    try:
        db.session.add(product)
        db.session.commit()

        return (
            jsonify(
                {
                    "message": "Product added successfully",
                    "id": product.id,
                }
            ),
            201,
        )

    except Exception:
        db.session.rollback()
        return jsonify({"error": "Unable to add product"}), 500


# ==========================================
# UPDATE PRODUCT
# ==========================================


@admin_bp.put("/products/<int:product_id>")
@admin_required
def update_product(product_id):
    product = db.session.get(Product, product_id)

    if not product:
        return jsonify({"error": "Product not found"}), 404

    data = request.get_json(silent=True) or {}

    required_fields = [
        "name",
        "description",
        "price",
        "category",
        "image",
        "time",
    ]

    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"{field} is required"}), 400

    try:
        price = float(data["price"])
        rating = float(data.get("rating", 0))

        if price <= 0 or rating < 0 or rating > 5:
            return jsonify({"error": "Invalid price or rating"}), 400

    except (ValueError, TypeError):
        return jsonify({"error": "Price and rating must be numbers"}), 400

    product.name = data["name"].strip()
    product.description = data["description"].strip()
    product.price = price
    product.category = data["category"].strip()
    product.image = data["image"].strip()
    product.rating = rating
    product.time = data["time"].strip()
    product.tag = data.get("tag", "").strip() or None

    try:
        db.session.commit()

        return jsonify({"message": "Product updated successfully"})

    except Exception:
        db.session.rollback()
        return jsonify({"error": "Unable to update product"}), 500


# ==========================================
# DELETE PRODUCT
# ==========================================


@admin_bp.delete("/products/<int:product_id>")
@admin_required
def delete_product(product_id):
    product = db.session.get(Product, product_id)

    if not product:
        return jsonify({"error": "Product not found"}), 404

    try:
        db.session.delete(product)
        db.session.commit()

        return jsonify({"message": "Product deleted successfully"})

    except Exception:
        db.session.rollback()

        return (
            jsonify(
                {
                    "error": (
                        "Unable to delete product. "
                        "It may be linked to existing orders."
                    )
                }
            ),
            409,
        )


# ==========================================
# GET ALL CUSTOMER ORDERS
# ==========================================


@admin_bp.get("/orders")
@admin_required
def get_admin_orders():
    orders = Order.query.order_by(Order.created_at.desc()).all()

    return jsonify(
        {
            "message": "Orders fetched successfully",
            "items": [order_to_dict(order) for order in orders],
            "statuses": ORDER_STATUSES,
        }
    )


# ==========================================
# UPDATE ORDER STATUS
# ==========================================


@admin_bp.put("/orders/<int:order_id>/status")
@admin_required
def update_order_status(order_id):
    order = db.session.get(Order, order_id)

    if not order:
        return jsonify({"error": "Order not found"}), 404

    data = request.get_json(silent=True) or {}
    new_status = (data.get("status") or "").strip()

    if new_status not in ORDER_STATUSES:
        return (
            jsonify(
                {
                    "error": "Invalid order status",
                    "allowed_statuses": ORDER_STATUSES,
                }
            ),
            400,
        )

    order.status = new_status

    try:
        db.session.commit()

        return jsonify(
            {
                "message": "Order status updated successfully",
                "order": order_to_dict(order),
            }
        )

    except Exception:
        db.session.rollback()
        return jsonify({"error": "Unable to update order status"}), 500


# ==========================================
# CONTACT MESSAGES
# ==========================================


# GET ALL CONTACT MESSAGES
@admin_bp.get("/messages")
@admin_required
def get_contact_messages():

    messages = ContactMessage.query.order_by(ContactMessage.created_at.desc()).all()

    items = [
        {
            "id": message.id,
            "name": message.name,
            "email": message.email,
            "message": message.message,
            "is_read": message.is_read,
            "created_at": (
                message.created_at.isoformat() if message.created_at else None
            ),
        }
        for message in messages
    ]

    return jsonify(
        {
            "message": "Contact messages fetched successfully",
            "items": items,
            "total": len(items),
            "unread": sum(1 for message in messages if not message.is_read),
        }
    )


# MARK MESSAGE AS READ
@admin_bp.patch("/messages/<int:message_id>/read")
@admin_required
def mark_message_as_read(message_id):

    message = db.session.get(ContactMessage, message_id)

    if not message:
        return jsonify({"error": "Message not found"}), 404

    message.is_read = True

    try:
        db.session.commit()

        return jsonify({"message": "Message marked as read successfully"})

    except Exception:
        db.session.rollback()
        return jsonify({"error": "Unable to update message"}), 500


# DELETE CONTACT MESSAGE
@admin_bp.delete("/messages/<int:message_id>")
@admin_required
def delete_contact_message(message_id):

    message = db.session.get(ContactMessage, message_id)

    if not message:
        return jsonify({"error": "Message not found"}), 404

    try:
        db.session.delete(message)
        db.session.commit()

        return jsonify({"message": "Contact message deleted successfully"})

    except Exception:
        db.session.rollback()
        return jsonify({"error": "Unable to delete message"}), 500
