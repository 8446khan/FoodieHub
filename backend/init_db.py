from app import app, db
from models import Product

sample_products = [
    {
        "name": "Margherita Pizza",
        "description": "Classic pizza topped with fresh mozzarella and basil.",
        "price": 299,
        "category": "Pizza",
        "image": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600",
        "rating": 4.8,
        "time": "20 min",
        "tag": "Popular",
    },
    {
        "name": "Classic Veg Burger",
        "description": "Crispy vegetable patty with fresh lettuce and cheese.",
        "price": 149,
        "category": "Burger",
        "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600",
        "rating": 4.6,
        "time": "15 min",
        "tag": "Bestseller",
    },
    {
        "name": "White Sauce Pasta",
        "description": "Creamy pasta prepared with herbs and fresh vegetables.",
        "price": 249,
        "category": "Pasta",
        "image": "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600",
        "rating": 4.7,
        "time": "20 min",
        "tag": "Chef's choice",
    },
    {
        "name": "French Fries",
        "description": "Golden and crispy fries served with a tasty dip.",
        "price": 99,
        "category": "Sides",
        "image": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600",
        "rating": 4.5,
        "time": "10 min",
        "tag": "Popular",
    },
    {
        "name": "Chocolate Brownie",
        "description": "Rich chocolate brownie with a soft, fudgy center.",
        "price": 129,
        "category": "Dessert",
        "image": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600",
        "rating": 4.9,
        "time": "10 min",
        "tag": "Sweet treat",
    },
    {
        "name": "Fresh Lemonade",
        "description": "Refreshing lemonade made with fresh lemons.",
        "price": 79,
        "category": "Drinks",
        "image": "https://images.unsplash.com/photo-1513558161293-cdaf765edfd4?w=600",
        "rating": 4.4,
        "time": "5 min",
        "tag": "Refreshing",
    },
]

with app.app_context():
    db.create_all()

    if Product.query.count() == 0:
        for item in sample_products:
            product = Product(**item)
            db.session.add(product)

        db.session.commit()
        print("Six sample products added successfully!")
    else:
        print("Products already exist. No duplicate data added.")
