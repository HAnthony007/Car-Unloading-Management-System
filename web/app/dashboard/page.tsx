"use client";

import { useLogout, useUser } from "@/features/auth/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const { data: user } = useUser();
    const { mutate: logout } = useLogout();
    const router = useRouter();

    const handleLogout = () => {
        logout(undefined, {
            onSuccess: () => router.push("/login"),
        });
    };
    console.log(user);
    return (
        <div className="flex justify-between items-center p-4 bg-gray-100">
            <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded"
            >
                Déconnexion
            </button>
        </div>
    );
}
