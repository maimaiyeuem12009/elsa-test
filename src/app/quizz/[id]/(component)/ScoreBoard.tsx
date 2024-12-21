import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

type Score = {
  name: string;
  id: number;
  score: number;
}

type ScoreboardProps = {
  scores: Score[];
  userScore: Score;
}

export function Scoreboard({ scores, userScore }: ScoreboardProps) {
  const topScores = scores.slice(0, 5);

  return (
    <Card className="w-[250px] absolute top-4 right-4 shadow-lg mt-24">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-center">Scoreboard</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] w-full rounded-md border p-4">
          {topScores.map((score, index) => (
            <div key={index} className="flex justify-between items-center py-2">
              <span className="font-medium">{score.name}</span>
              <span className="text-sm text-muted-foreground">{score.score}</span>
            </div>
          ))}
        </ScrollArea>
        <Separator className="my-4" />
        <div className="flex justify-between items-center py-2">
          <span className="font-medium">{userScore.name} (You)</span>
          <span className="text-sm text-muted-foreground">{userScore.score}</span>
        </div>
      </CardContent>
    </Card>
  )
}

