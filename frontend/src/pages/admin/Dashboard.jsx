
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardList,
  IndianRupee,
  Package,
  Clock,
  RefreshCw,
  ArrowRight
} from "lucide-react";

const API_BASE_URL = "https://foodiehub-backend-8l96.onrender.com/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    product_count: 0,
    order_count: 0,
    revenue: 0,
    pending_orders: 0
  });

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      const [summaryResponse, ordersResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/summary`, {
          credentials: "include",
        }),
        fetch(`${API_BASE_URL}/admin/orders`, {
          credentials: "include",
        }),
      ]);

      const summaryData = await summaryResponse.json();
      const ordersData = await ordersResponse.json();

      if (!summaryResponse.ok) {
        throw new Error(summaryData.error || "Unable to load statistics");
      }

      if (!ordersResponse.ok) {
        throw new Error(ordersData.error || "Unable to load recent orders");
      }

      setStats({
        product_count: summaryData.products ?? 0,
        order_count: summaryData.orders ?? 0,
        revenue: summaryData.revenue ?? 0,
        pending_orders: summaryData.pending_orders ?? 0
      });

      setOrders((ordersData.items || []).slice(0, 5));
    } catch (err) {
      setError(err.message || "Unable to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "N/A";

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  const getStatusStyle = (status) => {
    const styles = {
      Pending: "bg-yellow-500/10 text-yellow-400",
      Confirmed: "bg-blue-500/10 text-blue-400",
      Preparing: "bg-purple-500/10 text-purple-400",
      "Out for Delivery": "bg-orange-500/10 text-orange-400",
      Delivered: "bg-green-500/10 text-green-400",
      Cancelled: "bg-red-500/10 text-red-400"
    };

    return styles[status] || "bg-white/10 text-zinc-300";
  };

  const cards = [
    {
      label: "Menu items",
      value: stats.product_count,
      icon: Package
    },
    {
      label: "Total orders",
      value: stats.order_count,
      icon: ClipboardList
    },
    {
      label: "Revenue",
      value: `₹${Number(stats.revenue).toLocaleString("en-IN")}`,
      icon: IndianRupee
    },
    {
      label: "Pending orders",
      value: stats.pending_orders,
      icon: Clock
    }
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">OVERVIEW</p>
          <h1 className="section-title mt-2 text-3xl">
            Dashboard
          </h1>
          <p className="muted mt-2 text-sm">
            Live statistics from your FoodieHub database.
          </p>
        </div>

        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-sm hover:bg-white/5 disabled:opacity-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mt-5 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="panel rounded-xl p-5">
            <Icon className="text-[#ffd65a]" size={25} />
            <p className="muted mt-4 text-sm">{label}</p>
            <p className="mt-1 text-2xl font-bold">
              {loading ? "..." : value}
            </p>
          </div>
        ))}
      </div>

      <div className="panel mt-7 overflow-hidden rounded-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-5">
          <div>
            <h2 className="text-lg font-semibold">
              Recent Orders
            </h2>
            <p className="muted mt-1 text-sm">
              Latest customer orders from your restaurant.
            </p>
          </div>

          <Link
            to="/admin/orders"
            className="flex items-center gap-2 text-sm text-[#ffd65a] hover:underline"
          >
            View all orders
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left text-sm">
            <thead className="border-b border-white/10 text-zinc-400">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Order Date</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center muted">
                    Loading recent orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center muted">
                    No orders available yet.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-white/5 hover:bg-white/[0.02]"
                  >
                    <td className="p-4 font-medium">
                      #{order.id}
                    </td>

                    <td className="p-4">
                      {order.customer_name}
                    </td>

                    <td className="p-4 text-zinc-400">
                      {formatDate(order.created_at)}
                    </td>

                    <td className="p-4 font-medium text-[#ffd65a]">
                      ₹{Number(order.total_amount).toLocaleString("en-IN")}
                    </td>

                    <td className="p-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end border-t border-white/10 p-4">
          <Link
            to="/admin/orders"
            className="text-sm text-[#ffd65a] hover:underline"
          >
            Manage all orders →
          </Link>
        </div>
      </div>
    </div>
  );
}
