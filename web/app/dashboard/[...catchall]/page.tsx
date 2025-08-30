import { notFound } from "next/navigation";

// Catch-all route for any unknown /dashboard/* path.
// This ensures the dashboard layout (with sidebar/header) remains visible
// while only the children area renders the 404 UI from app/dashboard/not-found.tsx.
export default function DashboardCatchAllPage() {
  notFound();
}
