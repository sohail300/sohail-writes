import { FaCalendar, FaDev, FaGlobe } from "react-icons/fa";
import { FaHashnode, FaMedium } from "react-icons/fa6";

interface BlogCardProps {
  title: string;
  excerpt: string;
  platform: string;
  url: string;
  image: string;
  publishedAt: string;
  tags?: string[];
}

export default function BlogCard({
  title,
  excerpt,
  platform,
  url,
  image,
  publishedAt,
  tags = [],
}: BlogCardProps) {
  // Format date to readable format
  const formattedDate = new Date(publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
    >
      <article className="neo-card transition-all duration-200 bg-neo-white">
        {/* Image */}
        <div className="w-full h-48 border-4 border-neo-black mb-4 overflow-hidden bg-neo-gray">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-200"
          />
        </div>

        {/* Content */}
        <div className="space-y-3">
          {/* Platform Badge */}
          <div className="flex flex-col items-start gap-2">
            <span className="flex items-center justify-start gap-2 text-sm font-semibold text-neo-black">
              Platform:
              {platform === "Medium" && <FaMedium size={16} color="#000000" />}
              {platform === "Hashnode" && (
                <FaHashnode size={16} color="#2962ff" />
              )}
              {platform === "Dev.to" && <FaDev size={16} />}
              {platform === "Other" && <FaGlobe size={16} />}
            </span>
            <div className="text-sm font-semibold text-neo-black flex items-center justify-start gap-2">
              Published: {formattedDate}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-black leading-tight group-hover:underline">
            {title}
          </h3>

          {/* Excerpt */}
          <p className="font-bold text-neo-gray-dark line-clamp-3">{excerpt}</p>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="border-2 border-neo-black bg-neo-gray px-2 py-1 text-xs font-bold"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="text-xs font-bold text-neo-gray-dark py-1">
                  +{tags.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Read More Indicator */}
          <div className="flex items-center gap-2 pt-2">
            <span className="font-black text-sm group-hover:translate-x-2 transition-transform duration-200">
              Read Article →
            </span>
          </div>
        </div>
      </article>
    </a>
  );
}
