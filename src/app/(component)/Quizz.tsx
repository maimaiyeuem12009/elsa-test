"use client"

import { QuizRoomCard } from "./QuizRoomCard"
import { CreateNewQuizz } from "./CreateNewQuizz"

export default function Page() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="flex-1 container mx-auto px-4">
        <section className="space-y-6 pt-32 pb-8 md:pt-24 md:pb-12">
          <div className="flex max-w-[64rem] flex-col items-center gap-4 text-center mx-auto">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl ">
              English Quiz Room
            </h1>
            <CreateNewQuizz />
          </div>
        </section>

        <section className="py-8 md:py-12">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Current Rooms
            </h2>
          </div>

          <div className="grid gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
            <QuizRoomCard />
          </div>
        </section>
      </div>
    </div>
  )
}

