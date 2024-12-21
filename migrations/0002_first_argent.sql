ALTER TABLE "quizz_player" DROP CONSTRAINT "quizz_player_quizz_id_quizz_id_fk";
--> statement-breakpoint
ALTER TABLE "quizz_player" DROP CONSTRAINT "quizz_player_player_id_player_id_fk";
--> statement-breakpoint
ALTER TABLE "quizz_player" ADD CONSTRAINT "quizz_player_quizz_id_quizz_id_fk" FOREIGN KEY ("quizz_id") REFERENCES "public"."quizz"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizz_player" ADD CONSTRAINT "quizz_player_player_id_player_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player"("id") ON DELETE cascade ON UPDATE no action;