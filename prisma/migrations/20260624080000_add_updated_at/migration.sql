-- AddColumn (两阶段，避免 SQLite 限制)
-- 第一步：以可空方式新增 updatedAt 列
ALTER TABLE "Post" ADD COLUMN "updatedAt" DATETIME;
-- 第二步：使用 createdAt 填充已有行
UPDATE "Post" SET "updatedAt" = "createdAt" WHERE "updatedAt" IS NULL;
