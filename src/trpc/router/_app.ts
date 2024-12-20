import { createTRPCRouter } from '../init';
import { todoRouter } from './todo';

export const appRouter = createTRPCRouter({
  todo: todoRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;