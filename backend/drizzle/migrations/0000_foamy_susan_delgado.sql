CREATE TABLE "summaries" (
	"id" serial PRIMARY KEY NOT NULL,
	"sender" text NOT NULL,
	"subject" text NOT NULL,
	"body" text NOT NULL,
	"summary_text" text NOT NULL,
	"category" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
