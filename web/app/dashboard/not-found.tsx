import { BackButton } from "@/components/ui/back-button";

export default function NotFound() {
  return (
    <div className="grid min-h-full place-content-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-black text-gray-200 dark:text-gray-700">
          404
        </h1>

        <p className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl"></p>

        <p className="mt-4 text-gray-500 dark:text-gray-400">
          We can&apos;t find that page.
        </p>
        <BackButton />
      </div>
    </div>
  );
}
