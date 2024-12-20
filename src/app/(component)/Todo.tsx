'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { PlusCircle, Trash2 } from 'lucide-react'
import { trpc } from '@/trpc/client'
import { useQueryClient } from '@tanstack/react-query'
import useNameStore from '@/store/name'

interface Todo {
  id: number
  name: string
  done: boolean
}

export function Todo() {
  const { data, isLoading, error } = trpc.todo.getAll.useQuery();
  const { name } = useNameStore()

  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: [["todo","getAll"],{"type":"query"}] });

  const [newTodoName, setNewTodoName] = useState('')
  const create = trpc.todo.create.useMutation();
  const toggle = trpc.todo.toggle.useMutation();
  const deleteT = trpc.todo.delete.useMutation();
  const addTodo = () => {
    create.mutateAsync({
      text: `${name}: ${newTodoName}`,
    }).then(invalidate);
    setNewTodoName('');
  }

  const toggleTodo = (id: number) => {
    toggle.mutateAsync({
      id: id,
    }).then(invalidate);
  }

  const deleteTodo = (id: number) => {
    console.log('Delete todo', id);
    deleteT.mutateAsync({
      id: id,
    }).then(invalidate);
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">My Todo List</h2>
      <div className="flex mb-4">
        <Input
          type="text"
          placeholder="Add a new todo..."
          value={newTodoName}
          onChange={(e) => setNewTodoName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addTodo();
            }
          }}
          className="flex-grow mr-2"
        />
        <Button onClick={addTodo} className="bg-green-500 hover:bg-green-600">
          <PlusCircle className="w-5 h-5" />
        </Button>
      </div>
      <ul className="space-y-2">
        {data!.map(todo => (
          <li key={todo.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
            <div className="flex items-center space-x-3">
              <Checkbox
                checked={todo.done}
                onCheckedChange={() => toggleTodo(todo.id)}
                className="border-gray-300"
              />
              <span className={`${todo.done ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                {todo.text}
              </span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => deleteTodo(todo.id)} className="text-red-500 hover:text-red-700">
              <Trash2 className="w-5 h-5" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}

