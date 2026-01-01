import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";

interface HeroProps {
  title: string;
  subtitle: string;
  primaryButton?: {
    text: string;
    href: string;
  };
  socialLinks?: {
    github?: string;
    linkedin?: string;
  };
}

export default function Hero({
  title,
  subtitle,
  primaryButton,
  socialLinks,
}: HeroProps) {
  return (
    <section className="neo-container min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Tech Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, #000 1px, transparent 1px),
              linear-gradient(to bottom, #000 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Floating Code Blocks */}
        <div className="absolute top-20 left-10 w-48 h-32 bg-neo-yellow border-4 border-neo-black shadow-neo transform -rotate-6 p-4 font-mono text-xs overflow-hidden">
          <div className="text-neo-black">
            <span className="text-neo-pink">const</span> dev = &#123;
            <br />
            &nbsp;&nbsp;code: <span className="text-neo-blue">"clean"</span>,
            <br />
            &nbsp;&nbsp;design: <span className="text-neo-blue">"bold"</span>
            <br />
            &#125;;
          </div>
        </div>

        {/* Geometric Shapes */}
        <div className="absolute top-40 right-20 w-32 h-32 bg-neo-pink border-4 border-neo-black shadow-neo transform rotate-12" />

        <div className="absolute bottom-32 left-20 w-40 h-40 bg-neo-blue border-4 border-neo-black shadow-neo transform rotate-45" />

        <div className="absolute bottom-20 right-32 w-24 h-24 rounded-full bg-neo-green border-4 border-neo-black shadow-neo" />

        {/* Terminal Window */}
        <div className="absolute bottom-40 right-10 w-56 bg-neo-white border-4 border-neo-black shadow-neo transform rotate-3">
          <div className="bg-neo-black text-neo-white px-3 py-2 font-mono text-xs flex gap-2 items-center">
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-full bg-neo-pink border-2 border-neo-black" />
              <div className="w-3 h-3 rounded-full bg-neo-yellow border-2 border-neo-black" />
              <div className="w-3 h-3 rounded-full bg-neo-green border-2 border-neo-black" />
            </div>
            <span>~/terminal</span>
          </div>
          <div className="p-3 font-mono text-xs text-neo-black">
            <div className="text-neo-green">$ npm run build</div>
            <div className="text-neo-blue">✓ Compiled successfully</div>
          </div>
        </div>

        {/* Circuit Board Elements */}
        <div className="absolute top-1/2 left-5 w-20 h-20 border-4 border-neo-orange bg-transparent transform -rotate-12" />
        <div className="absolute top-2/5 right-40 w-16 h-16 border-4 border-neo-blue bg-transparent rounded-full" />
      </div>

      {/* Content */}
      <div className="max-w-4xl w-full text-center relative z-10">
        {/* Main Title */}
        <h1 className="text-6xl md:text-8xl font-black mb-6 leading-none tracking-tight">
          {title}
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl font-bold mb-12 max-w-3xl mx-auto px-4">
          {subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12 mt-8">
          {primaryButton && (
            <a href={primaryButton.href} className="neo-btn text-lg px-8 py-4">
              {primaryButton.text}
            </a>
          )}

          {/* Social Links */}
          {socialLinks && (
            <div className="flex gap-4">
              {socialLinks.github && (
                <Link
                  href={socialLinks.github as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neo-btn bg-neo-white hover:bg-neo-white px-6 py-4 gap-2"
                  aria-label="GitHub"
                >
                  <FaGithub className="w-6 h-6" />
                  <span>GitHub</span>
                </Link>
              )}

              {socialLinks.linkedin && (
                <Link
                  href={socialLinks.linkedin as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neo-btn bg-neo-white hover:bg-neo-white px-6 py-4 flex flex-row items-center gap-2"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin className="w-6 h-6" />
                  <span>LinkedIn</span>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
