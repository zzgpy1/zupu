-- ============================================================
-- 1. 用户表 (users)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,   -- 应用生成 UUID
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);

-- ============================================================
-- 2. 族谱成员表 (family_members)
-- ============================================================
CREATE TABLE IF NOT EXISTS family_members (
    id TEXT PRIMARY KEY,   -- 应用生成 UUID
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    generation INTEGER,
    sibling_order INTEGER,
    father_id TEXT REFERENCES family_members(id) ON DELETE SET NULL,
    gender TEXT CHECK (gender IN ('男', '女')),
    official_position TEXT,
    is_alive INTEGER DEFAULT 1,
    spouse TEXT,
    remarks TEXT,
    birthday TEXT,
    death_date TEXT,
    residence_place TEXT,
    created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);

-- ============================================================
-- 3. 用户设置表
-- ============================================================
CREATE TABLE IF NOT EXISTS user_settings (
    user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    family_name TEXT,
    family_description TEXT,
    theme_preference TEXT DEFAULT 'light',
    created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);

-- ============================================================
-- 4. 会话表 (sessions)
-- ============================================================
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,   -- 应用生成 UUID
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    expires_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);

-- ============================================================
-- 索引
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_family_members_user_id ON family_members(user_id);
CREATE INDEX IF NOT EXISTS idx_family_members_father_id ON family_members(father_id);
CREATE INDEX IF NOT EXISTS idx_family_members_name ON family_members(name);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
