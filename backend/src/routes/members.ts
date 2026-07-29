import { Hono } from "hono";
import { createDb } from "../db";
import { familyMembers } from "../db/schema";
import { eq, and } from "drizzle-orm";

const members = new Hono();

// 获取当前用户的所有成员
members.get("/", async (c) => {
  const userId = c.get("userId");
  const db = createDb(c.env);

  const results = await db.select()
    .from(familyMembers)
    .where(eq(familyMembers.userId, userId))
    .orderBy(familyMembers.generation);

  return c.json(results);
});

// 获取单个成员
members.get("/:id", async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");
  const db = createDb(c.env);

  const [member] = await db.select()
    .from(familyMembers)
    .where(and(eq(familyMembers.id, id), eq(familyMembers.userId, userId)));

  if (!member) {
    return c.json({ error: "Member not found" }, 404);
  }

  return c.json(member);
});

// 创建成员
members.post("/", async (c) => {
  const userId = c.get("userId");
  const data = await c.req.json();
  const db = createDb(c.env);

  const [member] = await db.insert(familyMembers).values({
    ...data,
    userId,
  }).returning();

  return c.json(member, 201);
});

// 更新成员
members.put("/:id", async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");
  const data = await c.req.json();
  const db = createDb(c.env);

  const [member] = await db.update(familyMembers)
    .set({ ...data, updatedAt: Date.now() })
    .where(and(eq(familyMembers.id, id), eq(familyMembers.userId, userId)))
    .returning();

  if (!member) {
    return c.json({ error: "Member not found" }, 404);
  }

  return c.json(member);
});

// 删除成员
members.delete("/:id", async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");
  const db = createDb(c.env);

  const [member] = await db.delete(familyMembers)
    .where(and(eq(familyMembers.id, id), eq(familyMembers.userId, userId)))
    .returning();

  if (!member) {
    return c.json({ error: "Member not found" }, 404);
  }

  return c.json({ success: true });
});

// 获取族谱树数据 (用于 2D/3D 可视化)
members.get("/tree", async (c) => {
  const userId = c.get("userId");
  const db = createDb(c.env);

  const members = await db.select()
    .from(familyMembers)
    .where(eq(familyMembers.userId, userId));

  // 构建树形结构
  const memberMap = new Map();
  members.forEach(m => memberMap.set(m.id, { ...m, children: [] }));

  const roots: typeof members = [];
  members.forEach(m => {
    if (m.fatherId && memberMap.has(m.fatherId)) {
      memberMap.get(m.fatherId).children.push(memberMap.get(m.id));
    } else {
      roots.push(memberMap.get(m.id));
    }
  });

  return c.json({ roots, all: members });
});

export default members;
