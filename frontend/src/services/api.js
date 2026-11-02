
const API_BASE_URL = "https://foodiehub-backend-8l96.onrender.com/api";

// ==========================================
// COMMON API RESPONSE HANDLER
// ==========================================

const handleResponse = async (response, defaultErrorMessage) => {
    let data = {};

    try {
        data = await response.json();
    } catch {
        data = {};
    }

    if (!response.ok) {
        throw new Error(data.error || data.message || defaultErrorMessage);
    }

    return data;
};

// ==========================================
// CUSTOMER PRODUCT APIs
// ==========================================

export const getProducts = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/products/`, {
            method: "GET",
            credentials: "include",
        });

        const data = await handleResponse(
            response,
            "Failed to fetch products"
        );

        return data.items || [];
    } catch (error) {
        console.error("Get Products API Error:", error);
        throw error;
    }
};

// ==========================================
// ADMIN PRODUCT APIs
// ==========================================

export const getAdminProducts = async () => {
    const response = await fetch(`${API_BASE_URL}/admin/products`, {
        method: "GET",
        credentials: "include",
    });

    const data = await handleResponse(
        response,
        "Failed to fetch admin products"
    );

    return data.items || [];
};

export const addAdminProduct = async (product) => {
    const response = await fetch(`${API_BASE_URL}/admin/products`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(product),
    });

    return handleResponse(response, "Failed to add product");
};

export const updateAdminProduct = async (id, product) => {
    const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(product),
    });

    return handleResponse(response, "Failed to update product");
};

export const deleteAdminProduct = async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
        method: "DELETE",
        credentials: "include",
    });

    return handleResponse(response, "Failed to delete product");
};

// ==========================================
// CUSTOMER AUTHENTICATION APIs
// ==========================================

export const registerUser = async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(userData),
    });

    return handleResponse(response, "Registration failed");
};

export const loginUser = async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(credentials),
    });

    return handleResponse(response, "Login failed");
};

export const getCurrentUser = async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        return null;
    }

    const data = await handleResponse(
        response,
        "Unable to fetch current user"
    );

    return data.user || null;
};

export const logoutUser = async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
    });

    return handleResponse(response, "Logout failed");
};

// ==========================================
// ADMIN AUTHENTICATION APIs
// ==========================================

export const adminLogin = async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/admin-login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(credentials),
    });

    return handleResponse(response, "Admin login failed");
};

export const getCurrentAdmin = async () => {
    const response = await fetch(`${API_BASE_URL}/auth/admin-me`, {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        return null;
    }

    const data = await handleResponse(
        response,
        "Unable to fetch current admin"
    );

    return data.user || null;
};

export const adminLogout = async () => {
    const response = await fetch(`${API_BASE_URL}/auth/admin-logout`, {
        method: "POST",
        credentials: "include",
    });

    return handleResponse(response, "Admin logout failed");
};

// ==========================================
// CUSTOMER ORDER APIs
// ==========================================

export const createOrder = async (orderData) => {
    const response = await fetch(`${API_BASE_URL}/orders/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(orderData),
    });

    return handleResponse(response, "Unable to place order");
};

export const getOrderById = async (id) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
        method: "GET",
        credentials: "include",
    });

    return handleResponse(response, "Unable to fetch order");
};

export const getMyOrders = async () => {
    const response = await fetch(`${API_BASE_URL}/orders/`, {
        method: "GET",
        credentials: "include",
    });

    const data = await handleResponse(
        response,
        "Unable to fetch orders"
    );

    return data.items || [];
};

// ==========================================
// CUSTOMER PROFILE APIs
// ==========================================

export const getProfile = async () => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "GET",
        credentials: "include",
    });

    const data = await handleResponse(
        response,
        "Unable to load profile"
    );

    return data.user || null;
};

export const updateProfile = async (profileData) => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(profileData),
    });

    return handleResponse(response, "Unable to update profile");
};

export const changePassword = async (passwordData) => {
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(passwordData),
    });

    return handleResponse(response, "Unable to change password");
};

// ==========================================
// CONTACT API
// ==========================================

export const submitContactMessage = async (messageData) => {
    const response = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(messageData),
    });

    return handleResponse(
        response,
        "Unable to send your message"
    );
};
