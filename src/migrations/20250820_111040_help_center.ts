import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_help_topics_status" AS ENUM('published', 'draft');
  CREATE TYPE "public"."enum_help_categories_status" AS ENUM('published', 'draft');
  CREATE TYPE "public"."enum_help_documents_status" AS ENUM('published', 'draft');
  CREATE TABLE IF NOT EXISTS "help_topics_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "help_topics_bullets_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "help_topics" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"cover_image_id" integer,
  	"index" numeric DEFAULT 999,
  	"_status" "enum_help_topics_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "help_topics_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "help_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"topic_id" integer NOT NULL,
  	"index" numeric DEFAULT 999,
  	"_status" "enum_help_categories_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "help_categories_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "help_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"author_id" integer,
  	"category_id" integer NOT NULL,
  	"index" numeric DEFAULT 999,
  	"_status" "enum_help_documents_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "help_documents_locales" (
  	"title" varchar NOT NULL,
  	"excerpt" varchar,
  	"content" jsonb NOT NULL,
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "help_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"help_documents_id" integer
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "help_topics_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "help_categories_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "help_documents_id" integer;
  DO $$ BEGIN
   ALTER TABLE "help_topics_bullets" ADD CONSTRAINT "help_topics_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."help_topics"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "help_topics_bullets_locales" ADD CONSTRAINT "help_topics_bullets_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."help_topics_bullets"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "help_topics" ADD CONSTRAINT "help_topics_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "help_topics_locales" ADD CONSTRAINT "help_topics_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."help_topics"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "help_categories" ADD CONSTRAINT "help_categories_topic_id_help_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."help_topics"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "help_categories_locales" ADD CONSTRAINT "help_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."help_categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "help_documents" ADD CONSTRAINT "help_documents_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "help_documents" ADD CONSTRAINT "help_documents_category_id_help_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."help_categories"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "help_documents_locales" ADD CONSTRAINT "help_documents_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "help_documents_locales" ADD CONSTRAINT "help_documents_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."help_documents"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "help_documents_rels" ADD CONSTRAINT "help_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."help_documents"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "help_documents_rels" ADD CONSTRAINT "help_documents_rels_help_documents_fk" FOREIGN KEY ("help_documents_id") REFERENCES "public"."help_documents"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "help_topics_bullets_order_idx" ON "help_topics_bullets" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "help_topics_bullets_parent_id_idx" ON "help_topics_bullets" USING btree ("_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "help_topics_bullets_locales_locale_parent_id_unique" ON "help_topics_bullets_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "help_topics_slug_idx" ON "help_topics" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "help_topics_cover_image_idx" ON "help_topics" USING btree ("cover_image_id");
  CREATE INDEX IF NOT EXISTS "help_topics_updated_at_idx" ON "help_topics" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "help_topics_created_at_idx" ON "help_topics" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "help_topics_locales_locale_parent_id_unique" ON "help_topics_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "help_categories_slug_idx" ON "help_categories" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "help_categories_topic_idx" ON "help_categories" USING btree ("topic_id");
  CREATE INDEX IF NOT EXISTS "help_categories_updated_at_idx" ON "help_categories" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "help_categories_created_at_idx" ON "help_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "help_categories_locales_locale_parent_id_unique" ON "help_categories_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "help_documents_slug_idx" ON "help_documents" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "help_documents_author_idx" ON "help_documents" USING btree ("author_id");
  CREATE INDEX IF NOT EXISTS "help_documents_category_idx" ON "help_documents" USING btree ("category_id");
  CREATE INDEX IF NOT EXISTS "help_documents_updated_at_idx" ON "help_documents" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "help_documents_created_at_idx" ON "help_documents" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "help_documents_meta_meta_image_idx" ON "help_documents_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX IF NOT EXISTS "help_documents_locales_locale_parent_id_unique" ON "help_documents_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "help_documents_rels_order_idx" ON "help_documents_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "help_documents_rels_parent_idx" ON "help_documents_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "help_documents_rels_path_idx" ON "help_documents_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "help_documents_rels_help_documents_id_idx" ON "help_documents_rels" USING btree ("help_documents_id");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_help_topics_fk" FOREIGN KEY ("help_topics_id") REFERENCES "public"."help_topics"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_help_categories_fk" FOREIGN KEY ("help_categories_id") REFERENCES "public"."help_categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_help_documents_fk" FOREIGN KEY ("help_documents_id") REFERENCES "public"."help_documents"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_help_topics_id_idx" ON "payload_locked_documents_rels" USING btree ("help_topics_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_help_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("help_categories_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_help_documents_id_idx" ON "payload_locked_documents_rels" USING btree ("help_documents_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "help_topics_bullets" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "help_topics_bullets_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "help_topics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "help_topics_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "help_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "help_categories_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "help_documents" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "help_documents_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "help_documents_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "help_topics_bullets" CASCADE;
  DROP TABLE "help_topics_bullets_locales" CASCADE;
  DROP TABLE "help_topics" CASCADE;
  DROP TABLE "help_topics_locales" CASCADE;
  DROP TABLE "help_categories" CASCADE;
  DROP TABLE "help_categories_locales" CASCADE;
  DROP TABLE "help_documents" CASCADE;
  DROP TABLE "help_documents_locales" CASCADE;
  DROP TABLE "help_documents_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_help_topics_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_help_categories_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_help_documents_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_help_topics_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_help_categories_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_help_documents_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "help_topics_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "help_categories_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "help_documents_id";
  DROP TYPE "public"."enum_help_topics_status";
  DROP TYPE "public"."enum_help_categories_status";
  DROP TYPE "public"."enum_help_documents_status";`)
}
