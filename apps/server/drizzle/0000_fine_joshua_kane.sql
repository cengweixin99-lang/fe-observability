CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"event_id" text NOT NULL,
	"event_name" text NOT NULL,
	"event_type" text NOT NULL,
	"session_id" text NOT NULL,
	"occurred_at" timestamp with time zone NOT NULL,
	"received_at" timestamp with time zone DEFAULT now() NOT NULL,
	"properties" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"public_key" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "projects_public_key_unique" UNIQUE("public_key")
);
--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "events_project_event_unique" ON "events" USING btree ("project_id","event_id");--> statement-breakpoint
CREATE INDEX "events_project_occurred_at_idx" ON "events" USING btree ("project_id","occurred_at");