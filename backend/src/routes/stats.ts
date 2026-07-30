import { Hono } from "hono";
import { createDb } from "../db";
import { familyMembers } from "../db/schema";
import { eq, sql } from "drizzle-orm";

const stats = new Hono();

stats.get("/", async (c) => {
  const userId = c.get("userId");
  const db = createDb(c.env);

  const all = await db.select()
    .from(familyMembers)
    .where(eq(familyMembers.userId, userId));

  const total = all.length;
  const male = all.filter(m => m.gender === "男").length;
  const female = all.filter(m => m.gender === "女").length;
  const alive = all.filter(m => m.isAlive).length;

  const generations = [...new Set(all.map(m => m.generation).filter(g => g !== null))];
  const maxGeneration = Math.max(...generations);

  // 字辈统计
  const generationNames: Record<number, number> = {};
  all.forEach(m => {
    if (m.generation) {
      generationNames[m.generation] = (generationNames[m.generation] || 0) + 1;
    }
  });

  return c.json({
    total,
    male,
    female,
    alive,
    deceased: total - alive,
    maxGeneration,
    generationCount: generations.length,
    generationDistribution: generationNames,
  });
});

export default stats;
