'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { trpc } from "@/trpc/client"
import { count } from "console"
import { Trophy, Users } from "lucide-react"

export function QuizRoomCard() {
  const { data: rooms, error, isLoading } = trpc.quizz.getAll.useQuery()

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
            <Button className="w-full" variant={"default"}>
              <Trophy className="mr-2 h-4 w-4" />
              {"Join Now"}
            </Button>
          </CardFooter>
        </Card>)
      }
    </>

  )
} 