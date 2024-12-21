/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseProcedure, createTRPCRouter } from '../init';
import { db } from '@/db/drizzle';
import { quizz, quizzInsert, quizzPlayer } from '@/db/schema';
import RedisClient from '@/redis';
import { eq, desc, sql, and } from 'drizzle-orm';
import { z } from 'zod';

const client = await RedisClient.getInstance()


export const quizzRouter = createTRPCRouter({
  getAll: baseProcedure.query(async () => {
    const quizzes = await db.select({
      title: quizz.title,
      id: quizz.id,
      count: sql<number>`count(${quizz.id})`
    }).from(quizz)
    .leftJoin(quizzPlayer, eq(quizz.id, quizzPlayer.quizzId))
    .groupBy(quizz.id)
    .orderBy(desc(quizz.id));
    return quizzes;
  }),
  create: baseProcedure.input(quizzInsert.extend({
    userId: z.number(),
    name: z.string()
  })).mutation(async ({input}) => {
    const {question, title, userId, name} = input
    return await db.transaction(async (tx) => {
      const newQuizz = await tx.insert(quizz).values({
        title,
        question: question
      }).returning()
      await tx.insert(quizzPlayer).values({
        quizzId: newQuizz[0].id,
        playerId: userId
      })
      client.zAdd(`quizz:${newQuizz[0].id}`, [{score: 0, value: name}])
      return newQuizz
    })
  }),
  joinQuizz: baseProcedure.input(z.object({
    quizzId: z.number(),
    userId: z.number(),
    name: z.string()
  })).mutation(async ({input}) => {
    const {quizzId, userId, name} = input
    client.zAdd(`quizz:${quizzId}`, [{score: 0, value: name}])
    try {
      await db.insert(quizzPlayer).values({
        quizzId,
        playerId: userId
      })
    } catch (error) {
      console.error(error)
    }
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
    name: z.string(),
    result: z.object({
      completedQuestions: z.number(),
      score: z.number()
    })
  })).mutation(async ({input}) => {
    const {quizzId, userId, result, name } = input
    client.zAdd(`quizz:${quizzId}`, [{score: result.score, value: name}])
    return await db.update(quizzPlayer).set({
      completedQuestions: result.completedQuestions,
      score: result.score
    }).where(and(eq(quizzPlayer.quizzId, quizzId), eq(quizzPlayer.playerId, userId)))
  })
});
