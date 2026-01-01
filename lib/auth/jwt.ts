import jwt from "jsonwebtoken";

// Environment variables validation
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET;

if (!ADMIN_JWT_SECRET) {
  throw new Error("ADMIN_JWT_SECRET environment variable is not defined");
}

// JWT payload interface
export interface JWTPayload {
  role: "admin";
  iat?: number;
  exp?: number;
}

// Token generation options
const TOKEN_EXPIRY = "7d"; // 7 days

/**
 * Generate a JWT token for admin
 */
export function generateAdminToken(): string {
  const payload: JWTPayload = {
    role: "admin",
  };

  return jwt.sign(payload, ADMIN_JWT_SECRET!, {
    expiresIn: TOKEN_EXPIRY,
  });
}

/**
 * Verify and decode a JWT token
 * Returns the payload if valid, null if invalid
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, ADMIN_JWT_SECRET!) as JWTPayload;
    
    // Verify role
    if (decoded.role !== "admin") {
      return null;
    }

    return decoded;
  } catch (error) {
    // Token is invalid, expired, or malformed
    return null;
  }
}

/**
 * Extract token from Authorization header
 * Expected format: "Bearer <token>"
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(" ");
  
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return null;
  }

  return parts[1];
}

