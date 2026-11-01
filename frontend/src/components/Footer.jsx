
import { Link } from "react-router-dom";
import {
  Utensils,
  Instagram,
  Facebook,
  Phone,
  ShieldCheck,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-[#070b0d]">
      <div className="container grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">

        {/* BRAND */}
        <div>
          <Link to="/" className="flex items-center gap-2">
            <Utensils className="text-[#ffd65a]" />
            <span className="font-display text-xl font-bold">
              Foodie<span className="text-[#ffd65a]">Hub</span>
            </span>
          </Link>

          <p className="muted mt-3 max-w-xs text-sm">
            Good food, great mood. Fresh favorites made for your everyday cravings.
          </p>
        </div>

        {/* EXPLORE */}
        <div>
          <h3 className="font-semibold">Explore</h3>

          <div className="mt-3 grid gap-2 text-sm text-zinc-400">
            <Link to="/menu" className="hover:text-[#ffd65a]">
              Our Menu
            </Link>

            <Link to="/about" className="hover:text-[#ffd65a]">
              About Us
            </Link>

            <Link to="/contact" className="hover:text-[#ffd65a]">
              Contact
            </Link>
          </div>
        </div>

        {/* OPENING HOURS */}
        <div>
          <h3 className="font-semibold">Opening Hours</h3>

          <p className="muted mt-3 text-sm">
            Monday – Sunday
          </p>

          <p className="mt-1 text-sm">
            11:00 AM – 11:00 PM
          </p>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="font-semibold">Get in touch</h3>

          <p className="muted mt-3 flex items-center gap-2 text-sm">
            <Phone size={14} />
            +91 98765 43210
          </p>

          <div className="mt-3 flex gap-3 text-zinc-400">
            <Instagram size={18} />
            <Facebook size={18} />
          </div>
        </div>

      </div>

      {/* RESTAURANT MANAGEMENT */}
      <div className="border-t border-white/10">
        <div className="container flex flex-col items-center justify-between gap-3 py-5 sm:flex-row">

          <p className="text-xs text-zinc-500">
            © {new Date().getFullYear()} FoodieHub. All rights reserved.
          </p>

          <Link
            to="/admin-login"
            className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-xs font-medium text-zinc-400 transition hover:border-[#ffd65a]/40 hover:bg-[#ffd65a]/5 hover:text-[#ffd65a]"
          >
            <ShieldCheck size={15} />
            Restaurant Admin Login
          </Link>

        </div>
      </div>
    </footer>
  );
}
