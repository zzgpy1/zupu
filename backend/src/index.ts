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

// ============================================================
// 1. 健康检查（用于快速验证 Worker 是否运行）
// ============================================================
app.get("/", (c) => {
  return c.text("✅ pure-genealogy API is running! Use /api/* endpoints.");
});

// ============================================================
// 2. 全局错误处理
// ============================================================
app.onError((err, c) => {
  console.error("❌ Global error:", err);
  return c.json(
    {
      error: err.message || "Internal Server Error",
      stack: err.stack, // 生产环境可移除
    },
    500
  );
});

// ============================================================
// 3. CORS 配置（明确允许前端域名）
// ============================================================
app.use(
  "*",
  cors({
    origin: (origin) => {
      // 白名单：包含所有可能的前端来源
      const allowed = [
        "http://localhost:5173",                         // 本地开发
        "https://zupu.19860519.xyz",                    // 你的自定义域名
        "https://zupu-main.173385250.workers.dev",      // 前端 Worker 默认域名
      ];
      // 如果请求没有 Origin 头（如 Postman/curl），拒绝
      if (!origin) return null;
      // 检查是否在白名单中
      if (allowed.includes(origin)) return origin;
      // 不在白名单，拒绝
      return null;
    },
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  })
);

// ============================================================
// 4. 公开路由（无需认证）
// ============================================================
app.route("/api/auth", auth);

// ============================================================
// 5. 受保护路由（需要 JWT 认证）
// ============================================================
app.use("/api/*", authMiddleware);
app.route("/api/members", members);
app.route("/api/stats", stats);
app.route("/api/settings", settings);

// ============================================================
// 6. 导出应用
// ============================================================
export default app;
