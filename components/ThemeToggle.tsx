"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder with the same dimensions to avoid layout shift
    return (
      <button
        className="neo-btn bg-neo-white w-12 h-12 p-0 flex items-center justify-center"
        aria-label="Toggle theme"
        disabled
      >
        <span className="text-2xl">●</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="neo-btn bg-neo-yellow hover:bg-neo-yellow w-12 h-12 p-0 flex items-center justify-center group"
      aria-label="Toggle theme"
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <span className="text-2xl group-hover:scale-110 transition-transform">
          ☀️
        </span>
      ) : (
        <span className="text-2xl group-hover:scale-110 transition-transform">
          🌙
        </span>
      )}
    </button>
  );
}

