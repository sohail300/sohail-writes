"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FaSun } from "react-icons/fa";
import { FaMoon } from "react-icons/fa";

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
      className="w-12 h-12 p-0 flex items-center justify-center group cursor-pointer"
      aria-label="Toggle theme"
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <span className="text-2xl group-hover:scale-110 transition-transform">
          <FaSun className="w-6 h-6" />
        </span>
      ) : (
        <span className="text-2xl group-hover:scale-110 transition-transform">
          <FaMoon className="w-6 h-6" />
        </span>
      )}
    </button>
  );
}
