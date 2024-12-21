CREATE TABLE "quizz_player" (
	"id" serial PRIMARY KEY NOT NULL,
	"quizz_id" serial NOT NULL,
	"player_id" serial NOT NULL
);
--> statement-breakpoint
ALTER TABLE "quizz_player" ADD CONSTRAINT "quizz_player_quizz_id_quizz_id_fk" FOREIGN KEY ("quizz_id") REFERENCES "public"."quizz"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizz_player" ADD CONSTRAINT "quizz_player_player_id_player_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player"("id") ON DELETE no action ON UPDATE no action;