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

    // Build query
    const query: any = { isPublished: true };

    // Handle platform filter
    if (searchParams.platform) {
      const platforms = Array.isArray(searchParams.platform)
        ? searchParams.platform
        : [searchParams.platform];
      query.platform = { $in: platforms };
    }

    // Handle tags filter
    if (searchParams.tag) {
      const tags = Array.isArray(searchParams.tag)
        ? searchParams.tag
        : [searchParams.tag];
      query.tags = { $in: tags };
    }

    // Handle search
    if (searchParams.search) {
      query.title = { $regex: searchParams.search as string, $options: "i" };
    }

    // Fetch blogs
    const blogs = await Blog.find(query)
      .sort({ publishedAt: -1 })
      .limit(100)
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

async function fetchAllBlogsForFilters(): Promise<BlogType[]> {
  try {
    await connectDB();

    const blogs = await Blog.find({ isPublished: true })
      .sort({ publishedAt: -1 })
      .limit(1000)
      .lean()
      .exec();

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
    console.error("Error fetching blogs for filters:", error);
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
  const [blogs, allBlogs] = await Promise.all([
    fetchBlogs(searchParams),
    fetchAllBlogsForFilters(),
  ]);

  // Extract unique platforms and tags for filters
  const availablePlatforms = Array.from(
    new Set(allBlogs.map((blog) => blog.platform))
  ).sort();

  const availableTags = Array.from(
    new Set(allBlogs.flatMap((blog) => blog.tags))
  ).sort();

  // Generate breadcrumb structured data
  const breadcrumbData = generateBreadcrumbSchema([
    { name: "Home", url: siteConfig.url },
    { name: "Blogs", url: `${siteConfig.url}/blogs` },
  ]);

  return (
    <>
      <StructuredData data={breadcrumbData} />

      <main className="neo-container min-h-screen py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-5xl md:text-7xl font-black mb-4">All Blogs</h1>
            <p className="text-xl font-bold text-neo-gray-dark">
              Explore articles on backend engineering, databases, and system
              design
            </p>
          </div>

          {/* Filters Section */}
          <div className="mb-12">
            <div className="neo-card bg-neo-white">
              <h2 className="text-2xl font-black mb-6">Filter & Search</h2>
              <BlogFilters
                availablePlatforms={availablePlatforms}
                availableTags={availableTags}
              />
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-8">
            <p className="text-lg font-bold">
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
            <div className="neo-card bg-neo-gray text-center py-20">
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
