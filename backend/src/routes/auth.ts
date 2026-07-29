import { Hono } from "hono";
import { createDb } from "../db";
import { users, sessions } from "../db/schema";
import { hashPassword, verifyPassword } from "../utils/password";
import { generateToken } from "../utils/jwt";
import { eq } from "drizzle-orm";

const auth = new Hono();

// 注册
auth.post("/register", async (c) => {
  const { email, username, password } = await c.req.json();
  const db = createDb(c.env);

  // 检查用户是否存在
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
});

// 登录
auth.post("/login", async (c) => {
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
});

// 验证当前用户
auth.get("/me", async (c) => {
  const userId = c.get("userId");
  const db = createDb(c.env);

  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  return c.json({
    user: { id: user.id, email: user.email, username: user.username },
  });
});

// 登出 (可选: 可撤销 token)
auth.post("/logout", async (c) => {
  // 客户端清除 token 即可，服务端无状态
  return c.json({ success: true });
});

export default auth;
