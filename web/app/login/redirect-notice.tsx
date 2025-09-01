"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export function RedirectNotice() {
  const params = useSearchParams();
  const shownRef = useRef(false);

  useEffect(() => {
    if (shownRef.current) return;
    const reason = params.get("reason");
    if (!reason) return;
    shownRef.current = true;

    const from = params.get("from");
    let message = "Vous avez été redirigé vers la page de connexion.";
    if (reason === "unauthenticated") {
      message = "Session expirée ou non connectée. Veuillez vous connecter.";
    } else if (reason === "forbidden") {
      message = "Accès refusé. Veuillez vous connecter avec un compte autorisé.";
    }
    if (from) {
      try {
        const path = decodeURIComponent(from);
        if (path && path !== "/") message += ` Après connexion, vous serez renvoyé vers ${path}.`;
      } catch {}
    }
    toast.info(message, { duration: 5000 });
  }, [params]);

  return null;
}
