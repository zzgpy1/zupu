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
// 1. 健康检查 / 根路由（用于快速验证 Worker 是否运行）
// ============================================================
app.get("/", (c) => {
  return c.text("✅ pure-genealogy API is running! Use /api/* endpoints.");
});

// ============================================================
// 2. 全局错误处理（捕获所有未处理的异常，返回 JSON 错误）
// ============================================================
app.onError((err, c) => {
  console.error("❌ Global error:", err);
  return c.json(
    {
      error: err.message || "Internal Server Error",
      // 在开发环境可保留 stack，生产环境建议移除
      stack: err.stack,
    },
    500
  );
});

// ============================================================
// 3. CORS 配置（动态允许前端域名）
// ============================================================
app.use(
  "*",
  cors({
    origin: (origin) => {
      const allowed = [
        "http://localhost:5173",          // 本地开发
        "https://zupu.19860519.xyz",      // 你的自定义域名
        "pure-genealogy-api.173385250.workers.dev", // Cloudflare Pages 默认域名（如有）
      ];
      // 如果 origin 为空（如 Postman 或 curl），允许
      if (!origin) return "*";
      if (allowed.includes(origin)) return origin;
      return null; // 拒绝其他来源
    },
    credentials: true,
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
// 6. 导出 Hono 应用（Cloudflare Workers 入口）
// ============================================================
export default app;
