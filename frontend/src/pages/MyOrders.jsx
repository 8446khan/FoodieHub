
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Clock } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import { getMyOrders } from "../services/api";

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

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadOrders() {
            try {
                const data = await getMyOrders();
                setOrders(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadOrders();
    }, []);

    return (
        <main className="container max-w-4xl py-12">
            <SectionHeading
                eyebrow="YOUR ACCOUNT"
                title="My Orders"
                description="View and manage your previous FoodieHub orders."
            />

            {loading && (
                <p className="muted text-center py-10">
                    Loading your orders...
                </p>
            )}

            {error && (
                <p className="text-red-400 text-center py-10">{error}</p>
            )}

            {!loading && !error && orders.length === 0 && (
                <div className="panel rounded-2xl p-10 text-center">
                    <h2 className="text-xl font-semibold">No orders yet</h2>
                    <p className="muted mt-2">
                        Your food orders will appear here.
                    </p>
                    <Link to="/menu" className="gold-btn inline-block mt-5">
                        Explore Menu
                    </Link>
                </div>
            )}

            <div className="grid gap-5">
                {orders.map((order) => (
                    <div key={order.id} className="panel rounded-2xl p-6">
                        <div className="flex flex-wrap justify-between gap-4">
                            <div>
                                <p className="muted text-sm">Order ID</p>
                                <h3 className="font-semibold text-lg">
                                    #{order.id}
                                </h3>

                                <div className="mt-2 space-y-1">
                                    <p className="muted flex items-center gap-2 text-xs">
                                        <CalendarDays size={14} />
                                        {formatOrderDate(order.created_at)}
                                    </p>

                                    <p className="muted flex items-center gap-2 text-xs">
                                        <Clock size={14} />
                                        {formatOrderTime(order.created_at)}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <p className="muted text-sm">Order Status</p>
                                <p className="font-semibold text-[#ffd65a]">
                                    {order.status}
                                </p>
                            </div>

                            <div>
                                <p className="muted text-sm">Total Amount</p>
                                <p className="font-semibold">
                                    ₹{order.total_amount}
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 border-t border-white/10 pt-4">
                            <p className="muted text-sm">
                                {order.items.length} different food item(s)
                            </p>

                            <div className="mt-3 space-y-2">
                                {order.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex justify-between text-sm"
                                    >
                                        <span>
                                            {item.product_name} × {item.quantity}
                                        </span>
                                        <span>₹{item.subtotal}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-5 flex justify-end">
                            <Link
                                to={`/orders/${order.id}`}
                                className="gold-btn"
                            >
                                Track Order
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
