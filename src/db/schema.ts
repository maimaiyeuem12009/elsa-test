import { questionSchema } from "@/validator/question";
import { text, pgTable, serial, jsonb, integer, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema, create } from 'drizzle-zod';
import { z } from "zod";
export const player = pgTable("player", {
  id: serial('id').primaryKey(),
  name: text("name").notNull(),
})

export const quizz = pgTable("quizz", {
  id: serial('id').primaryKey(),
  title: text("title").notNull(),
  question: jsonb("question").$type<z.infer<typeof questionSchema>>().notNull(),
})

export const quizzInsert = createInsertSchema(quizz).extend({
  question: questionSchema
})

export const quizzPlayer = pgTable("quizz_player", {
  quizzId: serial('quizz_id').references(() => quizz.id, { onDelete: 'cascade' }),
  playerId: serial('player_id').references(() => player.id, { onDelete: 'cascade' }),
  completedQuestions: integer("completed_questions").default(0),
  score: integer("score").default(0),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.quizzId, table.playerId] }),
  }
})

export const quizzPlayerInsert = createInsertSchema(quizzPlayer)