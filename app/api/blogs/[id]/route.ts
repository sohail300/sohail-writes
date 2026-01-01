import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Blog from "@/lib/models/Blog";
import { isValidObjectId } from "mongoose";
import { authenticateAdmin } from "@/lib/auth/middleware";

/**
 * GET /api/blogs/[id] - Fetch a single blog by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Validate ObjectId format
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid blog ID format",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const blog = await Blog.findById(id).lean();

    if (!blog) {
      return NextResponse.json(
        {
          success: false,
          error: "Blog not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: blog,
    });
  } catch (error: any) {
    console.error("Error fetching blog:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch blog",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/blogs/[id] - Update a blog by ID (Admin only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Authenticate admin
  const authError = authenticateAdmin(request);
  if (authError) return authError;
  
  try {
    const { id } = await params;
    
    // Validate ObjectId format
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid blog ID format",
        },
        { status: 400 }
      );
    }

    await connectDB();

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON body",
        },
        { status: 400 }
      );
    }

    // Prevent updating certain fields
    delete body._id;
    delete body.createdAt;

    // Check if URL is being changed and if it already exists
    if (body.url) {
      const existingBlog = await Blog.findOne({
        url: body.url,
        _id: { $ne: id },
      });

      if (existingBlog) {
        return NextResponse.json(
          {
            success: false,
            error: "Blog with this URL already exists",
            details: { url: body.url },
          },
          { status: 409 }
        );
      }
    }

    const blog = await Blog.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!blog) {
      return NextResponse.json(
        {
          success: false,
          error: "Blog not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: blog,
      message: "Blog updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating blog:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const validationErrors: Record<string, string> = {};
      Object.keys(error.errors).forEach((key) => {
        validationErrors[key] = error.errors[key].message;
      });

      return NextResponse.json(
        {
          success: false,
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
          success: false,
          error: "Duplicate entry",
          details: error.keyPattern,
        },
        { status: 409 }
      );
    }

    // Handle cast errors
    if (error.name === "CastError") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid data format",
          details: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update blog",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/blogs/[id] - Delete a blog by ID (Admin only)
 * 
 * Requires: Authorization header with Bearer token
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Authenticate admin
  const authError = authenticateAdmin(request);
  if (authError) return authError;
  
  try {
    const { id } = await params;
    
    // Validate ObjectId format
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid blog ID format",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return NextResponse.json(
        {
          success: false,
          error: "Blog not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Blog deleted successfully",
      data: {
        id: id,
        title: blog.title,
      },
    });
  } catch (error: any) {
    console.error("Error deleting blog:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete blog",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

