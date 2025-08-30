"use client";

import { toast } from "sonner";

export default function DashboardPage() {
  const handleLogout = () => {
    toast.success("Déconnexion réussie !");
  };
  return (
    <div className="flex justify-between items-center p-4 bg-gray-100">
      <button
        type="button"
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Déconnexion
      </button>
    </div>
  );
}
