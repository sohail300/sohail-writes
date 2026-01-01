import { NextRequest, NextResponse } from "next/server";
import { validateAdminCredentials } from "@/lib/auth/middleware";
import { generateAdminToken } from "@/lib/auth/jwt";

/**
 * POST /api/admin/login
 * 
 * Admin login endpoint
 * Validates credentials and returns JWT token
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
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

    const { username, password } = body;

    // Validate required fields
    if (!username || !password) {
      return NextResponse.json(
        {
          error: "Missing credentials",
          details: "Both username and password are required",
        },
        { status: 400 }
      );
    }

    // Validate credentials
    const isValid = validateAdminCredentials(username, password);

    if (!isValid) {
      return NextResponse.json(
        {
          error: "Invalid credentials",
          details: "Username or password is incorrect",
        },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateAdminToken();

    return NextResponse.json({
      token,
    });
  } catch (error: any) {
    console.error("Error in admin login:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

