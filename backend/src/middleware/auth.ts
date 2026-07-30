import { Context, Next } from "hono";
import { verifyToken } from "../utils/jwt";

export async function authMiddleware(c: Context, next: Next) {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return c.json({ error: "Missing or invalid Authorization header" }, 401);
    }

    const token = authHeader.slice(7);
    const secret = c.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET is not set in environment");
      return c.json({ error: "Server configuration error" }, 500);
    }

    const payload = await verifyToken(token, secret);
    if (!payload) {
      return c.json({ error: "Invalid or expired token" }, 401);
    }

    c.set("userId", payload.userId as string);
    c.set("user", payload);
    await next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return c.json({ error: String(err) }, 500);
  }
}
