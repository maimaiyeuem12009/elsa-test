"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { trpc } from '@/trpc/client'
import useNameStore from '@/store/name'
import { z } from 'zod'
import { questionSchema } from '@/validator/question'
import { useParams, useRouter } from 'next/navigation'
import { Scoreboard } from './ScoreBoard'
import { useQueryClient } from '@tanstack/react-query'

const QUESTION_TIME = 20 // seconds
const MAX_POINTS = 1000

interface QuizProps {
  quizData: {
    question: z.infer<typeof questionSchema>
    completedQuestions: number
    score: number
  }
}

// Mock data for the scoreboard
const mockScores = [
  { name: "Alice", score: 2500, id: 1 },
  { name: "Bob", score: 2300, id: 2 },
  { name: "Charlie", score: 2100, id: 3 },
  { name: "David", score: 1900, id: 4 },
  { name: "Eve", score: 1700, id: 5 },
]

export default function Quiz({ quizData: { question , completedQuestions, score}}: QuizProps) {
  const { id: userId, name } = useNameStore()
  const { id: quizzId } = useParams<{ id: string}>()
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(completedQuestions)
  const client = useQueryClient()

  console.log('quizData', { question, completedQuestions, score })
  const isQuizFinished = currentQuestion === question.length
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME)
  const [points, setPoints] = useState(0)
  const [totalPoints, setTotalPoints] = useState(score)
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    if (showResult === true) {
      updateQuizz.mutate({
        userId: userId,
        quizzId: Number(quizzId),
        name: name,
        result: {
          score: totalPoints,
          completedQuestions: currentQuestion + 1,
        }
      })
      client.invalidateQueries({ queryKey: [["quizz","getQuizz"],{"input":{"id": quizzId,userId},"type":"query"}]
      })

    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showResult])

  
  const updateQuizz = trpc.quizz.updateQuizz.useMutation()

  // const 

  useEffect(() => {
    if (timeLeft > 0 && !showResult && !isQuizFinished) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !showResult) {
      setShowResult(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, showResult])

  const handleAnswer = (selectedAnswer: string) => {
    const isCorrect = selectedAnswer === question[currentQuestion].answer
    const earnedPoints = isCorrect ? Math.round((timeLeft / QUESTION_TIME) * MAX_POINTS) : 0
    console.log('handleAnswer', { earnedPoints, totalPoints, newTotal: totalPoints + earnedPoints })
    setPoints(earnedPoints)
    setTotalPoints(totalPoints + earnedPoints)
    setShowResult(true)
  }

  const nextQuestion = () => {
    if (currentQuestion < question.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setTimeLeft(QUESTION_TIME)
      setShowResult(false)
    } else {
      // Quiz finished
      alert(`Quiz completed! Total points: ${totalPoints + points}`)
    }
  }

  const buttonColors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500']

  return (
    <Card className="w-full max-w-2xl mx-auto mt-10">
      <CardHeader>
        <Scoreboard scores={mockScores} userScore={{
          id: userId,
          name,
          score: totalPoints,
        }} />
        { timeLeft }
        <CardTitle className="text-2xl font-bold text-center">{isQuizFinished ? "Your result ": `Quiz Question ${currentQuestion + 1}`}</CardTitle>
      </CardHeader>
      <CardContent>
        {isQuizFinished 
        ? 
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold mb-4">Your score: {totalPoints}</h1>
          <Button onClick={() => router.push('/')}>Go to home</Button>
        </div>
        : <>
         <p className="text-xl mb-6">{question[currentQuestion].question}</p>
        <div className="grid grid-cols-2 gap-4">
          {question[currentQuestion].options.map((option, index) => (
            <Button
              key={index}
              className={`${buttonColors[index]} hover:opacity-80 text-white p-4 text-lg h-auto`}
              onClick={() => handleAnswer(option.charAt(0))}
              disabled={showResult}
            >
              {option}
            </Button>
          ))}
        </div>
        </>
       
        }
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        {!isQuizFinished && <>
          <div className="text-lg font-semibold">Time left: {timeLeft}s</div>
        {showResult && (
          <div className="text-center">
            <p className="text-xl font-bold mb-2">Points: {points}</p>
            <Button onClick={nextQuestion}>Next Question</Button>
          </div>
        )}
        </>}
      </CardFooter>
    </Card>
  )
}

