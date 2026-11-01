
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Store,
    ShieldCheck,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowLeft,
    Loader2,
} from "lucide-react";

import { adminLogin } from "../../services/api";

export default function AdminLoginPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await adminLogin({
                email: email.trim(),
                password,
            });

            if (!data.user?.is_admin) {
                throw new Error(
                    "Administrator access could not be verified."
                );
            }

            navigate("/admin", { replace: true });

        } catch (err) {
            setError(
                err.message || "Unable to connect to the server."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#080d0f] px-4 py-10 text-white">
            <div className="w-full max-w-md">

                {/* Brand */}
                <Link
                    to="/"
                    className="mb-8 flex items-center justify-center gap-3"
                >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffd65a] text-black">
                        <Store size={25} />
                    </div>

                    <span className="font-display text-3xl font-bold">
                        Foodie<span className="text-[#ffd65a]">Hub</span>
                    </span>
                </Link>

                {/* Login Card */}
                <div className="rounded-3xl border border-white/10 bg-[#101719] p-7 shadow-2xl sm:p-9">

                    <div className="mb-7 text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffd65a]/10 text-[#ffd65a]">
                            <ShieldCheck size={29} />
                        </div>

                        <h1 className="font-display text-2xl font-bold">
                            Admin Login
                        </h1>

                        <p className="mt-2 text-sm text-zinc-400">
                            Sign in to manage your restaurant.
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">

                        {/* Email */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-300">
                                Admin Email
                            </label>

                            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#080d0f] px-4 focus-within:border-[#ffd65a]">
                                <Mail size={18} className="text-zinc-500" />

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter admin email"
                                    required
                                    autoComplete="username"
                                    className="w-full bg-transparent py-3.5 text-sm text-white outline-none placeholder:text-zinc-600"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-300">
                                Password
                            </label>

                            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#080d0f] px-4 focus-within:border-[#ffd65a]">
                                <Lock size={18} className="text-zinc-500" />

                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                    autoComplete="current-password"
                                    className="w-full bg-transparent py-3.5 text-sm text-white outline-none placeholder:text-zinc-600"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-zinc-500 transition hover:text-white"
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword
                                        ? <EyeOff size={18} />
                                        : <Eye size={18} />
                                    }
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div
                                role="alert"
                                className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                            >
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#ffd65a] py-3.5 font-semibold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? (
                                <>
                                    <Loader2
                                        size={19}
                                        className="animate-spin"
                                    />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    <ShieldCheck size={19} />
                                    Sign In to Dashboard
                                </>
                            )}
                        </button>
                    </form>

                    {/* Back to website */}
                    <div className="mt-7 border-t border-white/10 pt-6 text-center">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-[#ffd65a]"
                        >
                            <ArrowLeft size={16} />
                            Back to FoodieHub
                        </Link>
                    </div>
                </div>

                <p className="mt-6 text-center text-xs text-zinc-600">
                    <ShieldCheck size={13} className="mr-1 inline" />
                    Restricted access for authorized administrators only.
                </p>
            </div>
        </div>
    );
}
