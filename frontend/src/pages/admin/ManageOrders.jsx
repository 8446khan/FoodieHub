
import { useEffect, useMemo, useState } from "react";
import {
  ClipboardList,
  RefreshCw,
  Search,
  Package,
  MapPin,
  Phone,
  Mail,
  CalendarDays,
  ChevronDown,
  AlertCircle,
} from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api";

const STATUSES = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const statusStyles = {
  Pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  Confirmed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Preparing: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "Out for Delivery": "bg-orange-500/10 text-orange-400 border-orange-500/20",
  Delivered: "bg-green-500/10 text-green-400 border-green-500/20",
  Cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [updatingId, setUpdatingId] = useState(null);

  async function fetchOrders() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/admin/orders`, {
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to fetch orders");
      }

      setOrders(data.items || []);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  async function updateStatus(orderId, newStatus) {
    setUpdatingId(orderId);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to update status");
      }

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order.id === orderId
            ? { ...order, status: data.order.status }
            : order
        )
      );
    } catch (err) {
      setError(err.message || "Status update failed");
    } finally {
      setUpdatingId(null);
    }
  }

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        String(order.id).includes(searchText) ||
        order.customer_name?.toLowerCase().includes(searchText) ||
        order.customer_email?.toLowerCase().includes(searchText) ||
        order.phone?.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const totalRevenue = orders
    .filter((order) => order.status === "Delivered")
    .reduce((sum, order) => sum + Number(order.total_amount || 0), 0);

  const pendingCount = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const money = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className="pb-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="eyebrow">FULFILLMENT</p>
          <h1 className="section-title mt-2 text-3xl">
            Manage Orders
          </h1>
          <p className="muted mt-2 text-sm">
            View customer orders and manage delivery progress.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-white transition hover:border-[#ffd65a] hover:text-[#ffd65a] disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh Orders
        </button>
      </div>

      {/* Summary Cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="panel rounded-xl p-5">
          <p className="muted text-sm">Total Orders</p>
          <h2 className="mt-2 text-2xl font-bold">{orders.length}</h2>
        </div>

        <div className="panel rounded-xl p-5">
          <p className="muted text-sm">Pending Orders</p>
          <h2 className="mt-2 text-2xl font-bold text-yellow-400">
            {pendingCount}
          </h2>
        </div>

        <div className="panel rounded-xl p-5">
          <p className="muted text-sm">Delivered Revenue</p>
          <h2 className="mt-2 text-2xl font-bold text-[#ffd65a]">
            {money(totalRevenue)}
          </h2>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="panel mt-6 flex flex-col gap-3 rounded-xl p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search order ID, customer, email or phone..."
            className="w-full rounded-lg border border-white/10 bg-[#080d0f] py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-[#ffd65a]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-lg border border-white/10 bg-[#080d0f] px-4 py-3 text-sm text-white outline-none focus:border-[#ffd65a]"
        >
          <option value="All">All statuses</option>
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-5 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="panel mt-6 rounded-xl p-10 text-center">
          <RefreshCw className="mx-auto animate-spin text-[#ffd65a]" size={28} />
          <p className="muted mt-3 text-sm">Loading customer orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="panel mt-6 rounded-xl p-10 text-center">
          <ClipboardList
            className="mx-auto text-[#ffd65a]"
            size={34}
          />
          <h2 className="mt-4 font-semibold">No orders found</h2>
          <p className="muted mt-2 text-sm">
            {orders.length === 0
              ? "Customer orders will appear here after checkout."
              : "Try changing your search or status filter."}
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="panel overflow-hidden rounded-xl"
            >
              {/* Order Header */}
              <div className="flex flex-col justify-between gap-3 border-b border-white/10 p-5 sm:flex-row sm:items-center">
                <div>
                  <p className="text-xs text-zinc-500">
                    ORDER #{order.id}
                  </p>
                  <h2 className="mt-1 text-lg font-semibold">
                    {order.customer_name}
                  </h2>
                  <p className="muted mt-1 text-xs">
                    <CalendarDays size={13} className="mr-1 inline" />
                    {formatDate(order.created_at)}
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:items-end">
                  <span
                    className={`w-fit rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[order.status] ||
                      "border-white/10 text-zinc-300"
                      }`}
                  >
                    {order.status}
                  </span>

                  <div className="relative">
                    <select
                      value={order.status}
                      disabled={updatingId === order.id}
                      onChange={(event) =>
                        updateStatus(order.id, event.target.value)
                      }
                      className="appearance-none rounded-lg border border-white/10 bg-[#080d0f] py-2 pl-3 pr-9 text-xs text-white outline-none focus:border-[#ffd65a] disabled:opacity-50"
                    >
                      {STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-6 p-5 lg:grid-cols-2">
                {/* Customer Details */}
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-[#ffd65a]">
                    Customer Details
                  </h3>

                  <div className="space-y-3 text-sm text-zinc-300">
                    <p>
                      <Mail size={15} className="mr-2 inline text-zinc-500" />
                      {order.customer_email || "Email unavailable"}
                    </p>

                    <p>
                      <Phone size={15} className="mr-2 inline text-zinc-500" />
                      {order.phone}
                    </p>

                    <p className="flex items-start gap-2">
                      <MapPin
                        size={15}
                        className="mt-0.5 shrink-0 text-zinc-500"
                      />
                      <span>{order.address}</span>
                    </p>
                  </div>
                </div>

                {/* Ordered Products */}
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-[#ffd65a]">
                    Ordered Items
                  </h3>

                  <div className="space-y-3">
                    {order.items?.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3"
                      >
                        {item.product_image ? (
                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/5">
                            <Package size={20} />
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {item.product_name}
                          </p>
                          <p className="muted text-xs">
                            {item.quantity} × {money(item.price)}
                          </p>
                        </div>

                        <p className="text-sm font-medium">
                          {money(item.subtotal)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex justify-between border-t border-white/10 pt-3">
                    <span className="text-sm text-zinc-400">
                      Order Total
                    </span>
                    <span className="font-bold text-[#ffd65a]">
                      {money(order.total_amount)}
                    </span>
                  </div>
                </div>
              </div>

              {updatingId === order.id && (
                <p className="border-t border-white/10 px-5 py-2 text-xs text-[#ffd65a]">
                  Updating order status...
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
