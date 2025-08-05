import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TABLE IF NOT EXISTS "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE IF NOT EXISTS "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "pages_locales" DROP CONSTRAINT "pages_locales_locale_parent_id_unique";
  ALTER TABLE "_pages_v_locales" DROP CONSTRAINT "_pages_v_locales_locale_parent_id_unique";
  ALTER TABLE "posts_locales" DROP CONSTRAINT "posts_locales_locale_parent_id_unique";
  ALTER TABLE "_posts_v_locales" DROP CONSTRAINT "_posts_v_locales_locale_parent_id_unique";
  ALTER TABLE "categories_locales" DROP CONSTRAINT "categories_locales_locale_parent_id_unique";
  ALTER TABLE "forms_blocks_checkbox_locales" DROP CONSTRAINT "forms_blocks_checkbox_locales_locale_parent_id_unique";
  ALTER TABLE "forms_blocks_country_locales" DROP CONSTRAINT "forms_blocks_country_locales_locale_parent_id_unique";
  ALTER TABLE "forms_blocks_email_locales" DROP CONSTRAINT "forms_blocks_email_locales_locale_parent_id_unique";
  ALTER TABLE "forms_blocks_message_locales" DROP CONSTRAINT "forms_blocks_message_locales_locale_parent_id_unique";
  ALTER TABLE "forms_blocks_number_locales" DROP CONSTRAINT "forms_blocks_number_locales_locale_parent_id_unique";
  ALTER TABLE "forms_blocks_select_options_locales" DROP CONSTRAINT "forms_blocks_select_options_locales_locale_parent_id_unique";
  ALTER TABLE "forms_blocks_select_locales" DROP CONSTRAINT "forms_blocks_select_locales_locale_parent_id_unique";
  ALTER TABLE "forms_blocks_state_locales" DROP CONSTRAINT "forms_blocks_state_locales_locale_parent_id_unique";
  ALTER TABLE "forms_blocks_text_locales" DROP CONSTRAINT "forms_blocks_text_locales_locale_parent_id_unique";
  ALTER TABLE "forms_blocks_textarea_locales" DROP CONSTRAINT "forms_blocks_textarea_locales_locale_parent_id_unique";
  ALTER TABLE "forms_emails_locales" DROP CONSTRAINT "forms_emails_locales_locale_parent_id_unique";
  ALTER TABLE "forms_locales" DROP CONSTRAINT "forms_locales_locale_parent_id_unique";
  ALTER TABLE "search_locales" DROP CONSTRAINT "search_locales_locale_parent_id_unique";
  ALTER TABLE "forms_emails_locales" ALTER COLUMN "subject" SET DEFAULT 'You''ve received a new message.';
  ALTER TABLE "forms_blocks_select" ADD COLUMN "placeholder" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payload_jobs_id" integer;
  DO $$ BEGIN
   ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX IF NOT EXISTS "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX IF NOT EXISTS "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX IF NOT EXISTS "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX IF NOT EXISTS "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX IF NOT EXISTS "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX IF NOT EXISTS "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX IF NOT EXISTS "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_jobs_fk" FOREIGN KEY ("payload_jobs_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE UNIQUE INDEX IF NOT EXISTS "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "_pages_v_locales_locale_parent_id_unique" ON "_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "posts_locales_locale_parent_id_unique" ON "posts_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "_posts_v_locales_locale_parent_id_unique" ON "_posts_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "categories_locales_locale_parent_id_unique" ON "categories_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "forms_blocks_checkbox_locales_locale_parent_id_unique" ON "forms_blocks_checkbox_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "forms_blocks_country_locales_locale_parent_id_unique" ON "forms_blocks_country_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "forms_blocks_email_locales_locale_parent_id_unique" ON "forms_blocks_email_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "forms_blocks_message_locales_locale_parent_id_unique" ON "forms_blocks_message_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "forms_blocks_number_locales_locale_parent_id_unique" ON "forms_blocks_number_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "forms_blocks_select_options_locales_locale_parent_id_unique" ON "forms_blocks_select_options_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "forms_blocks_select_locales_locale_parent_id_unique" ON "forms_blocks_select_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "forms_blocks_state_locales_locale_parent_id_unique" ON "forms_blocks_state_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "forms_blocks_text_locales_locale_parent_id_unique" ON "forms_blocks_text_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "forms_blocks_textarea_locales_locale_parent_id_unique" ON "forms_blocks_textarea_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "forms_emails_locales_locale_parent_id_unique" ON "forms_emails_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "forms_locales_locale_parent_id_unique" ON "forms_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "search_locales_locale_parent_id_unique" ON "search_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_payload_jobs_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_jobs_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_jobs_log" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_jobs" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_payload_jobs_fk";
  
  DROP INDEX IF EXISTS "pages_locales_locale_parent_id_unique";
  DROP INDEX IF EXISTS "_pages_v_locales_locale_parent_id_unique";
  DROP INDEX IF EXISTS "posts_locales_locale_parent_id_unique";
  DROP INDEX IF EXISTS "_posts_v_locales_locale_parent_id_unique";
  DROP INDEX IF EXISTS "categories_locales_locale_parent_id_unique";
  DROP INDEX IF EXISTS "forms_blocks_checkbox_locales_locale_parent_id_unique";
  DROP INDEX IF EXISTS "forms_blocks_country_locales_locale_parent_id_unique";
  DROP INDEX IF EXISTS "forms_blocks_email_locales_locale_parent_id_unique";
  DROP INDEX IF EXISTS "forms_blocks_message_locales_locale_parent_id_unique";
  DROP INDEX IF EXISTS "forms_blocks_number_locales_locale_parent_id_unique";
  DROP INDEX IF EXISTS "forms_blocks_select_options_locales_locale_parent_id_unique";
  DROP INDEX IF EXISTS "forms_blocks_select_locales_locale_parent_id_unique";
  DROP INDEX IF EXISTS "forms_blocks_state_locales_locale_parent_id_unique";
  DROP INDEX IF EXISTS "forms_blocks_text_locales_locale_parent_id_unique";
  DROP INDEX IF EXISTS "forms_blocks_textarea_locales_locale_parent_id_unique";
  DROP INDEX IF EXISTS "forms_emails_locales_locale_parent_id_unique";
  DROP INDEX IF EXISTS "forms_locales_locale_parent_id_unique";
  DROP INDEX IF EXISTS "search_locales_locale_parent_id_unique";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_payload_jobs_id_idx";
  ALTER TABLE "forms_emails_locales" ALTER COLUMN "subject" SET DEFAULT 'You''''ve received a new message.';
  ALTER TABLE "forms_blocks_select" DROP COLUMN IF EXISTS "placeholder";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "payload_jobs_id";
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_locale_parent_id_unique" UNIQUE("_locale","_parent_id");
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_locale_parent_id_unique" UNIQUE("_locale","_parent_id");
  ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_locale_parent_id_unique" UNIQUE("_locale","_parent_id");
  ALTER TABLE "_posts_v_locales" ADD CONSTRAINT "_posts_v_locales_locale_parent_id_unique" UNIQUE("_locale","_parent_id");
  ALTER TABLE "categories_locales" ADD CONSTRAINT "categories_locales_locale_parent_id_unique" UNIQUE("_locale","_parent_id");
  ALTER TABLE "forms_blocks_checkbox_locales" ADD CONSTRAINT "forms_blocks_checkbox_locales_locale_parent_id_unique" UNIQUE("_locale","_parent_id");
  ALTER TABLE "forms_blocks_country_locales" ADD CONSTRAINT "forms_blocks_country_locales_locale_parent_id_unique" UNIQUE("_locale","_parent_id");
  ALTER TABLE "forms_blocks_email_locales" ADD CONSTRAINT "forms_blocks_email_locales_locale_parent_id_unique" UNIQUE("_locale","_parent_id");
  ALTER TABLE "forms_blocks_message_locales" ADD CONSTRAINT "forms_blocks_message_locales_locale_parent_id_unique" UNIQUE("_locale","_parent_id");
  ALTER TABLE "forms_blocks_number_locales" ADD CONSTRAINT "forms_blocks_number_locales_locale_parent_id_unique" UNIQUE("_locale","_parent_id");
  ALTER TABLE "forms_blocks_select_options_locales" ADD CONSTRAINT "forms_blocks_select_options_locales_locale_parent_id_unique" UNIQUE("_locale","_parent_id");
  ALTER TABLE "forms_blocks_select_locales" ADD CONSTRAINT "forms_blocks_select_locales_locale_parent_id_unique" UNIQUE("_locale","_parent_id");
  ALTER TABLE "forms_blocks_state_locales" ADD CONSTRAINT "forms_blocks_state_locales_locale_parent_id_unique" UNIQUE("_locale","_parent_id");
  ALTER TABLE "forms_blocks_text_locales" ADD CONSTRAINT "forms_blocks_text_locales_locale_parent_id_unique" UNIQUE("_locale","_parent_id");
  ALTER TABLE "forms_blocks_textarea_locales" ADD CONSTRAINT "forms_blocks_textarea_locales_locale_parent_id_unique" UNIQUE("_locale","_parent_id");
  ALTER TABLE "forms_emails_locales" ADD CONSTRAINT "forms_emails_locales_locale_parent_id_unique" UNIQUE("_locale","_parent_id");
  ALTER TABLE "forms_locales" ADD CONSTRAINT "forms_locales_locale_parent_id_unique" UNIQUE("_locale","_parent_id");
  ALTER TABLE "search_locales" ADD CONSTRAINT "search_locales_locale_parent_id_unique" UNIQUE("_locale","_parent_id");
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";`)
}
