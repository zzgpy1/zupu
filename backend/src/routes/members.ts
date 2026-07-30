import { Hono } from "hono";
import { createDb } from "../db";
import { familyMembers } from "../db/schema";
import { eq, and } from "drizzle-orm";

const members = new Hono();

// ✅ 获取当前用户的所有成员
members.get("/", async (c) => {
  try {
    const userId = c.get("userId");
    const db = createDb(c.env);
    const results = await db.select()
      .from(familyMembers)
      .where(eq(familyMembers.userId, userId))
      .orderBy(familyMembers.generation);
    return c.json(results);
  } catch (err) {
    console.error("Get members error:", err);
    return c.json({ error: String(err) }, 500);
  }
});

// ✅ 获取族谱树数据（必须在 /:id 之前）
members.get("/tree", async (c) => {
  try {
    const userId = c.get("userId");
    const db = createDb(c.env);
    const allMembers = await db.select()
      .from(familyMembers)
      .where(eq(familyMembers.userId, userId));

    const memberMap = new Map();
    allMembers.forEach(m => memberMap.set(m.id, { ...m, children: [] }));

    const roots: typeof allMembers = [];
    allMembers.forEach(m => {
      if (m.fatherId && memberMap.has(m.fatherId)) {
        memberMap.get(m.fatherId).children.push(memberMap.get(m.id));
      } else {
        roots.push(memberMap.get(m.id));
      }
    });

    return c.json({ roots, all: allMembers });
  } catch (err) {
    console.error("Get tree error:", err);
    return c.json({ error: String(err) }, 500);
  }
});

// ✅ 获取单个成员（保持在 /tree 之后）
members.get("/:id", async (c) => {
  try {
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
  } catch (err) {
    console.error("Get member error:", err);
    return c.json({ error: String(err) }, 500);
  }
});

// ✅ 创建成员
members.post("/", async (c) => {
  try {
    const userId = c.get("userId");
    const data = await c.req.json();
    const db = createDb(c.env);
    const [member] = await db.insert(familyMembers).values({
      ...data,
      userId,
    }).returning();
    return c.json(member, 201);
  } catch (err) {
    console.error("Create member error:", err);
    return c.json({ error: String(err) }, 500);
  }
});

// ✅ 更新成员
members.put("/:id", async (c) => {
  try {
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
  } catch (err) {
    console.error("Update member error:", err);
    return c.json({ error: String(err) }, 500);
  }
});

// ✅ 删除成员
members.delete("/:id", async (c) => {
  try {
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
  } catch (err) {
    console.error("Delete member error:", err);
    return c.json({ error: String(err) }, 500);
  }
});

export default members;