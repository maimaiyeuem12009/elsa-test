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
--> statement-breakpoint
CREATE TABLE "quizz_player" (
	"quizz_id" serial NOT NULL,
	"player_id" serial NOT NULL,
	"completed_questions" integer DEFAULT 0,
	"score" integer DEFAULT 0,
	CONSTRAINT "quizz_player_quizz_id_player_id_pk" PRIMARY KEY("quizz_id","player_id")
);
--> statement-breakpoint
ALTER TABLE "quizz_player" ADD CONSTRAINT "quizz_player_quizz_id_quizz_id_fk" FOREIGN KEY ("quizz_id") REFERENCES "public"."quizz"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizz_player" ADD CONSTRAINT "quizz_player_player_id_player_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player"("id") ON DELETE cascade ON UPDATE no action;