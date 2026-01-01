"use client";

import Link from "next/link";

export default function BlogsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="max-w-4xl mx-auto">
        <div className="neo-card bg-red-100 text-center py-20">
          <div className="text-6xl mb-6">⚠️</div>
          <h1 className="text-4xl font-black mb-4">Something went wrong!</h1>
          <p className="text-xl font-bold text-neo-gray-dark mb-8">
            {error.message || "Failed to load blogs. Please try again."}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={reset}
              className="neo-btn bg-neo-yellow hover:bg-neo-yellow"
            >
              Try Again
            </button>
            <Link href="/" className="neo-btn bg-neo-white hover:bg-neo-white">
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
