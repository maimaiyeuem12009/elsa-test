'use client'

import { cn } from "@/lib/utils"
import Quiz from "./(component)/Quizz"
import { trpc } from "@/trpc/client"
import useNameStore from "@/store/name"
import { useParams } from "next/navigation"

export default function QuizzPage() {
  const params = useParams<{ id: string }>()
  const { id: userId } = useNameStore()
  const {data: quizData} = trpc.quizz.getQuizz.useQuery({id: Number(params.id), userId})
  if (!quizData) return <div>Loading...</div>
  return (
    <div className={cn("mt-24 text-center")}>
      Quiz ID: {params.id}
      <Quiz quizData={quizData} />
    </div>
  )
} 