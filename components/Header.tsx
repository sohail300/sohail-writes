import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <nav className="w-full mx-auto py-2 fixed top-0 left-0 right-0 z-50 bg-neo-white">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
        {/* Logo */}
        <Link href="/" className="text-lg md:text-xl font-black">
          <Image src="/logo.png" alt="Sohail Writes" width={100} height={100} />
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-4">
          <Link
            href="/blogs"
            className="neo-btn bg-neo-yellow hover:bg-neo-yellow"
          >
            Blogs
          </Link>
        </div>
      </div>
    </nav>
  );
}
