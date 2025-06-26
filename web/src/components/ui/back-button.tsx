"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Button } from "./button";

export const BackButton = ({
    className,
    ...props
}: React.ComponentProps<"button">) => {
    const router = useRouter();
    return (
        <Button
            onClick={() => router.back()}
            className={cn(
                `${className} mt-6 inline-block rounded-sm px-5 text-sm font-medium focus:ring-3 focus:outline-hidden cursor-pointer`
            )}
            {...props}
        >
            Go Back
        </Button>
    );
};
