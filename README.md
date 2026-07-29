## 族谱系统 (Genealogy System)

基于 Next.js 15 + Cloudflare D1 + R2 的家族族谱管理系统。

## 功能

- 成员增删改查
- 头像上传（R2）
- 家族树（一层子女展示）
- 关系管理（通过 API）
- 管理员登录（JWT）
- 简单统计

## 部署

1. 在 Cloudflare 面板创建 D1 数据库 `zupu`（ID 已配置）和 R2 存储桶。
2. 在 Pages 项目连接本仓库，绑定 D1（变量名 `DB`）和 R2（变量名 `R2_BUCKET`）。
3. 设置环境变量：`JWT_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`。
4. 运行迁移：`npm run db:generate && npm run db:migrate`。
5. 部署：`npm run deploy` 或 push 到 GitHub 自动部署。

## 本地开发

```bash
npm install
npm run dev
