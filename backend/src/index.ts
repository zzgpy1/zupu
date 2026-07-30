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
    origin: (origin, c) => {
      // 定义允许的域名白名单（必须包含完整协议）
      const allowed = [
        "http://localhost:5173",
        "https://zupu.19860519.xyz",
        "https://pure-genealogy-api.173385250.workers.dev", 
        // 如需允许前端 Worker 的默认域名，也一并加入
        "https://zupu-main.173385250.workers.dev",
      ];

      // 如果请求没有 Origin 头（如 Postman/curl），直接拒绝
      if (!origin) {
        return null;
      }

      // 检查 Origin 是否在白名单中
      if (allowed.includes(origin)) {
        return origin;
      }

      // 不在白名单中，拒绝
      return null;
    },
    credentials: true,
    // 可选：明确指定允许的请求方法
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    // 可选：允许前端携带的请求头
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
// 6. 导出 Hono 应用（Cloudflare Workers 入口）
// ============================================================
export default app;
