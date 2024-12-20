/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { db } from '@/db/drizzle';
import { todo } from '@/db/schema';
import { eq, sql, desc } from 'drizzle-orm';
import EventEmitter from 'events';

const ee = new EventEmitter();

export const todoRouter = createTRPCRouter({
  getAll: baseProcedure.query(async () => {
    const todos = await db.select().from(todo).orderBy(desc(todo.id));
    return todos;
  }),

  todoUpdates: baseProcedure.subscription(async function* () {
    try {
      while (true) {
        const data = await new Promise<{ type: 'created' | 'updated' | 'deleted', data: any }>(resolve => {
          const onUpdate = (data: any) => {
            resolve(data);
          };
          ee.once('todoUpdate', onUpdate);
        });
        yield data;
      }
    } finally {
      // Cleanup happens automatically when generator is closed
    }
  }),

  create: baseProcedure
    .input(
      z.object({
        text: z.string().min(1),
      }),
    )
    .mutation(async (opts) => {
      const newTodo = await db.insert(todo).values({
        text: opts.input.text,
        done: false,
      }).returning();
      
      ee.emit('todoUpdate', { type: 'created', data: newTodo[0] });
      
      return newTodo;
    }),

  toggle: baseProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({input}) => {
      const updatedTodo = await db.update(todo).set({
        done: sql`case when ${todo.done} = false then true else false end`,
      }).where(eq(todo.id, input.id)).returning();
      return updatedTodo;
    }),

  delete: baseProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({input}) => {
      const deletedTodo = await db.delete(todo).where(eq(todo.id, input.id)).returning();
      return deletedTodo;
    }),
}); 