import { Hono } from "hono";
import { cors } from "hono/cors";
import auth from "./routes/auth";
import members from "./routes/members";
import stats from "./routes/stats";
import settings from "./routes/settings";
import { authMiddleware } from "./middleware/auth";

type Bindings = {
  DB: D1Database;
  JWT_SECRET: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// 全局错误处理（关键：捕获所有未处理异常，返回详细错误）
app.onError((err, c) => {
  console.error("❌ Global error:", err);
  return c.json(
    {
      error: err.message || "Internal Server Error",
      stack: err.stack, // 开发时保留，生产可移除
    },
    500
  );
});

// CORS - 动态允许来源
app.use("*", cors({
  origin: (origin) => {
    const allowed = [
      "http://localhost:5173",
      "https://zupu.19860519.xyz", // 替换为您的实际前端域名
    ];
    if (!origin || allowed.includes(origin)) return origin;
    return null;
  },
  credentials: true,
}));

// 公开路由
app.route("/api/auth", auth);

// 受保护路由
app.use("/api/*", authMiddleware);
app.route("/api/members", members);
app.route("/api/stats", stats);
app.route("/api/settings", settings);

export default app;
