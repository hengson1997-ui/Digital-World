# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

"数码社区"（digital-community）—— 一个中文数码科技社交社区前端原型，基于 Next.js 14 + React 18，纯 JSX（无 TypeScript）。后端使用 Next.js API Routes + Prisma ORM + SQLite 数据库。

## 常用命令

```bash
npm install          # 安装依赖
npm run dev          # 开发服务器，端口 3000，绑定 0.0.0.0
npm run build        # 生产构建
npm run start        # 生产服务器，端口 8080
npm run lint         # ESLint 检查（Next.js 内置配置）
npx prisma db seed   # 重新写入种子数据
npx prisma studio    # 打开数据库可视化工具
```

## 架构要点

### 路由：SPA 模拟路由（非标准 Next.js 路由）

项目使用 Pages Router，但**不是真正的多页面路由**。所有"页面"都在 `pages/index.jsx` 中通过 `activePage` state + switch 语句切换，本质上是一个 SPA。五个虚拟页面对应 `pages/` 下的组件文件：
- `home` → `HomePage.jsx`（信息流 + 分类筛选 + 排序）
- `search` → `SearchPage.jsx`（热搜、标签、推荐用户、搜索过滤）
- `post` → `PostPage.jsx`（发帖表单 + 标签输入）
- `messages` → `MessagesPage.jsx`（消息通知 + 筛选 + 已读）
- `profile` → `ProfilePage.jsx`（个人主页 + 用户帖子）

导航入口：`BottomNav.jsx`（底部 4 个 Tab）和 `Header.jsx`（顶部关注/推荐/最新切换）。

### 数据层：Prisma + SQLite

数据库使用 SQLite（文件型 `dev.db`），通过 Prisma ORM 访问。PrismaClient 单例在 `lib/prisma.js`，使用 `@prisma/adapter-better-sqlite3` 适配器。

数据模型（`prisma/schema.prisma`）：
- `User` — 用户（头像、名称、统计）
- `Post` — 帖子（标题、内容、点赞、分类）
- `PostTag` — 帖子标签关联
- `Category` — 分类（8 个）
- `TrendingTopic` — 热门话题
- `Tag` — 热门标签库
- `RecentSearch` — 最近搜索
- `Message` — 消息通知

种子数据：`prisma/seed.ts`（用 `npx tsx` 运行）

### API Routes

| 路由 | 方法 | 说明 |
|------|------|------|
| `/api/categories` | GET | 分类列表 |
| `/api/posts` | GET/POST | 帖子列表（支持 category/sort 参数）/ 创建帖子 |
| `/api/posts/[id]/like` | PATCH | 切换点赞（原子操作） |
| `/api/search/page-data` | GET | 搜索页一体化数据 |
| `/api/search/recent` | POST/DELETE | 记录搜索 / 清空历史 |
| `/api/messages` | GET | 消息列表（支持 filter 参数） |
| `/api/users/profile` | GET | 当前用户资料 + 帖子 |

### 前端数据获取

使用自定义 `hooks/useFetch.js` Hook，支持：
- AbortController 取消请求
- refetch 手动重试
- setData 乐观更新

数据映射：`lib/postMapper.js` 将 Prisma 嵌套结构转为 PostCard 需要的扁平格式。

### 组件结构

`components/` 目录为扁平结构，所有组件为函数式组件 + hooks。无状态管理库，状态通过 `useState` 管理。

### 样式

所有样式集中在 `styles/globals.css`（约 1300 行）。设计语言为 Apple 风格的"液态玻璃"美学：
- `.glass` 类实现毛玻璃效果（`backdrop-filter: blur(30px) saturate(180%)`）
- 移动端优先，最大宽度 720px，480px / 768px 断点
- 渐变色头像、按钮和装饰性背景光球（`Background.jsx`）
- 骨架屏 shimmer 动画（`PostCardSkeleton.jsx`）
- 点赞 bounce 动画（`likeBounce`）
- 页面切换 fadeIn 动画（`page-enter`）

### 独立 HTML 文件

- `logo_v3.html` — 品牌 Logo 设计规范页（"数界"品牌）
- `preview.html` — 完整静态 HTML 预览原型（早于 Next.js 实现的设计稿）

## 注意事项

- 已有 `.gitignore`，排除 `node_modules/`、`.next/`、`.env`、`/generated/prisma`、`/prisma/dev.db`
- 无 TypeScript、无 Tailwind、无 Prettier 配置
- Prisma 7 生成的客户端是 TypeScript，API Routes 通过 Next.js 编译处理
- 无认证系统，当前用户固定为 userId=1
