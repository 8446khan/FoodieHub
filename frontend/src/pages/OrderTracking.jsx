
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CalendarDays, Clock } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import { getOrderById } from "../services/api";

const statuses = [
    "Pending",
    "Confirmed",
    "Preparing",
    "Out for Delivery",
    "Delivered",
];

function formatOrderDate(date) {
    if (!date) return "Date unavailable";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "Date unavailable";
    }

    return parsedDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function formatOrderTime(date) {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "";
    }

    return parsedDate.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
}

export default function OrderTracking() {
    const { id } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadOrder() {
            try {
                setLoading(true);
                setError("");

                const result = await getOrderById(id);
                setOrder(result.order);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadOrder();
    }, [id]);

    if (loading) {
        return (
            <main className="container py-20 text-center">
                Loading order details...
            </main>
        );
    }

    if (error || !order) {
        return (
            <main className="container py-20 text-center">
                <h2 className="section-title text-2xl">Order not found</h2>
                <p className="muted mt-3">
                    {error || "Unable to load this order."}
                </p>
                <Link to="/menu" className="gold-btn mt-6 inline-block">
                    Back to Menu
                </Link>
            </main>
        );
    }

    const currentIndex = statuses.indexOf(order.status);

    return (
        <main className="container max-w-3xl py-12">
            <SectionHeading
                eyebrow="ORDER TRACKING"
                title={`Order #${order.id}`}
                description="Follow the progress of your FoodieHub order."
            />

            <section className="panel rounded-2xl p-6">
                <div className="flex flex-wrap justify-between gap-4">
                    <div>
                        <p className="muted text-sm">Order status</p>
                        <h2 className="mt-1 text-xl font-bold text-[#ffd65a]">
                            {order.status}
                        </h2>
                    </div>

                    <div className="text-right">
                        <p className="muted text-sm">Total amount</p>
                        <p className="text-xl font-bold">
                            ₹{order.total_amount}
                        </p>
                    </div>
                </div>

                {/* Order date and time */}
                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/10 pt-4">
                    <p className="muted flex items-center gap-2 text-sm">
                        <CalendarDays size={16} />
                        {formatOrderDate(order.created_at)}
                    </p>

                    <p className="muted flex items-center gap-2 text-sm">
                        <Clock size={16} />
                        {formatOrderTime(order.created_at)}
                    </p>
                </div>

                {/* Order status timeline */}
                <div className="mt-8 space-y-5">
                    {statuses.map((status, index) => {
                        const completed = currentIndex >= index;

                        return (
                            <div key={status} className="flex items-center gap-4">
                                <div
                                    className={`flex h-9 w-9 items-center justify-center rounded-full ${completed
                                        ? "bg-[#ffd65a] text-black"
                                        : "bg-white/10 text-gray-400"
                                        }`}
                                >
                                    {completed ? "✓" : index + 1}
                                </div>

                                <div>
                                    <p
                                        className={
                                            completed
                                                ? "font-semibold text-white"
                                                : "muted"
                                        }
                                    >
                                        {status}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            <section className="panel mt-6 rounded-2xl p-6">
                <h3 className="text-lg font-semibold">Ordered Items</h3>

                <div className="mt-4 space-y-4">
                    {order.items.map((item) => (
                        <div
                            key={item.id}
                            className="flex justify-between gap-4"
                        >
                            <div>
                                <p>{item.product_name}</p>
                                <p className="muted text-sm">
                                    ₹{item.price} × {item.quantity}
                                </p>
                            </div>

                            <p className="text-[#ffd65a]">
                                ₹{item.subtotal}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="panel mt-6 rounded-2xl p-6">
                <h3 className="text-lg font-semibold">Delivery Details</h3>
                <p className="muted mt-3">{order.customer_name}</p>
                <p className="muted">{order.phone}</p>
                <p className="muted">{order.address}</p>
            </section>

            <Link to="/menu" className="gold-btn mt-6 inline-block">
                Continue Shopping
            </Link>
        </main>
    );
}
