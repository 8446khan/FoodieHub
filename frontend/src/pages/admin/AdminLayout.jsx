
import { useEffect, useState } from "react";
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Package,
  ClipboardList,
  ArrowLeft,
  Store,
  Mail,
  LogOut,
  UserRound,
} from "lucide-react";

import { getCurrentAdmin, adminLogout } from "../../services/api";

export default function AdminLayout() {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadAdmin = async () => {
      try {
        const currentAdmin = await getCurrentAdmin();

        if (isMounted) {
          setAdmin(currentAdmin);
        }
      } catch (err) {
        console.error("Unable to load admin details:", err);
      }
    };

    loadAdmin();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      setError("");

      await adminLogout();

      navigate("/admin-login", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to logout. Please try again.");
      setLoggingOut(false);
    }
  };

  // Admin sidebar navigation items
  const items = [
    {
      to: "/admin",
      label: "Dashboard",
      icon: LayoutDashboard,
      end: true,
    },
    {
      to: "/admin/products",
      label: "Manage Products",
      icon: Package,
    },
    {
      to: "/admin/orders",
      label: "Manage Orders",
      icon: ClipboardList,
    },
    {
      to: "/admin/messages",
      label: "Contact Messages",
      icon: Mail,
    },
  ];

  const adminName = admin?.name || "Administrator";
  const adminEmail = admin?.email || "Admin account";

  return (
    <div className="min-h-screen bg-[#080d0f] text-white md:grid md:grid-cols-[250px_1fr]">

      {/* SIDEBAR */}
      <aside className="flex flex-col border-b border-white/10 bg-[#0b1113] p-5 md:min-h-screen md:border-b-0 md:border-r md:p-6">

        {/* Brand */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ffd65a] text-black">
            <Store size={21} />
          </div>

          <div>
            <h2 className="font-display text-xl font-bold">
              FoodieHub
            </h2>
            <p className="text-xs text-zinc-500">
              Restaurant Management
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <div className="mt-10">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Administration
          </p>

          <nav className="grid gap-2">
            {items.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${isActive
                    ? "bg-[#ffd65a] text-black shadow-lg shadow-yellow-500/10"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Admin information */}
        <div className="mt-10 border-t border-white/10 pt-5">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Logged in as
          </p>

          <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ffd65a] text-black">
              <UserRound size={20} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {adminName}
              </p>
              <p className="truncate text-xs text-zinc-500">
                {adminEmail}
              </p>
            </div>
          </div>
        </div>

        {/* Back to website and logout */}
        <div className="mt-auto border-t border-white/10 pt-5">
          {error && (
            <p className="mb-3 px-3 text-xs text-red-400">
              {error}
            </p>
          )}

          <Link
            to="/"
            className="mb-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-[#ffd65a]"
          >
            <ArrowLeft size={18} />
            Back to Website
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LogOut size={18} />
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>

      </aside>

      {/* ADMIN PAGE CONTENT */}
      <main className="min-w-0 p-5 md:p-8 lg:p-10">
        <Outlet />
      </main>

    </div>
  );
}
