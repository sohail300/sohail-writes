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

  // Get platform color
  const getPlatformColor = (platform: string) => {
    const platformLower = platform.toLowerCase();
    if (platformLower.includes("medium")) return "bg-neo-green";
    if (platformLower.includes("hashnode")) return "bg-neo-blue";
    if (platformLower.includes("dev")) return "bg-neo-yellow";
    return "bg-neo-gray";
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
    >
      <article className="neo-card hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200 dark:hover:shadow-[2px_2px_0px_#fff] hover:shadow-[2px_2px_0px_#000]">
        {/* Image */}
        <div className="w-full h-48 border-4 border-neo-black mb-4 overflow-hidden bg-neo-gray">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>

        {/* Content */}
        <div className="space-y-3">
          {/* Platform Badge */}
          <div className="flex items-center gap-2">
            <span
              className={`inline-block border-4 border-neo-black ${getPlatformColor(
                platform
              )} px-3 py-1 text-xs font-black uppercase text-neo-black dark:text-black`}
            >
              {platform}
            </span>
            <span className="text-sm font-bold text-neo-gray-dark">
              {formattedDate}
            </span>
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
