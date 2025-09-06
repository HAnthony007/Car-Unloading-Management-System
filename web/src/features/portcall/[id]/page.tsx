export default function PortCallDetailDeprecated() {
    // Duplicate detail page has been deprecated in favor of app route at
    // app/dashboard/port/portcall/[id]/page.tsx
    if (typeof window !== "undefined") {
        window.location.replace("/dashboard/port/portcall");
    }
    return null;
}

