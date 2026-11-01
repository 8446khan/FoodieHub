import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Clock, Star } from "lucide-react";
import { dishes } from "../data/dishes";
import { useCart } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const dish = dishes.find(item => item.id === id);
  const { addToCart } = useCart();
  if (!dish) return <main className="container py-20 text-center"><h1 className="section-title text-3xl">Dish not found</h1><Link className="gold-btn mt-5" to="/menu">Back to menu</Link></main>;
  return <main className="container py-12"><Link to="/menu" className="muted mb-6 inline-flex items-center gap-2 text-sm hover:text-[#ffd65a]"><ArrowLeft size={16}/> Back to menu</Link><div className="grid gap-8 md:grid-cols-2"><img src={dish.image} alt={dish.name} className="h-[320px] w-full rounded-2xl object-cover md:h-[480px]"/><div className="flex flex-col items-start justify-center"><p className="eyebrow">{dish.category}</p><h1 className="section-title mt-3 text-4xl md:text-5xl">{dish.name}</h1><div className="muted mt-4 flex items-center gap-4 text-sm"><span className="flex items-center gap-1 text-[#ffd65a]"><Star size={15} fill="currentColor"/>{dish.rating}</span><span className="flex items-center gap-1"><Clock size={15}/>{dish.time}</span></div><p className="muted mt-6 leading-7">{dish.description}</p><p className="mt-6 text-3xl font-bold text-[#ffd65a]">₹{dish.price}</p><button onClick={() => addToCart(dish)} className="gold-btn mt-6">Add to cart</button></div></div></main>;
}
