-- ============================================================
-- 1. 用户表 (users)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- ============================================================
-- 2. 族谱成员表 (family_members)
-- ============================================================
CREATE TABLE IF NOT EXISTS family_members (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    generation INTEGER,
    sibling_order INTEGER,
    father_id TEXT REFERENCES family_members(id) ON DELETE SET NULL,
    gender TEXT CHECK (gender IN ('男', '女')),
    official_position TEXT,
    is_alive INTEGER DEFAULT 1,  -- SQLite 用 0/1 表示布尔值
    spouse TEXT,
    remarks TEXT,
    birthday TEXT,               -- YYYY-MM-DD
    death_date TEXT,             -- YYYY-MM-DD
    residence_place TEXT,
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- ============================================================
-- 3. 用户族谱设置表 (user_settings)
-- ============================================================
CREATE TABLE IF NOT EXISTS user_settings (
    user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    family_name TEXT,
    family_description TEXT,
    theme_preference TEXT DEFAULT 'light',
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- ============================================================
-- 4. 会话表 (sessions) - 用于服务端会话管理（可选，JWT 可无状态）
-- ============================================================
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    expires_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- ============================================================
-- 索引 (提升查询性能)
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_family_members_user_id ON family_members(user_id);
CREATE INDEX IF NOT EXISTS idx_family_members_father_id ON family_members(father_id);
CREATE INDEX IF NOT EXISTS idx_family_members_name ON family_members(name);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
