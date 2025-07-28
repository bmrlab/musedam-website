import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "posts" ADD COLUMN "is_hero_article" boolean DEFAULT false;
  ALTER TABLE "posts" ADD COLUMN "is_top_article" boolean DEFAULT false;
  ALTER TABLE "_posts_v" ADD COLUMN "version_is_hero_article" boolean DEFAULT false;
  ALTER TABLE "_posts_v" ADD COLUMN "version_is_top_article" boolean DEFAULT false;
  CREATE INDEX IF NOT EXISTS "posts_is_hero_article_idx" ON "posts" USING btree ("is_hero_article");
  CREATE INDEX IF NOT EXISTS "posts_is_top_article_idx" ON "posts" USING btree ("is_top_article");
  CREATE INDEX IF NOT EXISTS "_posts_v_version_version_is_hero_article_idx" ON "_posts_v" USING btree ("version_is_hero_article");
  CREATE INDEX IF NOT EXISTS "_posts_v_version_version_is_top_article_idx" ON "_posts_v" USING btree ("version_is_top_article");`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   DROP INDEX IF EXISTS "posts_is_hero_article_idx";
  DROP INDEX IF EXISTS "posts_is_top_article_idx";
  DROP INDEX IF EXISTS "_posts_v_version_version_is_hero_article_idx";
  DROP INDEX IF EXISTS "_posts_v_version_version_is_top_article_idx";
  ALTER TABLE "posts" DROP COLUMN IF EXISTS "is_hero_article";
  ALTER TABLE "posts" DROP COLUMN IF EXISTS "is_top_article";
  ALTER TABLE "_posts_v" DROP COLUMN IF EXISTS "version_is_hero_article";
  ALTER TABLE "_posts_v" DROP COLUMN IF EXISTS "version_is_top_article";`)
}
