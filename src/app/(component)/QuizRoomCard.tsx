'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import useNameStore from "@/store/name"
import { trpc } from "@/trpc/client"
import { Trophy, Users } from "lucide-react"
import { useRouter } from "next/navigation"

export function QuizRoomCard() {
  const { data: rooms, error, isLoading } = trpc.quizz.getAll.useQuery()
  const { id: userId, name } = useNameStore()
  const joinMutation = trpc.quizz.joinQuizz.useMutation()

  const joinQuizz = (quizzId: number) => {
    joinMutation.mutateAsync({quizzId, userId, name}).then(() => router.push(`/quizz/${quizzId}`))
  }

  const router = useRouter()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!rooms) return <div>No room found</div>
  return (
    <>
      {
        rooms.map((room) => <Card key={room.id} className="flex flex-col backdrop-blur-sm bg-white/50 hover:bg-white/70 transition-colors">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span className="truncate">{room.title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center">
                <Users className="mr-1 h-4 w-4" />
                {room.count} players
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant={"default"} onClick={() => joinQuizz(room.id)}>
              <Trophy className="mr-2 h-4 w-4" />
              {"Join Now"}
            </Button>
          </CardFooter>
        </Card>)
      }
    </>

  )
} 