import { Skeleton } from "@/components/ui/skeleton";

export const RegisterFormSkeleton = () => (
    <form className="grid gap-4">
        {/* Name */}
        <div>
            <div className="mb-1 h-5 w-16">
                <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-10 w-full" />
        </div>
        {/* Email */}
        <div>
            <div className="mb-1 h-5 w-16">
                <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-10 w-full" />
        </div>
        {/* Password */}
        <div>
            <div className="mb-1 h-5 w-24">
                <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="h-10 w-full" />
        </div>
        {/* Password confirmation */}
        <div>
            <div className="mb-1 h-5 w-24">
                <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-full mt-2" /> {/* Submit button */}
    </form>
);
