
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Utensils,
  Search,
  ShoppingCart,
  Menu as MenuIcon,
  X,
  LogOut,
  UserRound,
  ClipboardList,
} from "lucide-react";

import { getCurrentUser, logoutUser } from "../services/api";

export default function Navbar({ cartCount = 0 }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  const links = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menu" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const navClass = ({ isActive }) =>
    `text-sm transition ${isActive
      ? "text-[#ffd65a]"
      : "text-zinc-300 hover:text-[#ffd65a]"
    }`;

  useEffect(() => {
    async function checkUser() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch {
        setUser(null);
      }
    }

    function handleAuthChange(event) {
      if (event.detail) {
        setUser(event.detail);
      } else {
        checkUser();
      }
    }

    checkUser();
    window.addEventListener("auth-changed", handleAuthChange);

    return () => {
      window.removeEventListener("auth-changed", handleAuthChange);
    };
  }, []);

  async function handleLogout() {
    try {
      await logoutUser();
      setUser(null);
      setMenuOpen(false);
      window.dispatchEvent(new Event("auth-changed"));
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#080d0f]/95 backdrop-blur">
      <nav className="container flex h-16 items-center justify-between gap-4">

        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
          <Utensils size={22} className="text-[#ffd65a]" />
          <span className="font-display text-xl font-bold text-white">
            Foodie<span className="text-[#ffd65a]">Hub</span>
          </span>
        </Link>

        {/* Main Navigation */}
        <div className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={navClass}
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">

          <Link
            to="/menu"
            aria-label="Search menu"
            className="text-zinc-300 hover:text-[#ffd65a]"
          >
            <Search size={18} />
          </Link>

          <Link
            to="/cart"
            aria-label={`Cart, ${cartCount} items`}
            className="relative text-zinc-300 hover:text-[#ffd65a]"
          >
            <ShoppingCart size={19} />

            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ffd65a] px-1 text-[10px] font-bold text-black">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Desktop Customer Account */}
          {user ? (
            <div className="hidden items-center gap-3 lg:flex">
              <span className="text-sm text-[#ffd65a]">
                Hi, {user.name}
              </span>

              <NavLink to="/orders" className={navClass}>
                My Orders
              </NavLink>

              <NavLink to="/profile" className={navClass}>
                <span className="flex items-center gap-1">
                  <UserRound size={15} />
                  Profile
                </span>
              </NavLink>

              <button
                onClick={handleLogout}
                className="text-zinc-300 transition hover:text-red-400"
                title="Logout"
                aria-label="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-3 sm:flex">
              <Link
                to="/login"
                className="text-sm text-zinc-300 hover:text-[#ffd65a]"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="text-sm text-[#ffd65a] hover:text-white"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="text-zinc-200 md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-t border-white/10 px-5 py-3 md:hidden">

          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={closeMenu}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-3 text-sm transition ${isActive
                  ? "text-[#ffd65a]"
                  : "text-zinc-300 hover:bg-white/5 hover:text-[#ffd65a]"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

          <div className="mt-2 border-t border-white/10 pt-3">

            {user ? (
              <>
                <p className="px-3 py-2 text-sm text-[#ffd65a]">
                  Welcome, {user.name}
                </p>

                <Link
                  to="/orders"
                  onClick={closeMenu}
                  className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm text-zinc-300 hover:bg-white/5 hover:text-[#ffd65a]"
                >
                  <ClipboardList size={17} />
                  My Orders
                </Link>

                <Link
                  to="/profile"
                  onClick={closeMenu}
                  className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm text-zinc-300 hover:bg-white/5 hover:text-[#ffd65a]"
                >
                  <UserRound size={17} />
                  My Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-3 text-sm text-red-400 hover:bg-white/5"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="block px-3 py-3 text-sm text-zinc-300"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="block px-3 py-3 text-sm text-[#ffd65a]"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
