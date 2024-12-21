/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseProcedure, createTRPCRouter } from '../init';
import { db } from '@/db/drizzle';
import { quizz, quizzInsert, quizzPlayer } from '@/db/schema';
import { eq, desc, sql, and } from 'drizzle-orm';
import { z } from 'zod';


export const quizzRouter = createTRPCRouter({
  getAll: baseProcedure.query(async () => {
    const quizzes = await db.select({
      title: quizz.title,
      id: quizz.id,
      count: sql<number>`count(${quizzPlayer.id})`
    }).from(quizz)
    .leftJoin(quizzPlayer, eq(quizz.id, quizzPlayer.quizzId))
    .groupBy(quizz.id)
    .orderBy(desc(quizz.id));
    return quizzes;
  }),
  create: baseProcedure.input(quizzInsert.extend({
    userId: z.number()
  })).mutation(async ({input}) => {
    const {question, title, userId} = input
    return await db.transaction(async (tx) => {
      const newQuizz = await tx.insert(quizz).values({
        title,
        question: question
      }).returning()

      await tx.insert(quizzPlayer).values({
        quizzId: newQuizz[0].id,
        playerId: userId
      })

      return newQuizz
    })
  }),
  getQuizz: baseProcedure.input(z.object({
    id: z.number(),
    userId: z.number()
  })).query(async ({input}) => {  
    
    return await db.select({
      question: quizz.question,
      completedQuestions: quizzPlayer.completedQuestions,
      score: quizzPlayer.score,

    }).from(quizz)
    .leftJoin(quizzPlayer, eq(quizz.id, quizzPlayer.quizzId))
    .where(eq(quizz.id, input.id))
    .then(res => res[0])
  }),
  updateQuizz: baseProcedure.input(z.object({
    quizzId: z.number(),
    userId: z.number(),
    result: z.object({
      completedQuestions: z.number(),
      score: z.number()
    })
  })).mutation(async ({input}) => {
    const {quizzId, userId, result } = input
    return await db.update(quizzPlayer).set({
      completedQuestions: result.completedQuestions,
      score: result.score
    }).where(and(eq(quizzPlayer.quizzId, quizzId), eq(quizzPlayer.playerId, userId)))
  })
});
