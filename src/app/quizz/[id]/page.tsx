/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { cn } from "@/lib/utils"
import Quiz from "./(component)/QuizzDetail"
import { trpc } from "@/trpc/client"
import useNameStore from "@/store/name"
import { useParams } from "next/navigation"

export default function QuizzPage() {
  const params = useParams<{ id: string }>()
  const { id: userId } = useNameStore()
  const {data: quizData, isRefetching } = trpc.quizz.getQuizz.useQuery({id: Number(params.id), userId}, {
    enabled: !!userId,
    refetchOnMount: 'always',
  })
  console.log({
    isRefetching
  })
  if (!quizData || quizData.completedQuestions === undefined || !quizData.score === undefined || isRefetching) 
    return <div>Loading...</div>
  return (
    <div className={cn("mt-24 text-center")}>
      <Quiz quizData={quizData as any}/>
    </div>
  )
} 