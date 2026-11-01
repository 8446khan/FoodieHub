
import { useEffect, useState } from "react";
import {
  getAdminProducts,
  addAdminProduct,
  updateAdminProduct,
  deleteAdminProduct
} from "../../services/api";

const initialForm = {
  name: "",
  description: "",
  price: "",
  category: "Burgers",
  image: "",
  rating: "4.5",
  time: "20 min",
  tag: ""
};

export default function ManageProducts() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const products = await getAdminProducts();
      setItems(products);
    } catch (err) {
      setError(err.message || "Unable to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const productData = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      category: form.category,
      image: form.image.trim(),
      rating: Number(form.rating),
      time: form.time.trim(),
      tag: form.tag.trim()
    };

    if (
      !productData.name ||
      !productData.description ||
      !productData.image ||
      !productData.time ||
      !Number.isFinite(productData.price) ||
      productData.price <= 0 ||
      !Number.isFinite(productData.rating) ||
      productData.rating < 0 ||
      productData.rating > 5
    ) {
      setError("Please enter valid product details.");
      setSaving(false);
      return;
    }

    try {
      if (editingId !== null) {
        await updateAdminProduct(editingId, productData);
        setSuccess("Product updated successfully.");
      } else {
        await addAdminProduct(productData);
        setSuccess("Product added successfully.");
      }

      resetForm();
      await loadProducts();
    } catch (err) {
      setError(err.message || "Unable to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name || "",
      description: product.description || "",
      price: String(product.price ?? ""),
      category: product.category || "Burgers",
      image: product.image || "",
      rating: String(product.rating ?? 4.5),
      time: product.time || "20 min",
      tag: product.tag || ""
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await deleteAdminProduct(id);
      setSuccess("Product deleted successfully.");

      if (editingId === id) {
        resetForm();
      }

      await loadProducts();
    } catch (err) {
      setError(err.message || "Unable to delete product");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">CATALOG</p>
        <h1 className="section-title mt-2 text-3xl">
          Manage products
        </h1>
        <p className="muted mt-2 text-sm">
          Products are saved in your FoodieHub database.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-400">
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="panel grid gap-4 rounded-xl p-5"
      >
        <h2 className="text-lg font-semibold">
          {editingId !== null ? "Edit product" : "Add new product"}
        </h2>

        <div className="grid gap-3 sm:grid-cols-2">
          <input
            className="input-dark"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Dish name"
            required
          />

          <input
            className="input-dark"
            name="price"
            type="number"
            min="1"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            placeholder="Price (₹)"
            required
          />

          <select
            className="input-dark"
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            {["Burgers", "Pizza", "Pasta", "Starters", "Healthy", "Desserts", "Beverages", "Other"].map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <input
            className="input-dark"
            name="rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={form.rating}
            onChange={handleChange}
            placeholder="Rating (0–5)"
          />

          <input
            className="input-dark"
            name="time"
            value={form.time}
            onChange={handleChange}
            placeholder="Preparation time (e.g. 20 min)"
            required
          />

          <input
            className="input-dark"
            name="tag"
            value={form.tag}
            onChange={handleChange}
            placeholder="Tag (e.g. Bestseller)"
          />
        </div>

        <textarea
          className="input-dark min-h-24"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Product description"
          required
        />

        <input
          className="input-dark"
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="Product image URL"
          required
        />

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="gold-btn disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : editingId !== null
                ? "Update product"
                : "Add product"}
          </button>

          {editingId !== null && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-white/20 px-5 py-3"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="panel overflow-x-auto rounded-xl">
        <table className="w-full min-w-[750px] text-left text-sm">
          <thead className="border-b border-white/10 text-zinc-400">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Rating</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="p-6 text-center">
                  Loading products...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-6 text-center text-zinc-400">
                  No products found.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-white/5"
                >
                  <td className="p-4 font-medium">
                    {item.name}
                  </td>

                  <td className="p-4 text-zinc-400">
                    {item.category}
                  </td>

                  <td className="p-4 text-[#ffd65a]">
                    ₹{Number(item.price).toFixed(2)}
                  </td>

                  <td className="p-4">
                    {item.rating ?? "—"}
                  </td>

                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(item)}
                        className="rounded-md border border-white/20 px-3 py-2 hover:bg-white/10"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="rounded-md border border-red-500/30 px-3 py-2 text-red-400 hover:bg-red-500/10"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
