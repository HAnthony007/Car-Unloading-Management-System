import { Skeleton } from "@/components/ui/skeleton";

export const LoginFormSkeleton = () => (
  <form className="grid gap-4">
    <div>
      <div className="mb-1 h-5 w-16">
        <Skeleton className="h-5 w-16" /> {/* Email label */}
      </div>
      <Skeleton className="h-10 w-full" /> {/* Email input */}
    </div>
    <div>
      <div className="mb-1 h-5 w-24">
        <Skeleton className="h-5 w-24" /> {/* Password label */}
      </div>
      <Skeleton className="h-10 w-full" /> {/* Password input */}
    </div>
    <Skeleton className="h-10 w-full mt-2" /> {/* Submit button */}
  </form>
);
