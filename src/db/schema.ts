import { text, boolean, pgTable, uuid, serial } from "drizzle-orm/pg-core";

export const todo = pgTable("todo", {
  id: serial('id').primaryKey(),
  text: text("text").notNull(),
  done: boolean("done").default(false).notNull(),
});