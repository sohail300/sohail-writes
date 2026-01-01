import BlogCard from "@/components/BlogCard";
import BlogFilters from "@/components/BlogFilters";
import { siteConfig } from "@/config/site";
import { Metadata } from "next";
import StructuredData from "@/components/StructuredData";
import { generateBreadcrumbSchema } from "@/lib/seo/structured-data";
import connectDB from "@/lib/db";
import Blog from "@/lib/models/Blog";

interface BlogType {
  _id: string;
  title: string;
  excerpt: string;
  platform: string;
  url: string;
  image: string;
  publishedAt: string;
  tags: string[];
}

async function fetchBlogs(searchParams: {
  [key: string]: string | string[] | undefined;
}): Promise<BlogType[]> {
  try {
    await connectDB();

    // Parse query parameters (matching API route logic)
    const platforms = searchParams.platform
      ? Array.isArray(searchParams.platform)
        ? searchParams.platform
        : [searchParams.platform]
      : [];
    const tags = searchParams.tag
      ? Array.isArray(searchParams.tag)
        ? searchParams.tag
        : [searchParams.tag]
      : [];
    const search = searchParams.search as string | undefined;
    const page = Math.max(1, parseInt((searchParams.page as string) || "1"));
    const limit = Math.min(
      100,
      Math.max(1, parseInt((searchParams.limit as string) || "10"))
    );
    const sort = ((searchParams.sort as string) || "desc") as "asc" | "desc";

    // Build query
    const query: any = { isPublished: true };

    // Handle platform filter
    if (platforms.length > 0) {
      query.platform = { $in: platforms };
    }

    // Handle tags filter
    if (tags.length > 0) {
      query.tags = { $in: tags };
    }

    // Handle search
    if (search && search.trim()) {
      query.title = { $regex: search.trim(), $options: "i" };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build sort order
    const sortOrder: any = { publishedAt: sort === "asc" ? 1 : -1 };

    // Fetch blogs with pagination and sorting
    const blogs = await Blog.find(query)
      .sort(sortOrder)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    // Convert MongoDB documents to plain objects with string _id
    return blogs.map((blog: any) => ({
      _id: blog._id.toString(),
      title: blog.title,
      excerpt: blog.excerpt,
      platform: blog.platform,
      url: blog.url,
      image: blog.image,
      publishedAt: blog.publishedAt.toString(),
      tags: blog.tags,
    }));
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

// Enable ISR with 24-hour revalidation
export const revalidate = 86400; // 24 hours

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const blogs = await fetchBlogs(searchParams);

  // Generate breadcrumb structured data
  const breadcrumbData = generateBreadcrumbSchema([
    { name: "Home", url: siteConfig.url },
    { name: "Blogs", url: `${siteConfig.url}/blogs` },
  ]);

  return (
    <>
      <StructuredData data={breadcrumbData} />

      <main className="min-h-screen pt-24 bg-neo-gray pb-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-black mb-2">
                All Blogs
              </h1>
              <p className="text-base font-bold text-neo-gray-dark">
                Explore articles on Backend Engineering, Databases and System
                design
              </p>
            </div>

            {/* Filters Button */}
            <BlogFilters />
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-base font-bold">
              {blogs.length === 0 ? (
                "No blogs found"
              ) : (
                <>
                  Showing <span className="font-black">{blogs.length}</span>{" "}
                  {blogs.length === 1 ? "blog" : "blogs"}
                </>
              )}
            </p>
          </div>

          {/* Blog Grid */}
          {blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
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
          ) : (
            /* Empty State */
            <div className="neo-card bg-neo-white text-center py-20">
              <div className="text-6xl mb-6">📝</div>
              <h3 className="text-3xl font-black mb-4">No Blogs Found</h3>
              <p className="text-xl font-bold text-neo-gray-dark mb-6">
                Try adjusting your filters or search terms
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

// Generate metadata for SEO
export async function generateMetadata({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}): Promise<Metadata> {
  const search = searchParams.search as string | undefined;
  const platform = searchParams.platform as string | string[] | undefined;
  const tag = searchParams.tag as string | string[] | undefined;

  let title = "All Blogs";
  let description =
    "Explore articles on backend engineering, databases, and system design.";

  if (search) {
    title = `Search: ${search}`;
    description = `Search results for "${search}" - Articles on backend engineering, databases, and system design.`;
  } else if (platform) {
    const platformStr = Array.isArray(platform)
      ? platform.join(", ")
      : platform;
    title = `${platformStr} Articles`;
    description = `Articles published on ${platformStr} - Backend engineering, databases, and system design.`;
  } else if (tag) {
    const tagStr = Array.isArray(tag) ? tag.join(", ") : tag;
    title = `${tagStr} Articles`;
    description = `Articles tagged with ${tagStr} - Backend engineering, databases, and system design.`;
  }

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      type: "website",
      url: `${siteConfig.url}/blogs`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.name}`,
      description,
    },
    alternates: {
      canonical: `${siteConfig.url}/blogs`,
    },
  };
}
