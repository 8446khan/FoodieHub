
import { useState } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import { submitContactMessage } from "../services/api";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function submit(e) {
    e.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      await submitContactMessage(formData);

      setSuccess("Thank you! Your message has been sent successfully.");

      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container py-14">
      <SectionHeading
        eyebrow="WE'D LOVE TO HEAR FROM YOU"
        title="Contact us"
        description="Questions, feedback, or a special request? Send a message."
      />

      <div className="grid gap-7 md:grid-cols-2">
        <div className="grid content-start gap-4">

          <div className="panel flex gap-3 rounded-xl p-4">
            <Phone className="text-[#ffd65a]" />
            <div>
              <p className="font-semibold">Call us</p>
              <p className="muted mt-1 text-sm">
                +91 98765 43210 (demo contact)
              </p>
            </div>
          </div>

          <div className="panel flex gap-3 rounded-xl p-4">
            <Mail className="text-[#ffd65a]" />
            <div>
              <p className="font-semibold">Email</p>
              <p className="muted mt-1 text-sm">
                hello@foodiehub.example
              </p>
            </div>
          </div>

          <div className="panel flex gap-3 rounded-xl p-4">
            <MapPin className="text-[#ffd65a]" />
            <div>
              <p className="font-semibold">Location</p>
              <p className="muted mt-1 text-sm">
                Restaurant location to be configured
              </p>
            </div>
          </div>

        </div>

        <form
          onSubmit={submit}
          className="panel grid gap-4 rounded-2xl p-5"
        >
          <label className="grid gap-2 text-sm">
            Your name
            <input
              className="input-dark"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              maxLength={100}
              required
            />
          </label>

          <label className="grid gap-2 text-sm">
            Email
            <input
              className="input-dark"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              maxLength={120}
              required
            />
          </label>

          <label className="grid gap-2 text-sm">
            Message
            <textarea
              className="input-dark"
              name="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your message..."
              maxLength={2000}
              required
            />
          </label>

          {success && (
            <p className="rounded-lg bg-green-500/10 p-3 text-sm text-green-400">
              {success}
            </p>
          )}

          {error && (
            <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            className="gold-btn flex items-center justify-center gap-2"
            type="submit"
            disabled={loading}
          >
            <Send size={16} />
            {loading ? "Sending..." : "Send message"}
          </button>
        </form>
      </div>
    </main>
  );
}
