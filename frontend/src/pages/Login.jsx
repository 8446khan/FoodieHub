
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SectionHeading from "../components/SectionHeading";
import { loginUser } from "../services/api";
import { Utensils, Clock, Heart, ShoppingBag } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const result = await loginUser(formData);

      window.dispatchEvent(
        new CustomEvent("auth-changed", {
          detail: result.user,
        })
      );

      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container max-w-6xl py-10 sm:py-14">
      <div className="grid overflow-hidden rounded-3xl border border-white/10 bg-[#0b1113] shadow-2xl md:grid-cols-2">

        {/* LEFT SIDE - LOGIN FORM */}
        <section className="flex flex-col justify-center p-6 sm:p-10 lg:p-14">
          <Link to="/" className="mb-10 flex items-center gap-2">
            <Utensils className="text-[#ffd65a]" size={28} />
            <span className="font-display text-2xl font-bold">
              Foodie<span className="text-[#ffd65a]">Hub</span>
            </span>
          </Link>

          <SectionHeading
            eyebrow="WELCOME BACK"
            title="Login to your account"
            description="Good food is just a few clicks away. Sign in to continue."
          />

          <form
            onSubmit={handleSubmit}
            className="mt-6 grid gap-5"
          >
            <label className="grid gap-2 text-sm">
              Email Address
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="input-dark"
                required
                placeholder="you@example.com"
              />
            </label>

            <label className="grid gap-2 text-sm">
              Password
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="input-dark"
                required
                placeholder="Enter your password"
              />
            </label>

            {error && (
              <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              className="gold-btn w-full py-3"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <p className="muted text-center text-sm">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-[#ffd65a] hover:underline"
              >
                Create an account
              </Link>
            </p>

            <div className="my-2 border-t border-white/10" />

            <Link
              to="/"
              className="text-center text-sm text-zinc-400 transition hover:text-[#ffd65a]"
            >
              ← Back to Home
            </Link>
          </form>
        </section>

        {/* RIGHT SIDE - FOODIEHUB BRANDING */}
        <section className="relative min-h-[420px] overflow-hidden md:min-h-full">
          <img
            src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=85"
            alt="Delicious food served fresh"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />

          <div className="relative flex h-full min-h-[420px] flex-col justify-end p-7 sm:p-10 lg:p-12">
            <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-[#ffd65a]/40 bg-black/40 px-4 py-2 text-xs font-semibold tracking-wider text-[#ffd65a] backdrop-blur">
              <Utensils size={15} />
              GOOD FOOD • GREAT MOOD
            </span>

            <h2 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
              Your Favorite Food,
              <span className="block text-[#ffd65a]">
                Just a Click Away.
              </span>
            </h2>

            <p className="mt-4 max-w-md text-sm leading-7 text-zinc-200">
              From cheesy pizzas and juicy burgers to delicious pasta
              and biryani, discover something you'll love at FoodieHub.
              Your next favorite meal is waiting for you!
            </p>

            <div className="mt-8 grid grid-cols-3 gap-3 border-t border-white/20 pt-6">
              <div>
                <ShoppingBag className="mb-2 text-[#ffd65a]" size={22} />
                <p className="text-xs font-semibold text-white">
                  Easy Ordering
                </p>
              </div>

              <div>
                <Clock className="mb-2 text-[#ffd65a]" size={22} />
                <p className="text-xs font-semibold text-white">
                  Simple Checkout
                </p>
              </div>

              <div>
                <Heart className="mb-2 text-[#ffd65a]" size={22} />
                <p className="text-xs font-semibold text-white">
                  Made with Love
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
