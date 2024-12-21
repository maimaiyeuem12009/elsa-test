'use client'

import useNameStore from "@/store/name"
import { UserCircle } from "lucide-react"

export function Header() {
  const { name } = useNameStore()
  return (
    <header className="absolute z-50 top-0 left-0 w-full h-16 px-6 shadow-lg backdrop-blur-sm flex justify-between items-center">
    <div className="flex items-center space-x-2">
      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
        <span className="text-2xl font-bold">A</span>
      </div>
      <span className="text-xl font-semibolb">English Quizz</span>
    </div>
    <div className="flex items-center space-x-4">
      <p className="text-lg">
        <span>
          {
            name ? `Welcome, ${name}` : "Welcome to English Quizz"
          }
        </span>
      </p>
      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
        <UserCircle className="text-white" size={24} />
      </div>
    </div>
  </header>

  )
}