import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SectionHeading from "../components/SectionHeading";
import {
    getProfile,
    updateProfile,
    changePassword,
} from "../services/api";

export default function MyProfile() {
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
    });

    const [passwords, setPasswords] = useState({
        current_password: "",
        new_password: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadProfile() {
            try {
                const user = await getProfile();
                setProfile({
                    name: user.name || "",
                    email: user.email || "",
                    phone: user.phone || "",
                    address: user.address || "",
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadProfile();
    }, []);

    function handleProfileChange(e) {
        setProfile({
            ...profile,
            [e.target.name]: e.target.value,
        });
    }

    async function handleProfileSubmit(e) {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");
            setMessage("");

            const result = await updateProfile(profile);

            setProfile({
                ...result.user,
                phone: result.user.phone || "",
                address: result.user.address || "",
            });

            window.dispatchEvent(
                new CustomEvent("auth-changed", {
                    detail: result.user,
                })
            );

            setMessage("Your profile has been updated successfully!");
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    async function handlePasswordSubmit(e) {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");
            setMessage("");

            await changePassword(passwords);

            setPasswords({
                current_password: "",
                new_password: "",
            });

            setMessage("Your password has been changed successfully!");
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <main className="container py-20 text-center">
                Loading your profile...
            </main>
        );
    }

    if (error && !profile.email) {
        return (
            <main className="container py-20 text-center">
                <p className="text-red-400">{error}</p>
                <Link to="/login" className="gold-btn mt-5 inline-block">
                    Login
                </Link>
            </main>
        );
    }

    return (
        <main className="container max-w-3xl py-12">
            <SectionHeading
                eyebrow="YOUR ACCOUNT"
                title="My Profile"
                description="Manage your personal information and account security."
            />

            {message && (
                <p className="mb-5 rounded-xl bg-green-500/10 p-4 text-green-400">
                    {message}
                </p>
            )}

            {error && (
                <p className="mb-5 rounded-xl bg-red-500/10 p-4 text-red-400">
                    {error}
                </p>
            )}

            <form
                onSubmit={handleProfileSubmit}
                className="panel grid gap-5 rounded-2xl p-6"
            >
                <h2 className="text-xl font-semibold">Personal Information</h2>

                <label className="grid gap-2 text-sm">
                    Full Name
                    <input
                        className="input-dark"
                        name="name"
                        value={profile.name}
                        onChange={handleProfileChange}
                        required
                    />
                </label>

                <label className="grid gap-2 text-sm">
                    Email Address
                    <input
                        className="input-dark"
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleProfileChange}
                        required
                    />
                </label>

                <label className="grid gap-2 text-sm">
                    Phone Number
                    <input
                        className="input-dark"
                        name="phone"
                        value={profile.phone}
                        onChange={handleProfileChange}
                        placeholder="Enter phone number"
                    />
                </label>

                <label className="grid gap-2 text-sm">
                    Delivery Address
                    <textarea
                        className="input-dark"
                        name="address"
                        value={profile.address}
                        onChange={handleProfileChange}
                        rows="3"
                        placeholder="Enter your delivery address"
                    />
                </label>

                <button className="gold-btn" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </form>

            <form
                onSubmit={handlePasswordSubmit}
                className="panel mt-6 grid gap-5 rounded-2xl p-6"
            >
                <h2 className="text-xl font-semibold">Change Password</h2>

                <label className="grid gap-2 text-sm">
                    Current Password
                    <input
                        className="input-dark"
                        type="password"
                        value={passwords.current_password}
                        onChange={(e) =>
                            setPasswords({
                                ...passwords,
                                current_password: e.target.value,
                            })
                        }
                        required
                    />
                </label>

                <label className="grid gap-2 text-sm">
                    New Password
                    <input
                        className="input-dark"
                        type="password"
                        minLength={8}
                        value={passwords.new_password}
                        onChange={(e) =>
                            setPasswords({
                                ...passwords,
                                new_password: e.target.value,
                            })
                        }
                        required
                    />
                </label>

                <button className="gold-btn" disabled={saving}>
                    {saving ? "Updating..." : "Change Password"}
                </button>
            </form>
        </main>
    );
}