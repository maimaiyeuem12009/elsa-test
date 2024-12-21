/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { useForm } from "react-hook-form"
import { Form } from "@/components/ui/form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { AlertDialog } from "@/components/ui/alert-dialog"
import { FileInput } from "@/components/ui/fileInput"
import { omit } from "lodash-es"
import { questionSchema } from "@/validator/question"
import { trpc } from "@/trpc/client"
import useNameStore from "@/store/name"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"

const readJson = (file: File) => {
  return new Promise<z.infer<typeof questionSchema>>((resolve) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const json = JSON.parse(e.target?.result as string);
      resolve(Array.isArray(json) ? json : [json]);
    };
    reader.readAsText(file);
  });
}

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  file: z.custom<File>((val) => {
    return val instanceof File
  }, "Please upload a valid JSON file").refine(async (val) => {
    const data = await readJson(val)
    return questionSchema.safeParse(data).success
  }, "Please upload a valid JSON file containing quiz questions"),
})

export function CreateNewQuizz() {
  const client = useQueryClient()
  const router = useRouter()
  const { id, name } = useNameStore()
  const createQuizz = trpc.quizz.create.useMutation()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: ""
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const jsonData = await readJson(data.file)
    const newQuizz = await createQuizz.mutateAsync({
      title: data.title,
      question: jsonData,
      name,
      userId: id
    })
    client.invalidateQueries({
      queryKey: [
        [
          "quizz",
          "getAll"
        ],
        {
          "type": "query"
        }
      ]
    })
    router.push(`/quizz/${newQuizz[0].id}`)
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-5 w-5" /> Create New Room
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create New Quiz Room</AlertDialogTitle>
          <AlertDialogDescription>
            Fill in the details to create a new quiz room.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title of the Quiz</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormDescription>This is your public room name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload a JSON file</FormLabel>
                  <FormControl>
                    <FileInput {...omit(field, 'value')} accept=".json" onFileSelect={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AlertDialogFooter className="mt-4">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button type="submit">Create</Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
