
import { Link } from "react-router-dom";
import { ShoppingCart, Star, Clock } from "lucide-react";

export default function FoodCard({ dish, onAdd }) {
  if (!dish) return null;

  return (
    <article className="panel overflow-hidden rounded-2xl transition hover:-translate-y-1 hover:border-[#ffd65a]/30">
      <Link
        to={`/product/${dish.id}`}
        className="food-image-wrap relative block"
      >
        <img
          src={dish.image}
          alt={dish.name}
          loading="lazy"
          className="food-image h-48 w-full object-cover"
        />

        {dish.tag && (
          <span className="absolute left-3 top-3 rounded-full bg-[#ffd65a] px-3 py-1 text-xs font-bold text-black">
            {dish.tag}
          </span>
        )}
      </Link>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <Link
            to={`/product/${dish.id}`}
            className="font-display text-lg font-semibold text-white hover:text-[#ffd65a]"
          >
            {dish.name}
          </Link>

          <span className="flex shrink-0 items-center gap-1 text-sm text-[#ffd65a]">
            <Star size={14} fill="currentColor" />
            {dish.rating ?? "New"}
          </span>
        </div>

        <p className="muted mt-2 min-h-10 text-sm leading-5">
          {dish.description}
        </p>

        <div className="muted mt-3 flex items-center gap-1 text-xs">
          <Clock size={13} />
          {dish.time || "20 min"}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-xl font-bold text-[#ffd65a]">
            ₹{dish.price}
          </span>

          <button
            onClick={() => onAdd(dish)}
            className="gold-btn !px-3 !py-2"
            type="button"
          >
            <ShoppingCart size={15} />
            Add
          </button>
        </div>
      </div>
    </article>
  );
}
