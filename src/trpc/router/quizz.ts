/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseProcedure, createTRPCRouter } from '../init';
import { db } from '@/db/drizzle';
import { quizz, quizzInsert, quizzPlayer } from '@/db/schema';
import RedisClient from '@/redis';
import { eq, desc, sql, and } from 'drizzle-orm';
import EventEmitter from 'events';
import { z } from 'zod';

const client = await RedisClient.getInstance()

const subscriber = client.duplicate()

const ee = new EventEmitter()

await subscriber.connect();
subscriber.subscribe('__keyevent@0__:zadd', async (channel) => {
  console.log('Received event', channel)
  const room = channel.split(':')[1]
  const data = await client.zRangeWithScores(`quizz:${room}`, 0, 2, {
    REV: true
  })
  ee.emit(room, data)
})

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
    try {
      await db.insert(quizzPlayer).values({
        quizzId,
        playerId: userId
      })
      client.zAdd(`quizz:${quizzId}`, [{score: 0, value: name}])
    } catch (error) {
      console.error(error)
    }
  }),
  getQuizz: baseProcedure.input(z.object({
    id: z.number(),
    userId: z.number()
  })).query(async ({input}) => {  
    console.log('Searching for quizz', input)
    return await db.select({
      question: quizz.question,
      completedQuestions: quizzPlayer.completedQuestions,
      score: quizzPlayer.score,
      name: quizz.title
    }).from(quizz)
    .leftJoin(quizzPlayer, eq(quizz.id, quizzPlayer.quizzId))
    .where(and(eq(quizz.id, input.id), eq(quizzPlayer.playerId, input.userId)))
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
  }),
  testGetList: baseProcedure.input(z.object({
    quizzId: z.number()
  })).subscription(async function* ({input}): AsyncGenerator<Array<{value: string, score: number}>, void, unknown> {
    yield await client.zRangeWithScores(`quizz:${input.quizzId}`, 0, 2, {
      REV: true, // Add REV: true to get scores in descending order
    })
    while (true) {
      const channel = await new Promise<Array<{value: string, score: number}>>(resolve => {
        ee.once(`${input.quizzId}`, (data) => {
          resolve(data);
        });
      });
      yield channel;
    }
  })
});
