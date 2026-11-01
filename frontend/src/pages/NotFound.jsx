import { Link } from "react-router-dom";
export default function NotFound() {
  return <main className="container py-24 text-center"><p className="eyebrow">404 ERROR</p><h1 className="section-title mt-3 text-5xl">Page not found</h1><p className="muted mt-4">We couldn't find that page.</p><Link to="/" className="gold-btn mt-6">Back home</Link></main>;
}
