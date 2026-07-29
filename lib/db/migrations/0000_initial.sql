-- 创建 Better Auth 表
CREATE TABLE IF NOT EXISTS user (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    emailVerified INTEGER NOT NULL DEFAULT 0,
    image TEXT,
    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS session (
    id TEXT PRIMARY KEY,
    expiresAt TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ipAddress TEXT,
    userAgent TEXT,
    userId TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS account (
    id TEXT PRIMARY KEY,
    accountId TEXT NOT NULL,
    providerId TEXT NOT NULL,
    userId TEXT NOT NULL,
    accessToken TEXT,
    refreshToken TEXT,
    idToken TEXT,
    accessTokenExpiresAt TEXT,
    refreshTokenExpiresAt TEXT,
    scope TEXT,
    password TEXT,
    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS verification (
    id TEXT PRIMARY KEY,
    identifier TEXT NOT NULL,
    value TEXT NOT NULL,
    expiresAt TEXT NOT NULL,
    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 创建族谱核心表
CREATE TABLE IF NOT EXISTS family_members (
    id TEXT PRIMARY KEY DEFAULT (uuid()),
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    generation INTEGER,
    sibling_order INTEGER,
    father_id TEXT,
    mother_id TEXT,
    gender TEXT CHECK (gender IN ('男', '女')),
    spouse TEXT,
    birthday TEXT,
    death_date TEXT,
    is_alive INTEGER DEFAULT 1,
    residence_place TEXT,
    official_position TEXT,
    biography TEXT,
    remarks TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (father_id) REFERENCES family_members(id),
    FOREIGN KEY (mother_id) REFERENCES family_members(id)
);

CREATE TABLE IF NOT EXISTS family_trees (
    id TEXT PRIMARY KEY DEFAULT (uuid()),
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    root_member_id TEXT,
    is_public INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (root_member_id) REFERENCES family_members(id)
);

CREATE TABLE IF NOT EXISTS tree_members (
    tree_id TEXT NOT NULL,
    member_id TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (tree_id, member_id),
    FOREIGN KEY (tree_id) REFERENCES family_trees(id),
    FOREIGN KEY (member_id) REFERENCES family_members(id)
);

-- 索引
CREATE INDEX idx_family_members_user_id ON family_members(user_id);
CREATE INDEX idx_family_members_father_id ON family_members(father_id);
CREATE INDEX idx_family_members_name ON family_members(name);
CREATE INDEX idx_family_trees_user_id ON family_trees(user_id);
