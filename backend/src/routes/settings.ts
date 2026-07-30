import { Hono } from "hono";
import { createDb } from "../db";
import { userSettings } from "../db/schema";
import { eq } from "drizzle-orm";

const settings = new Hono();

settings.get("/", async (c) => {
  const userId = c.get("userId");
  const db = createDb(c.env);

  const [setting] = await db.select()
    .from(userSettings)
    .where(eq(userSettings.userId, userId));

  return c.json(setting || { userId });
});

settings.put("/", async (c) => {
  const userId = c.get("userId");
  const data = await c.req.json();
  const db = createDb(c.env);

  const existing = await db.select()
    .from(userSettings)
    .where(eq(userSettings.userId, userId));

  let result;
  if (existing.length > 0) {
    [result] = await db.update(userSettings)
      .set({ ...data, updatedAt: Date.now() })
      .where(eq(userSettings.userId, userId))
      .returning();
  } else {
    [result] = await db.insert(userSettings)
      .values({ ...data, userId })
      .returning();
  }

  return c.json(result);
});

export default settings;
