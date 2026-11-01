
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Loader2, ShieldCheck } from "lucide-react";

import { getCurrentAdmin } from "../services/api";

export default function AdminProtectedRoute() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const verifyAdmin = async () => {
            try {
                const admin = await getCurrentAdmin();

                if (isMounted) {
                    setIsAdmin(Boolean(admin?.is_admin));
                }
            } catch (error) {
                console.error("Admin verification failed:", error);

                if (isMounted) {
                    setIsAdmin(false);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        verifyAdmin();

        return () => {
            isMounted = false;
        };
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#080d0f] text-white">
                <Loader2
                    size={35}
                    className="animate-spin text-[#ffd65a]"
                />
                <p className="mt-4 text-sm text-zinc-400">
                    Verifying administrator access...
                </p>
            </div>
        );
    }

    if (!isAdmin) {
        return <Navigate to="/admin-login" replace />;
    }

    return <Outlet />;
}
