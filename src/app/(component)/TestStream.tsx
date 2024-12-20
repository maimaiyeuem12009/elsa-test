'use client'

import { trpc } from "@/trpc/client";

export function TestStream() {
  const { data } = trpc.todo.todoUpdates.useSubscription();

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}