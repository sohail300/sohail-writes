import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="neo-container">
      <nav className="max-w-7xl mx-auto flex justify-between items-center py-6">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl md:text-3xl font-black no-underline hover:no-underline"
        >
          Sohail Writes
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-4">
          <Link
            href="/blogs"
            className="neo-btn bg-neo-white hover:bg-neo-white text-sm md:text-base px-4 py-2 md:px-6 md:py-3"
          >
            Blogs
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}

