CREATE TABLE "player" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quizz" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"question" jsonb NOT NULL
);
