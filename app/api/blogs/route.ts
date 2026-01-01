import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Blog from "@/lib/models/Blog";
import { authenticateAdmin } from "@/lib/auth/middleware";

// GET /api/blogs - Fetch all published blogs
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const platforms = searchParams.getAll("platform");
    const tags = searchParams.getAll("tag");
    const search = searchParams.get("search");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "10")));
    const sort = (searchParams.get("sort") || "desc") as "asc" | "desc";

    // Build query
    const query: any = { isPublished: true };

    // Handle platform filter (array)
    if (platforms.length > 0) {
      query.platform = { $in: platforms };
    }

    // Handle tags filter (array) - blog must have AT LEAST ONE tag (OR logic)
    if (tags.length > 0) {
      query.tags = { $in: tags };
    }

    // Handle search - case-insensitive search on title
    if (search && search.trim()) {
      query.title = { $regex: search.trim(), $options: "i" };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build sort order
    const sortOrder: any = { publishedAt: sort === "asc" ? 1 : -1 };

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
    console.error("Error fetching blogs:", error);

    // Handle specific error types
    if (error.name === "CastError") {
      return NextResponse.json(
        {
          error: "Invalid query parameters",
          details: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to fetch blogs",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/blogs - Create a new blog (Admin only)
 */
export async function POST(request: NextRequest) {
  // Authenticate admin
  const authError = authenticateAdmin(request);
  if (authError) return authError;

  try {
    await connectDB();

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        {
          error: "Invalid JSON body",
        },
        { status: 400 }
      );
    }

    // Validate required fields
    const requiredFields = ["title", "excerpt", "platform", "url", "image", "publishedAt"];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          details: { missingFields },
        },
        { status: 400 }
      );
    }

    // Check for duplicate URL
    const existingBlog = await Blog.findOne({ url: body.url });
    if (existingBlog) {
      return NextResponse.json(
        {
          error: "Blog with this URL already exists",
          details: { url: body.url },
        },
        { status: 409 }
      );
    }

    // Create blog
    const blog = await Blog.create(body);

    return NextResponse.json(
      {
        data: blog,
        message: "Blog created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating blog:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const validationErrors: Record<string, string> = {};
      Object.keys(error.errors).forEach((key) => {
        validationErrors[key] = error.errors[key].message;
      });

      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationErrors,
        },
        { status: 400 }
      );
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        {
          error: "Duplicate entry",
          details: error.keyPattern,
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to create blog",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

