import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Blog from "@/lib/models/Blog";

// GET /api/blogs/filters - Fetch all available platforms and tags
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Fetch all published blogs and extract platforms and tags
    const blogs = await Blog.find({ isPublished: true })
      .select("tags")
      .lean()
      .exec();

    // Extract unique tags
    const tags = Array.from(
      new Set(
        blogs
          .flatMap((blog: any) => blog.tags || [])
          .filter(Boolean)
      )
    ).sort();

    return NextResponse.json({
      data: {
        tags,
      },
      meta: {
        tagCount: tags.length,
        totalBlogs: blogs.length,
      },
    });
  } catch (error: any) {
    console.error("Error fetching filters:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch filters",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

