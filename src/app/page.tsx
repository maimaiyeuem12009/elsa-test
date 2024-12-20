
import { HydrateClient } from '@/trpc/server';
import {Todo} from '@/app/(component)/Todo';
import { TestStream } from './(component)/TestStream';
import { AskingName } from './(component)/AskingName';

export default async function Home() {
  return (
    <HydrateClient>
      <AskingName />
      <Todo />
      <TestStream />
    </HydrateClient>
  );
}