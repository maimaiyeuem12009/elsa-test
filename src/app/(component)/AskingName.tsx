'use client'

import { useState } from 'react'
import useNameStore from '@/store/name'
import { Input } from '@/components/ui/input'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { trpc } from '@/trpc/client'

export function AskingName() {
  const { name, setName } = useNameStore()
  const [inputName, setInputName] = useState(name)

  const createQuery = trpc.player.create.useMutation()
  const createPlayer = () => {
    createQuery.mutateAsync({
      name: inputName,
    }).then((data) => {
      setName(data[0])
    })
  }


  return (
    <AlertDialog open={!name}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>What is your name</AlertDialogTitle>
          <AlertDialogDescription>
          Please enter your name to continue playing the quiz game. Your name will be displayed to other players in the room.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Input value={inputName} onChange={(e) => setInputName(e.target.value)}/>
        <AlertDialogFooter>
          <AlertDialogAction onClick={createPlayer}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
