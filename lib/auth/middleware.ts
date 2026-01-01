import { NextRequest, NextResponse } from "next/server";
import { extractTokenFromHeader, verifyToken } from "./jwt";

/**
 * Admin authentication middleware
 * 
 * Verifies JWT token and ensures user has admin role.
 * Returns error response if authentication fails, or null if successful.
 * 
 * Usage:
 * ```typescript
 * const authError = await authenticateAdmin(request);
 * if (authError) return authError;
 * // Continue with authenticated logic
 * ```
 */
export function authenticateAdmin(request: NextRequest): NextResponse | null {
  // Extract Authorization header
  const authHeader = request.headers.get("Authorization");
  const token = extractTokenFromHeader(authHeader);

  if (!token) {
    return NextResponse.json(
      {
        error: "Unauthorized",
        details: "Missing or invalid Authorization header. Expected format: Bearer <token>",
      },
      { status: 401 }
    );
  }

  // Verify token
  const payload = verifyToken(token);

  if (!payload) {
    return NextResponse.json(
      {
        error: "Unauthorized",
        details: "Invalid or expired token",
      },
      { status: 401 }
    );
  }

  // Verify role
  if (payload.role !== "admin") {
    return NextResponse.json(
      {
        error: "Forbidden",
        details: "Admin access required",
      },
      { status: 403 }
    );
  }

  // Authentication successful
  return null;
}

/**
 * Validate admin credentials against environment variables
 */
export function validateAdminCredentials(
  username: string,
  password: string
): boolean {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUsername || !adminPassword) {
    throw new Error(
      "ADMIN_USERNAME and ADMIN_PASSWORD must be set in environment variables"
    );
  }

  return username === adminUsername && password === adminPassword;
}

