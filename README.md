# 🍔 FoodieHub – Full Stack Restaurant Website

**Good Food. Great Mood.**

FoodieHub is a modern, responsive, full-stack restaurant web application designed to provide customers with a smooth and convenient online food-ordering experience. It includes a customer-facing website and a dedicated admin dashboard for managing restaurant operations.

The application allows customers to explore food items, manage their shopping cart, create accounts, and place orders, while administrators can manage products, orders, and customer messages.

---

## 🚀 Features

### 👨‍🍳 Customer Portal

- Modern and responsive homepage.
- Browse food items and categories.
- View individual product details.
- Add products to the shopping cart.
- Update product quantities and manage cart items.
- Checkout and place food orders.
- Customer registration and login.
- Contact form for customer inquiries.
- Dedicated About Us page.

### 🔐 Admin Dashboard

- Secure admin authentication.
- Dashboard with restaurant statistics.
- View and manage food products.
- Add, update, and delete menu items.
- View customer orders.
- Update order statuses.
- View customer contact messages.
- Mark messages as read or delete them.
- Separate admin and customer interfaces.

### 🎨 UI & User Experience

- Dark-themed restaurant interface.
- Modern design with yellow accent colors.
- Responsive layouts for desktop and mobile.
- Interactive navigation and components.
- Dedicated login and registration pages.

---

## 🛠️ Technology Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, JavaScript |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Routing | React Router DOM |
| Backend | Python, Flask |
| Database | SQLite |
| ORM | Flask-SQLAlchemy |
| API | REST API |
| Authentication | Session-based authentication |

---

## 📁 Project Structure

```text
FoodieHub/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── Home.jsx
│   │   │   ├── Menu.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── routes/
│   │   ├── products.py
│   │   ├── orders.py
│   │   ├── auth.py
│   │   ├── admin.py
│   │   └── contact.py
│   ├── instance/
│   │   └── foodiehub.db
│   ├── models.py
│   ├── extensions.py
│   ├── security.py
│   ├── app.py
│   └── requirements.txt
│
└── README.md
```

*The structure above is a representative overview; your local project may contain additional files.*

---

## ⚙️ Installation & Setup

Follow these steps to run FoodieHub locally.


### 2. Setup Frontend

Open a terminal and run:

```bash
cd frontend
npm install
npm run dev
```

Frontend development server:

```text
http://localhost:5173
```

### 3. Setup Backend

Open another terminal:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the Flask server:

```bash
python app.py
```

Backend server:

```text
http://127.0.0.1:5000
```

### 4. Database Setup

FoodieHub uses SQLite with Flask-SQLAlchemy.

Ensure your database tables are created before using the application. Configure the admin account using the project's private admin creation script.

Do not commit your database, admin credentials, or secret keys to GitHub.

---

## 🔗 API Overview

The backend exposes REST API endpoints for the main application features.

| Module | Endpoint | Method |
|---|---|---|
| Health | `/api/health` | GET |
| Products | `/api/products` | GET |
| Orders | `/api/orders` | GET / POST |
| Authentication | `/api/auth/admin-login` | POST |
| Admin session | `/api/auth/admin-me` | GET |
| Admin logout | `/api/auth/admin-logout` | POST |
| Admin summary | `/api/admin/summary` | GET |
| Admin products | `/api/admin/products` | GET / POST |
| Admin orders | `/api/admin/orders` | GET |
| Contact | `/api/contact` | POST |
| Admin messages | `/api/admin/messages` | GET |

*This is a high-level endpoint overview. Refer to the backend route files for complete endpoint specifications.*

---

## 🔒 Security

FoodieHub includes security measures such as:

- Password hashing for user authentication.
- Session-based admin authentication.
- Server-side admin role verification.
- Protected admin API endpoints.
- Separation of customer and administrator access.
- HTTP-only session cookies.

For production deployment, configure HTTPS, secure cookies, environment-based secrets, CSRF protection, and appropriate rate limiting.

---

## 📸 Project Screenshots

Add your actual application screenshots here to showcase the interface.

Suggested screenshots:

1. Homepage
2. Menu page
3. Product details page
4. Shopping cart
5. Checkout page
6. Login and registration pages
7. Admin dashboard

Example:

```markdown
![FoodieHub Homepage](screenshots/homepage.png)
![FoodieHub Menu](screenshots/menu.png)
![FoodieHub Admin Dashboard](screenshots/admin-dashboard.png)
```

---

## 🔮 Future Improvements

- Online payment gateway integration.
- Order tracking and delivery status updates.
- Customer order history.
- Product reviews and ratings.
- Email and order notifications.
- Advanced admin analytics.
- Deployment with a production database.

---

## 🎯 Project Objective

The primary objective of FoodieHub is to develop a practical full-stack application while gaining hands-on experience in frontend development, backend API integration, database management, authentication, and application security.

---

## 👨‍💻 Developer

**Developed as a Full Stack Web Development Project.**

If you find this project interesting, feel free to explore the repository and share your feedback.

⭐ If you like this project, consider giving it a star!

**FoodieHub – Good Food. Great Mood.**