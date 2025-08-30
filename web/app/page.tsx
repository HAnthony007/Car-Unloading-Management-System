import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl lg:max-w-7xl h-full">
      <div className="grid h-full place-content-center">
        <h1>Hello world</h1>
        <Link href="/login">
          <Button size="lg" className="gap-4 cursor-pointer">
            Login
          </Button>
        </Link>
      </div>
    </div>
  );
}
