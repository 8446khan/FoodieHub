
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SectionHeading from "../components/SectionHeading";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/api";

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    payment: "Cash on delivery",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [placedOrder, setPlacedOrder] = useState(null);

  const items = Object.values(cart);

  // Debug cart data
  console.log("Complete cart data:", cart);

  items.forEach((item) => {
    console.log("Product name:", item.name);
    console.log("Product ID:", item.id);
    console.log("Quantity:", item.qty);
    console.log("Complete product:", item);
  });

  function change(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function submit(e) {
    e.preventDefault();

    if (loading) return;

    if (!items.length) {
      setError("Your cart is empty.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Validate customer details
      if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
        throw new Error("Please complete all delivery details.");
      }

      // Prepare and validate order items
      const orderItems = items.map((item) => {
        const productId = Number(item.id);
        const quantity = Number(item.qty);

        console.log("Validating cart item:", {
          name: item.name,
          id: item.id,
          quantity: item.qty,
        });

        if (!Number.isInteger(productId) || productId <= 0) {
          throw new Error(
            `Invalid product ID for ${item.name || "a cart item"}.`
          );
        }

        if (
          !Number.isInteger(quantity) ||
          quantity < 1 ||
          quantity > 100
        ) {
          throw new Error(
            `Invalid quantity for ${item.name || "a cart item"}.`
          );
        }

        return {
          product_id: productId,
          quantity,
        };
      });

      const orderData = {
        customer_name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        items: orderItems,
      };

      console.log("Final order payload:", orderData);

      const result = await createOrder(orderData);

      if (!result || !result.order) {
        throw new Error("Order was submitted, but confirmation was not received.");
      }

      setPlacedOrder(result.order);

      // Clear cart only after successful database saving
      clearCart();

    } catch (err) {
      console.error("Order error:", err);
      setError(err.message || "Unable to place your order.");
    } finally {
      setLoading(false);
    }
  }

  // Order confirmation
  if (placedOrder) {
    return (
      <main className="container py-20 text-center">
        <div className="mx-auto max-w-lg panel rounded-2xl p-8">
          <div className="text-5xl mb-4">✓</div>

          <p className="eyebrow">ORDER CONFIRMED</p>

          <h1 className="section-title mt-3 text-3xl">
            Thank you, {form.name}!
          </h1>

          <p className="muted mt-3">
            Your order has been successfully saved.
          </p>

          <div className="mt-6 rounded-xl bg-white/5 p-4 text-left">
            <p>
              Order ID:{" "}
              <span className="text-[#ffd65a]">
                #{placedOrder.id}
              </span>
            </p>

            <p className="mt-2">
              Status:{" "}
              <span className="text-[#ffd65a]">
                {placedOrder.status}
              </span>
            </p>

            <p className="mt-2">
              Total:{" "}
              <span className="text-[#ffd65a]">
                ₹{placedOrder.total_amount}
              </span>
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={() => navigate(`/orders/${placedOrder.id}`)}
              className="gold-btn"
            >
              Track My Order
            </button>

            <Link to="/menu" className="muted text-sm">
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Empty cart
  if (!items.length) {
    return (
      <main className="container py-16 text-center">
        <h1 className="section-title text-3xl">
          Nothing to checkout
        </h1>

        <Link to="/menu" className="gold-btn mt-5 inline-block">
          Browse menu
        </Link>
      </main>
    );
  }

  return (
    <main className="container max-w-3xl py-12">
      <SectionHeading
        eyebrow="ALMOST THERE"
        title="Checkout"
        description={`Your current food total is ₹${cartTotal}.`}
      />

      <form
        onSubmit={submit}
        className="panel grid gap-4 rounded-2xl p-5 sm:p-7"
      >
        <label className="grid gap-2 text-sm">
          Full name

          <input
            className="input-dark"
            name="name"
            value={form.name}
            onChange={change}
            required
          />
        </label>

        <label className="grid gap-2 text-sm">
          Phone number

          <input
            className="input-dark"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={change}
            required
            pattern="[0-9+() -]{8,16}"
            title="Enter a valid phone number."
          />
        </label>

        <label className="grid gap-2 text-sm">
          Delivery address

          <textarea
            className="input-dark"
            name="address"
            value={form.address}
            onChange={change}
            rows="3"
            required
          />
        </label>

        <label className="grid gap-2 text-sm">
          Payment method

          <select
            className="input-dark"
            name="payment"
            value={form.payment}
            onChange={change}
          >
            <option>Cash on delivery</option>
            <option>Pay on pickup</option>
          </select>
        </label>

        {error && (
          <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </p>
        )}

        <div className="flex items-center justify-between border-t border-white/10 pt-4">
          <span className="font-semibold">
            Total:{" "}
            <span className="text-[#ffd65a]">
              ₹{cartTotal}
            </span>
          </span>

          <button
            className="gold-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </div>

        <p className="muted text-xs">
          Payment is currently handled offline. No online payment is processed.
        </p>
      </form>
    </main>
  );
}
