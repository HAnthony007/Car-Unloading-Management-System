"use client";

import { useLogout, useMe } from "@/features/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function DashboardPage() {
  const { data: user } = useMe();
  const { mutate: logout } = useLogout();
  const router = useRouter();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        toast.success("Déconnexion réussie !");
        router.replace("/login");
      },
      onError: (error) => {
        toast.error((error as Error).message);
      },
    });
  };

  return (
    <div className="flex justify-between items-center p-4 bg-gray-100">
      <button
        type="button"
        onClick={handleLogout}
        className="bg-red-500 px-4 py-2 rounded"
      >
        Déconnexion
      </button>
      <button
        type="button"
        onClick={() => console.log("User data:", user)}
        className="bg-green-500 px-4 py-2 rounded"
      >
        getMe
      </button>
    </div>
  );
}
