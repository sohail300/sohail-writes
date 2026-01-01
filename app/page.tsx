import { Metadata } from "next";
import Hero from "./components/Hero";
import BlogCard from "@/components/BlogCard";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import StructuredData from "@/components/StructuredData";
import {
  generateWebsiteSchema,
  generatePersonSchema,
} from "@/lib/seo/structured-data";

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  platform: string;
  url: string;
  image: string;
  publishedAt: string;
  tags: string[];
}

interface ApiResponse {
  data: Blog[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

async function fetchLatestBlogs(): Promise<Blog[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const response = await fetch(`${baseUrl}/api/blogs?limit=6&sort=desc`, {
      next: { revalidate: 86400 }, // ISR: Revalidate every 24 hours
    });

    if (!response.ok) {
      return [];
    }

    const data: ApiResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
    return [];
  }
}

export const metadata: Metadata = {
  title: "Home",
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    type: "website",
    url: siteConfig.url,
  },
  alternates: {
    canonical: siteConfig.url,
  },
};

export default async function Home() {
  const latestBlogs = await fetchLatestBlogs();

  return (
    <>
      <StructuredData data={generateWebsiteSchema()} />
      <StructuredData data={generatePersonSchema()} />

      <main>
        <Hero
          title="Sohail Writes"
          subtitle="Thoughts on Backend, Databases & System Design."
          primaryButton={{
            text: "Read Blogs",
            href: "/blogs",
          }}
          socialLinks={{
            github: "https://github.com/sohail300",
            linkedin: "https://www.linkedin.com/in/md-sohail-ansari-b51201278/",
          }}
        />

        {/* Latest Blogs Section */}
        {latestBlogs.length > 0 && (
          <section className="neo-container py-20">
            <div className="max-w-7xl mx-auto">
              {/* Section Header */}
              <div className="flex justify-between items-center mb-12 flex-wrap gap-4">
                <div>
                  <h2 className="text-4xl md:text-6xl font-black mb-2">
                    Latest Blogs
                  </h2>
                  <p className="text-lg font-bold text-neo-gray-dark">
                    Fresh insights and technical deep-dives
                  </p>
                </div>
                <Link
                  href="/blogs"
                  className="neo-btn bg-neo-yellow hover:bg-neo-yellow"
                >
                  View All Blogs →
                </Link>
              </div>

              {/* Blog Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {latestBlogs.map((blog) => (
                  <BlogCard
                    key={blog._id}
                    title={blog.title}
                    excerpt={blog.excerpt}
                    platform={blog.platform}
                    url={blog.url}
                    image={blog.image}
                    publishedAt={blog.publishedAt}
                    tags={blog.tags}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
