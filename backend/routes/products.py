from flask import Blueprint, jsonify
from models import Product

products_bp = Blueprint("products", __name__)


@products_bp.get("/")
def list_products():
    products = Product.query.all()

    items = []

    for product in products:
        items.append(
            {
                "id": product.id,
                "name": product.name,
                "description": product.description,
                "price": product.price,
                "category": product.category,
                "image": product.image,
                "rating": product.rating,
                "time": product.time,
                "tag": product.tag,
            }
        )

    return jsonify({"message": "Products fetched successfully", "items": items})
