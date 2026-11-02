from flask import Blueprint, jsonify, request, session
from extensions import db
from models import Order, OrderItem, Product, User
from datetime import timezone
import traceback

orders_bp = Blueprint("orders", __name__)


def order_to_dict(order):
    created_at = order.created_at

    if created_at and created_at.tzinfo is None:
        created_at = created_at.replace(tzinfo=timezone.utc)

    return {
        "id": order.id,
        "customer_name": order.customer_name,
        "phone": order.phone,
        "address": order.address,
        "total_amount": order.total_amount,
        "status": order.status,
        "created_at": created_at.isoformat() if created_at else None,
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


def get_logged_in_user():
    user_id = session.get("user_id")

    if not user_id:
        return None

    return db.session.get(User, user_id)


@orders_bp.post("/")
def create_order():
    user = get_logged_in_user()

    if not user:
        return jsonify({"error": "Please login to place an order"}), 401

    payload = request.get_json(silent=True) or {}

    customer_name = (payload.get("customer_name") or "").strip()
    phone = (payload.get("phone") or "").strip()
    address = (payload.get("address") or "").strip()
    items = payload.get("items")

    if not customer_name or not phone or not address or not items:
        return (
            jsonify({"error": "Customer name, phone, address and items are required"}),
            400,
        )

    if not isinstance(items, list):
        return jsonify({"error": "Items must be a list"}), 400

    order_items = []
    total_amount = 0

    for item in items:
        if not isinstance(item, dict):
            return jsonify({"error": "Invalid item format"}), 400

        try:
            product_id = int(item.get("product_id", item.get("id")))
            quantity = int(item.get("quantity"))
        except (TypeError, ValueError):
            return jsonify({"error": "Invalid product ID or quantity"}), 400

        if quantity < 1 or quantity > 100:
            return jsonify({"error": "Quantity must be between 1 and 100"}), 400

        product = db.session.get(Product, product_id)

        if not product:
            return (
                jsonify({"error": f"Product with ID {product_id} was not found"}),
                404,
            )

        subtotal = product.price * quantity
        total_amount += subtotal

        order_items.append(
            {
                "product": product,
                "quantity": quantity,
            }
        )

    new_order = Order(
        user_id=user.id,
        customer_name=customer_name,
        phone=phone,
        address=address,
        total_amount=total_amount,
        status="Pending",
    )

    try:
        db.session.add(new_order)
        db.session.flush()

        for item in order_items:
            product = item["product"]

            order_item = OrderItem(
                order_id=new_order.id,
                product_id=product.id,
                product_name=product.name,
                product_image=product.image,
                price=product.price,
                quantity=item["quantity"],
            )

            db.session.add(order_item)

        db.session.commit()

        return (
            jsonify(
                {
                    "message": "Order placed successfully",
                    "order": order_to_dict(new_order),
                }
            ),
            201,
        )

    except Exception:
        db.session.rollback()
        traceback.print_exc()

        return jsonify({"error": "Unable to place order"}), 500


@orders_bp.get("/")
def list_orders():
    user = get_logged_in_user()

    if not user:
        return jsonify({"error": "Please login to view your orders"}), 401

    orders = (
        Order.query.filter_by(user_id=user.id).order_by(Order.created_at.desc()).all()
    )

    return (
        jsonify(
            {
                "message": "Orders fetched successfully",
                "items": [order_to_dict(order) for order in orders],
            }
        ),
        200,
    )


@orders_bp.get("/<int:order_id>")
def get_order(order_id):
    user = get_logged_in_user()

    if not user:
        return jsonify({"error": "Please login to track your order"}), 401

    order = Order.query.filter_by(id=order_id, user_id=user.id).first()

    if not order:
        return jsonify({"error": "Order not found"}), 404

    return (
        jsonify(
            {
                "message": "Order details fetched successfully",
                "order": order_to_dict(order),
            }
        ),
        200,
    )
