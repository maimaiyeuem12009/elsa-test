"use client"

import * as React from "react"
import { Upload } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface FileInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onFileSelect?: (file: File | null) => void
}

export function FileInput({
  onFileSelect,
  ...props
}: FileInputProps) {
  const [fileName, setFileName] = React.useState<string>("")
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    if (file) {
      setFileName(file.name)
      onFileSelect?.(file)
    } else {
      setFileName("")
      onFileSelect?.(null)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="flex items-center space-x-2">
      <Input
        type="text"
        placeholder="No file selected"
        value={fileName}
        readOnly
        className="flex-grow"
      />
      <Button
        type="button"
        onClick={handleButtonClick}
        className="flex items-center"
      >
        <Upload className="mr-2 h-4 w-4" />
        Select File
      </Button>
      <Input
        {...props}
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  )
}

