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

// CORS
app.use("*", cors({
  origin: ["http://localhost:5173", "https://your-frontend-domain.com"],
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
