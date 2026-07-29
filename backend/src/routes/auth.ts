import { Hono } from "hono";
import { createDb } from "../db";
import { users } from "../db/schema";
import { hashPassword, verifyPassword } from "../utils/password";
import { generateToken } from "../utils/jwt";
import { eq } from "drizzle-orm";

const auth = new Hono();

// 注册
auth.post("/register", async (c) => {
  try {
    const { email, username, password } = await c.req.json();
    const db = createDb(c.env);

    const existing = await db.select().from(users).where(eq(users.email, email));
    if (existing.length > 0) {
      return c.json({ error: "Email already registered" }, 400);
    }

    const existingUsername = await db.select().from(users).where(eq(users.username, username));
    if (existingUsername.length > 0) {
      return c.json({ error: "Username already taken" }, 400);
    }

    const passwordHash = await hashPassword(password);
    const [user] = await db.insert(users).values({
      email,
      username,
      passwordHash,
    }).returning();

    const token = await generateToken(user.id, user.email, user.username, c.env.JWT_SECRET);

    return c.json({
      user: { id: user.id, email: user.email, username: user.username },
      token,
    });
  } catch (err) {
    console.error("Register error:", err);
    return c.json({ error: String(err) }, 500);
  }
});

// 登录
auth.post("/login", async (c) => {
  try {
    const { email, password } = await c.req.json();
    const db = createDb(c.env);

    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) {
      return c.json({ error: "Invalid credentials" }, 401);
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return c.json({ error: "Invalid credentials" }, 401);
    }

    const token = await generateToken(user.id, user.email, user.username, c.env.JWT_SECRET);

    return c.json({
      user: { id: user.id, email: user.email, username: user.username },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    return c.json({ error: String(err) }, 500);
  }
});

// 获取当前用户信息（需要认证）
auth.get("/me", async (c) => {
  try {
    const userId = c.get("userId");
    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const db = createDb(c.env);
    const [user] = await db.select().from(users).where(eq(users.id, userId));

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json({
      user: { id: user.id, email: user.email, username: user.username },
    });
  } catch (err) {
    console.error("Me error:", err);
    return c.json({ error: String(err) }, 500);
  }
});

// 登出（无状态）
auth.post("/logout", async (c) => {
  return c.json({ success: true });
});

export default auth;
