
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import FoodCard from "../components/FoodCard";
import CategoryChips from "../components/CategoryChips";
import SectionHeading from "../components/SectionHeading";
import { categories } from "../data/dishes";
import { useCart } from "../context/CartContext";
import { getProducts } from "../services/api";

const categoryMap = {
  All: "All",
  Burgers: "Burger",
  Pizza: "Pizza",
  Pasta: "Pasta",
  Starters: "Sides",
  Healthy: "Healthy",
  Desserts: "Dessert",
};

export default function Menu() {
  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();

        setDishes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch dishes:", err);
        setError("Unable to load dishes. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();
  }, []);

  const filtered = useMemo(() => {
    const selectedCategory = categoryMap[active] || active;

    return dishes.filter((dish) => {
      const matchesCategory =
        selectedCategory === "All" ||
        dish.category?.toLowerCase() === selectedCategory.toLowerCase();

      const matchesSearch =
        `${dish.name} ${dish.description || ""}`
          .toLowerCase()
          .includes(query.trim().toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [dishes, active, query]);

  return (
    <main className="container py-12">

      <SectionHeading
        eyebrow="MADE TO MAKE YOU HAPPY"
        title="Explore our menu"
        description="Find your new favorite, from satisfying mains to something sweet."
      />

      {/* Search */}
      <div className="mb-6 max-w-md relative">
        <Search
          size={17}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
        />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input-dark pl-10"
          placeholder="Search dishes..."
        />
      </div>

      {/* Categories */}
      <CategoryChips
        categories={categories}
        active={active}
        onChange={setActive}
      />

      {/* Loading */}
      {loading && (
        <p className="muted mt-7">
          Loading delicious dishes...
        </p>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="panel rounded-xl p-10 text-center">
          <p className="text-lg font-semibold">{error}</p>

          <button
            className="outline-btn mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Products */}
      {!loading && !error && (
        <>
          <div className="mb-5 mt-7 flex items-center justify-between">
            <p className="muted text-sm">
              {filtered.length} dishes found
            </p>

            {(query || active !== "All") && (
              <button
                className="text-sm text-[#ffd65a] hover:underline"
                onClick={() => {
                  setQuery("");
                  setActive("All");
                }}
              >
                Clear filters
              </button>
            )}
          </div>

          {filtered.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((dish) => (
                <FoodCard
                  key={dish.id}
                  dish={dish}
                  onAdd={addToCart}
                />
              ))}
            </div>
          ) : (
            <div className="panel rounded-xl p-10 text-center">
              <p className="text-lg font-semibold">
                No dishes found
              </p>

              <p className="muted mt-2 text-sm">
                Try another search or category.
              </p>

              <button
                className="outline-btn mt-4"
                onClick={() => {
                  setQuery("");
                  setActive("All");
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </>
      )}

    </main>
  );
}
