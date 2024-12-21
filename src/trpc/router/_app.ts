
import { createTRPCRouter } from '../init';
import { playerRouter } from './player';
import { quizzRouter } from './quizz';

export const appRouter = createTRPCRouter({
  quizz: quizzRouter,
  player: playerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;