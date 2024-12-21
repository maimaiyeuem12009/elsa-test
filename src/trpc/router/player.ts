/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { db } from '@/db/drizzle';
import { player } from '@/db/schema';


export const playerRouter = createTRPCRouter({
  create: baseProcedure
    .input(z.object({
      name: z.string().min(1),
    }))
    .mutation(async (opts) => {
      const newUser = await db.insert(player).values({
        name: opts.input.name,
      }).returning();
      return newUser;
    }),
});
