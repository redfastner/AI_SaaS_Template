"use client";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In a real enterprise app, you would log this to a service like Sentry here
    console.error("Optimize Maximal System Critical Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-white dark:bg-zinc-950 border-2 border-black rounded-3xl">
      <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">
        Something went wrong in the Studio
      </h2>
      <p className="text-zinc-500 text-sm mb-8 max-w-md font-medium">
        The Optimize Maximal System encountered an unexpected error. We've been notified and are working on it.
      </p>
      <button
        onClick={() => reset()}
        className="px-8 py-3 bg-black text-white dark:bg-white dark:text-black rounded-full text-xs font-black uppercase tracking-widest hover:opacity-80 transition-all cursor-pointer"
      >
        Try to Restart Module
      </button>
    </div>
  );
}