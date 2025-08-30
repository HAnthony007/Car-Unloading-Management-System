import { cn } from "@/lib/utils";
import Link from "next/link";
import { type ComponentProps, Suspense } from "react";
import { LoginForm } from "./components/login-form";
import { LoginFormSkeleton } from "./components/login-form-skeleton";

export const Login = ({ className, ...props }: ComponentProps<"div">) => {
  return (
    <div
      className={cn("min-h-full px-6 grid place-items-center", className)}
      {...props}
    >
      <div className="grid gap-10">
        <div className="text-center space-y-2">
          <h3 className="scroll-m-20 text-3xl font-semibold tracking-tight">
            <span className="text-primary-100">Log in</span> to V.U.T
          </h3>
          <p className="text-xl text-muted-foreground">
            Log in to Track and Manage Unloading Vehicles
          </p>
        </div>
        {/* 4.6K gzipped: 1.9k  */}
        <div className="grid gap-4">
          <Suspense fallback={<LoginFormSkeleton />}>
            <LoginForm />
          </Suspense>

          {/* // TODO: add social login  */}

          {/* <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                        <span className="relative z-10 bg-background px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div> */}

          {/* <Suspense fallback={"Loading ..."}>
                        <GithubBtn />
                    </Suspense> */}

          <div className="text-sm font-medium leading-none">
            Don&apos;t have an account?{" "}
            <Link href="/register" prefetch={true} className="underline">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
