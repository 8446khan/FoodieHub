export default function CategoryChips({ categories, active, onChange }) {
  return <div className="flex flex-wrap gap-2">{categories.map(category => <button key={category} onClick={() => onChange(category)} className={`rounded-full border px-4 py-2 text-sm transition ${active === category ? "border-[#ffd65a] bg-[#ffd65a] text-black" : "border-white/10 bg-[#101719] text-zinc-300 hover:border-[#ffd65a]/60 hover:text-[#ffd65a]"}`}>{category}</button>)}</div>;
}
