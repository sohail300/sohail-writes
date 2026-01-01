import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Blog from "@/lib/models/Blog";
import { authenticateAdmin } from "@/lib/auth/middleware";

// GET /api/admin/blogs - Fetch ALL blogs (published and unpublished) for admin
export async function GET(request: NextRequest) {
  try {
    // Authenticate admin
    const authError = await authenticateAdmin(request);
    if (authError) {
      return authError;
    }

    await connectDB();

    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const platforms = searchParams.getAll("platform");
    const tags = searchParams.getAll("tag");
    const search = searchParams.get("search");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "100")));
    const sort = (searchParams.get("sort") || "desc") as "asc" | "desc";

    // Build query (NO isPublished filter for admin)
    const query: any = {};

    // Handle platform filter (array)
    if (platforms.length > 0) {
      query.platform = { $in: platforms };
    }

    // Handle tags filter (array)
    if (tags.length > 0) {
      query.tags = { $in: tags };
    }

    // Handle search - case-insensitive search on title
    if (search && search.trim()) {
      query.title = { $regex: search.trim(), $options: "i" };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build sort order - sort by createdAt (newest first) for admin view
    const sortOrder: any = { createdAt: sort === "asc" ? 1 : -1 };

    // Execute query with pagination
    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .sort(sortOrder)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      Blog.countDocuments(query),
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: blogs,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    });
  } catch (error: any) {
    console.error("Error fetching admin blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

