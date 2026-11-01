
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Truck,
} from "lucide-react";

import FoodCard from "../components/FoodCard";
import SectionHeading from "../components/SectionHeading";
import { useCart } from "../context/CartContext";
import { getProducts } from "../services/api";

export default function Home() {
  const { addToCart } = useCart();

  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDishes() {
      try {
        setLoading(true);
        setError("");

        const result = await getProducts();

        const products = Array.isArray(result)
          ? result
          : result.items || result.products || [];

        setDishes(products.slice(0, 3));
      } catch (err) {
        console.error("Home products error:", err);
        setError("Unable to load popular dishes.");
      } finally {
        setLoading(false);
      }
    }

    fetchDishes();
  }, []);

  return (
    <main>
      {/* Hero Section */}
      <section className="container grid items-center gap-10 py-12 md:min-h-[570px] md:grid-cols-2 md:py-16">
        <div>
          <p className="eyebrow">GOOD FOOD. GOOD MOOD.</p>

          <h1 className="section-title mt-5 text-5xl md:text-7xl">
            Your cravings,
            <br />
            <span className="text-[#ffd65a]">our passion.</span>
          </h1>

          <p className="muted mt-6 max-w-lg text-base leading-7">
            From comfort-food classics to fresh new favorites,
            discover food made to turn an ordinary day into
            something delicious.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/menu" className="gold-btn">
              Explore Menu <ArrowRight size={17} />
            </Link>

            <Link to="/about" className="outline-btn">
              Our Story
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-5 text-xs text-zinc-400">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-[#ffd65a]" />
              Fresh ingredients
            </span>

            <span className="flex items-center gap-2">
              <Clock size={15} className="text-[#ffd65a]" />
              Quick delivery
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-full bg-[#ffd65a]/5 blur-2xl" />

          <img
            className="relative h-[320px] w-full rounded-3xl object-cover md:h-[440px]"
            src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=90"
            alt="Freshly prepared food on a table"
          />

          <div className="panel absolute -bottom-5 left-4 rounded-xl p-4 shadow-xl sm:left-8">
            <p className="text-xs text-zinc-400">
              Customer favorite
            </p>

            <p className="mt-1 font-display text-lg font-bold">
              Made fresh, every day
            </p>

            <p className="mt-1 text-sm text-[#ffd65a]">
              ★★★★★{" "}
              <span className="text-zinc-400">
                4.8/5 rating
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-y border-white/5 bg-[#0b1113] py-8">
        <div className="container grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <Truck className="text-[#ffd65a]" />
            <div>
              <p className="font-semibold">Fast Delivery</p>
              <p className="muted text-sm">
                Good food, right on time
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ShieldCheck className="text-[#ffd65a]" />
            <div>
              <p className="font-semibold">Quality Ingredients</p>
              <p className="muted text-sm">
                Freshness in every bite
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="text-[#ffd65a]" />
            <div>
              <p className="font-semibold">Easy Ordering</p>
              <p className="muted text-sm">
                A few clicks to delicious
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="container py-16">
        <SectionHeading
          eyebrow="HANDPICKED FOR YOU"
          title="Popular right now"
          description="The dishes our customers keep coming back for."
          action={
            <Link to="/menu" className="outline-btn">
              View full menu <ArrowRight size={15} />
            </Link>
          }
        />

        {loading && (
          <p className="muted py-10 text-center">
            Loading popular dishes...
          </p>
        )}

        {error && (
          <p className="py-8 text-center text-red-400">
            {error}
          </p>
        )}

        {!loading && !error && dishes.length === 0 && (
          <p className="muted py-10 text-center">
            No dishes available yet.
          </p>
        )}

        {!loading && !error && dishes.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {dishes.map((dish) => (
              <FoodCard
                key={dish.id}
                dish={dish}
                onAdd={addToCart}
              />
            ))}
          </div>
        )}
      </section>

      {/* Call to Action */}
      <section className="container pb-16">
        <div className="overflow-hidden rounded-3xl border border-[#ffd65a]/20 bg-gradient-to-r from-[#171b16] to-[#101719] p-7 md:p-12">
          <p className="eyebrow">A LITTLE SOMETHING EXTRA</p>

          <h2 className="section-title mt-3 text-3xl md:text-4xl">
            Your next favorite meal
            <br />
            is one click away.
          </h2>

          <Link to="/menu" className="gold-btn mt-6">
            Order something delicious <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
