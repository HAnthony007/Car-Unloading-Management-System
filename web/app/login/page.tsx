import { Login } from "@/features/auth/login";
import { RedirectNotice } from "./redirect-notice";

export default function LoginPage() {
  return (
    <div className="min-h-full size-full">
  <RedirectNotice />
      <Login />
    </div>
  );
}
