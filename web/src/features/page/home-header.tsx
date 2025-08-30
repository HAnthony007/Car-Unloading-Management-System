import Image from "next/image";
import Link from "next/link";
import { ToggleTheme } from "../theme/theme-toogle";

export const HomeHeader = () => {
  return (
    <header className="z-10 flex items-center justify-between px-4 py-2 border-b border-accent backdrop-blur-sm sticky top-0">
      <span>
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-lg"
        >
          <Image
            src="/SMMC_Logo.png"
            alt="smmc-logo"
            width={100}
            height={100}
            className="items-center justify-center flex"
          />
        </Link>
      </span>
      <div className="flex-1"></div>
      <div className="flex gap-2 justify-center items-center">
        {/* <Link href="/login">
                    <Button>Login</Button>
                </Link> */}
        {/* <Link href="/signup">
                    <Button variant="outline">Signup</Button>
                </Link> */}
        <ToggleTheme />
      </div>
    </header>
  );
};
