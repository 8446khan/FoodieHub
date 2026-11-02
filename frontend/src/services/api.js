
const API_BASE_URL = "http://localhost:5000/api";



// ==========================================
// CUSTOMER PRODUCT APIs
// ==========================================

export const getProducts = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/products`);

        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        return data.items || [];

    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};


// ==========================================
// ADMIN PRODUCT APIs
// All requests include the admin session cookie
// ==========================================

// Fetch all admin products
export const getAdminProducts = async () => {
    const response = await fetch(`${API_BASE_URL}/admin/products`, {
        credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Failed to fetch products");
    }

    return data.items || [];
};


// Add a new product
export const addAdminProduct = async (product) => {
    const response = await fetch(`${API_BASE_URL}/admin/products`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(product),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Failed to add product");
    }

    return data;
};


// Update an existing product
export const updateAdminProduct = async (id, product) => {
    const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(product),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Failed to update product");
    }

    return data;
};


// Delete a product
export const deleteAdminProduct = async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
        method: "DELETE",
        credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Failed to delete product");
    }

    return data;
};


// ==========================================
// CUSTOMER AUTHENTICATION APIs
// ==========================================

// Register customer
export const registerUser = async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Registration failed");
    }

    return data;
};


// Customer login
export const loginUser = async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Login failed");
    }

    return data;
};


// Get currently logged-in customer
export const getCurrentUser = async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
        credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
        return null;
    }

    return data.user;
};


// Customer logout
export const logoutUser = async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Logout failed");
    }

    return data;
};


// ==========================================
// ADMIN AUTHENTICATION APIs
// ==========================================

// Admin login
export const adminLogin = async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/admin-login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Admin login failed");
    }

    return data;
};


// Verify admin session
export const getCurrentAdmin = async () => {
    const response = await fetch(`${API_BASE_URL}/auth/admin-me`, {
        credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
        return null;
    }

    return data.user;
};


// Admin logout
export const adminLogout = async () => {
    const response = await fetch(`${API_BASE_URL}/auth/admin-logout`, {
        method: "POST",
        credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Admin logout failed");
    }

    return data;
};


// ==========================================
// CUSTOMER ORDER APIs
// ==========================================

// Create order
export const createOrder = async (orderData) => {
    const response = await fetch(`${API_BASE_URL}/orders/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(orderData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Unable to place order");
    }

    return data;
};


// Get order by ID
export const getOrderById = async (id) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
        credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Unable to fetch order");
    }

    return data;
};


// Get logged-in customer's orders
export const getMyOrders = async () => {
    const response = await fetch(`${API_BASE_URL}/orders/`, {
        credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Unable to fetch orders");
    }

    return data.items || [];
};


// ==========================================
// CUSTOMER PROFILE APIs
// ==========================================

// Get customer profile
export const getProfile = async () => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Unable to load profile");
    }

    return data.user;
};


// Update customer profile
export const updateProfile = async (profileData) => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(profileData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Unable to update profile");
    }

    return data;
};


// Change customer password
export const changePassword = async (passwordData) => {
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(passwordData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Unable to change password");
    }

    return data;
};


export const submitContactMessage = async (messageData) => {
    const response = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Unable to send your message.");
    }

    return data;
};
