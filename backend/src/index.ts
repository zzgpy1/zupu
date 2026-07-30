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

// 健康检查
app.get("/", (c) => c.text("✅ pure-genealogy API is running! Use /api/* endpoints."));

// 全局错误处理
app.onError((err, c) => {
  console.error("❌ Global error:", err);
  return c.json(
    {
      error: err.message || "Internal Server Error",
      stack: err.stack,
    },
    500
  );
});

// CORS 配置 - 动态允许
app.use(
  "*",
  cors({
    origin: (origin) => {
      const allowed = [
        "http://localhost:5173",                    // 本地开发
        "http://localhost:8787",                    // 后端本地
        "https://zupu-main.173385250.workers.dev",  // 前端 Worker 域名
        "https://pure-genealogy.pages.dev",         // Pages 默认域名
        "https://zupu.19860519.xyz",                // 自定义域名
      ];
      if (!origin) return "*"; // 允许无来源请求（如 curl）
      if (allowed.includes(origin)) return origin;
      return null; // 拒绝其他来源
    },
    credentials: true,
  })
);

// 公开路由
app.route("/api/auth", auth);

// 受保护路由
app.use("/api/*", authMiddleware);
app.route("/api/members", members);
app.route("/api/stats", stats);
app.route("/api/settings", settings);

export default app;
