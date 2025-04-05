CREATE TABLE "impact_projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"location" text NOT NULL,
	"latitude" numeric(10, 6) NOT NULL,
	"longitude" numeric(10, 6) NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"status" text DEFAULT 'active' NOT NULL,
	"image_url" text,
	"partners" text[],
	"impact_description" text,
	"metrics_achieved" jsonb,
	"featured" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "impact_timeline_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"date" timestamp NOT NULL,
	"category" text NOT NULL,
	"image_url" text,
	"project_id" integer,
	"importance" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "impact_timeline_events" ADD CONSTRAINT "impact_timeline_events_project_id_impact_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."impact_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "verification_token";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "reset_password_token";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "reset_password_expires";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "updated_at";