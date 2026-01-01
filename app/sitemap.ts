import { MetadataRoute } from "next";

interface Blog {
  _id: string;
  title: string;
  publishedAt: string;
  updatedAt?: string;
}

interface ApiResponse {
  data: Blog[];
}

async function fetchAllBlogs(): Promise<Blog[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const response = await fetch(`${baseUrl}/api/blogs?limit=1000`, {
      next: { revalidate: 86400 }, // Revalidate daily
    });

    if (!response.ok) {
      return [];
    }

    const data: ApiResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error("Failed to fetch blogs for sitemap:", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const blogs = await fetchAllBlogs();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  // Dynamic blog URLs (external, but we include them for SEO)
  const blogPages: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: blog.url || `${baseUrl}/blogs`, // Link to blogs page since actual articles are external
    lastModified: blog.updatedAt
      ? new Date(blog.updatedAt)
      : new Date(blog.publishedAt),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...blogPages];
}

