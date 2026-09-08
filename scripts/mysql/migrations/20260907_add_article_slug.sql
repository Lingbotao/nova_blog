-- 增量迁移：为 article 表新增自定义路由 slug 字段（已建库环境使用）
-- 用法：mysql -u root -p nova_blog < scripts/mysql/migrations/20260907_add_article_slug.sql

SET NAMES utf8mb4;

USE `nova_blog`;

ALTER TABLE `article`
  ADD COLUMN `slug` VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '自定义路由 slug（唯一，空则回退 article_id）' AFTER `title`,
  ADD UNIQUE INDEX `uk_article_slug`(`slug` ASC) USING BTREE;