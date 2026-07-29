import { Context, Next } from "hono";
import { verifyToken } from "../utils/jwt";

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const token = authHeader.slice(7);
  const secret = c.env.JWT_SECRET;
  const payload = await verifyToken(token, secret);

  if (!payload) {
    return c.json({ error: "Invalid or expired token" }, 401);
  }

  c.set("userId", payload.userId as string);
  c.set("user", payload);
  await next();
}
