
import { HydrateClient } from '@/trpc/server';
import Quizz from './(component)/Quizz';

export default async function Home() {
  return (
    <HydrateClient>
      <Quizz />
    </HydrateClient>
  );
}