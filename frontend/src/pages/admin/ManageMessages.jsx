
import { useEffect, useState } from "react";
import {
    Mail,
    MailOpen,
    Trash2,
    RefreshCw,
    Search,
    MessageSquare,
    Clock,
    UserRound,
    X,
    Loader2,
    Inbox,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/admin/messages";

export default function ManageMessages() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [notice, setNotice] = useState("");

    const unreadCount = messages.filter((message) => !message.is_read).length;

    const fetchMessages = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(API_URL, {
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Unable to load messages.");
            }

            setMessages(data.items || []);
        } catch (err) {
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const markAsRead = async (message) => {
        if (message.is_read) return;

        setActionLoading(true);

        try {
            const response = await fetch(
                `${API_URL}/${message.id}/read`,
                {
                    method: "PATCH",
                    credentials: "include",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Unable to mark message as read.");
            }

            setMessages((previous) =>
                previous.map((item) =>
                    item.id === message.id
                        ? { ...item, is_read: true }
                        : item
                )
            );

            setSelectedMessage((previous) =>
                previous?.id === message.id
                    ? { ...previous, is_read: true }
                    : previous
            );

            setNotice("Message marked as read.");
        } catch (err) {
            setError(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const deleteMessage = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this message?"
        );

        if (!confirmed) return;

        setActionLoading(true);

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Unable to delete message.");
            }

            setMessages((previous) =>
                previous.filter((message) => message.id !== id)
            );

            setSelectedMessage(null);
            setNotice("Message deleted successfully.");
        } catch (err) {
            setError(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const openMessage = async (message) => {
        setSelectedMessage(message);
        await markAsRead(message);
    };

    const filteredMessages = messages.filter((message) => {
        const term = search.toLowerCase();

        return (
            message.name.toLowerCase().includes(term) ||
            message.email.toLowerCase().includes(term) ||
            message.message.toLowerCase().includes(term)
        );
    });

    const formatDate = (date) => {
        if (!date) return "Date unavailable";

        return new Date(date).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    };

    return (
        <div className="min-h-screen bg-[#080d0f] p-5 text-white sm:p-8">

            {/* HEADER */}
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="mb-2 text-xs font-bold tracking-[3px] text-[#ffd65a]">
                        CUSTOMER COMMUNICATION
                    </p>

                    <h1 className="text-3xl font-bold">
                        Contact Messages
                    </h1>

                    <p className="mt-2 text-sm text-zinc-400">
                        Manage messages received from your customers.
                    </p>
                </div>

                <button
                    onClick={fetchMessages}
                    disabled={loading}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm hover:bg-white/10 disabled:opacity-50"
                >
                    <RefreshCw
                        size={16}
                        className={loading ? "animate-spin" : ""}
                    />
                    Refresh
                </button>
            </div>

            {/* STATISTICS */}
            <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-[#11191c] p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-zinc-400">Total Messages</p>
                            <h2 className="mt-2 text-3xl font-bold">
                                {messages.length}
                            </h2>
                        </div>

                        <div className="rounded-xl bg-yellow-400/10 p-3 text-[#ffd65a]">
                            <MessageSquare size={23} />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#11191c] p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-zinc-400">Unread Messages</p>
                            <h2 className="mt-2 text-3xl font-bold">
                                {unreadCount}
                            </h2>
                        </div>

                        <div className="rounded-xl bg-blue-400/10 p-3 text-blue-400">
                            <Mail size={23} />
                        </div>
                    </div>
                </div>
            </div>

            {/* SEARCH */}
            <div className="mb-6">
                <div className="flex max-w-lg items-center gap-3 rounded-xl border border-white/10 bg-[#11191c] px-4 py-3">
                    <Search size={18} className="text-zinc-500" />

                    <input
                        type="text"
                        placeholder="Search name, email or message..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-500"
                    />
                </div>
            </div>

            {/* NOTIFICATIONS */}
            {notice && (
                <div className="mb-5 flex items-center justify-between rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                    {notice}
                    <button onClick={() => setNotice("")}>
                        <X size={16} />
                    </button>
                </div>
            )}

            {error && (
                <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {error}
                </div>
            )}

            {/* MESSAGE LIST */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#11191c]">

                <div className="border-b border-white/10 px-5 py-4">
                    <h2 className="font-semibold">Inbox</h2>
                    <p className="mt-1 text-xs text-zinc-500">
                        {filteredMessages.length} message(s) found
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-16">
                        <Loader2 className="animate-spin text-[#ffd65a]" size={30} />
                    </div>
                ) : filteredMessages.length === 0 ? (
                    <div className="flex flex-col items-center py-16 text-center">
                        <Inbox size={40} className="mb-3 text-zinc-600" />
                        <p className="font-medium">No messages found</p>
                        <p className="mt-1 text-sm text-zinc-500">
                            Customer messages will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {filteredMessages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex flex-col gap-4 p-5 transition hover:bg-white/[0.03] sm:flex-row sm:items-center sm:justify-between ${!message.is_read ? "bg-yellow-400/[0.03]" : ""
                                    }`}
                            >
                                <button
                                    onClick={() => openMessage(message)}
                                    className="flex min-w-0 flex-1 items-start gap-4 text-left"
                                >
                                    <div className="rounded-xl bg-white/5 p-3 text-[#ffd65a]">
                                        {message.is_read ? (
                                            <MailOpen size={20} />
                                        ) : (
                                            <Mail size={20} />
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="font-semibold">
                                                {message.name}
                                            </h3>

                                            {!message.is_read && (
                                                <span className="rounded-full bg-yellow-400/10 px-2 py-1 text-[10px] font-bold text-[#ffd65a]">
                                                    NEW
                                                </span>
                                            )}
                                        </div>

                                        <p className="mt-1 text-sm text-zinc-400">
                                            {message.email}
                                        </p>

                                        <p className="mt-2 truncate text-sm text-zinc-500">
                                            {message.message}
                                        </p>

                                        <p className="mt-2 flex items-center gap-2 text-xs text-zinc-600">
                                            <Clock size={12} />
                                            {formatDate(message.created_at)}
                                        </p>
                                    </div>
                                </button>

                                <button
                                    onClick={() => deleteMessage(message.id)}
                                    disabled={actionLoading}
                                    title="Delete message"
                                    className="self-end rounded-lg p-2 text-zinc-500 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50 sm:self-center"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* MESSAGE DETAILS MODAL */}
            {selectedMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
                    <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-[#11191c] p-6 shadow-2xl">

                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-bold">
                                Message Details
                            </h2>

                            <button
                                onClick={() => setSelectedMessage(null)}
                                className="rounded-lg p-2 text-zinc-400 hover:bg-white/10"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="mb-5 flex items-center gap-3">
                            <div className="rounded-xl bg-yellow-400/10 p-3 text-[#ffd65a]">
                                <UserRound size={22} />
                            </div>

                            <div>
                                <h3 className="font-semibold">
                                    {selectedMessage.name}
                                </h3>
                                <p className="text-sm text-zinc-400">
                                    {selectedMessage.email}
                                </p>
                            </div>
                        </div>

                        <div className="mb-5 rounded-xl bg-white/5 p-4">
                            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
                                Customer Message
                            </p>

                            <p className="whitespace-pre-wrap break-words text-sm leading-7 text-zinc-200">
                                {selectedMessage.message}
                            </p>
                        </div>

                        <p className="mb-6 text-xs text-zinc-500">
                            Received: {formatDate(selectedMessage.created_at)}
                        </p>

                        <div className="flex flex-wrap justify-end gap-3">
                            <button
                                onClick={() => deleteMessage(selectedMessage.id)}
                                disabled={actionLoading}
                                className="flex items-center gap-2 rounded-xl border border-red-500/20 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                            >
                                <Trash2 size={16} />
                                Delete
                            </button>

                            <a
                                href={`mailto:${selectedMessage.email}`}
                                className="rounded-xl bg-[#ffd65a] px-5 py-3 text-sm font-bold text-black hover:bg-yellow-300"
                            >
                                Reply by Email
                            </a>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
