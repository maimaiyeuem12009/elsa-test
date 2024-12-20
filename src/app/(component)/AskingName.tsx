'use client'

import { useState } from 'react'
import useNameStore from '@/store/name'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function AskingName() {
  const { name, setName } = useNameStore()
  const [inputName, setInputName] = useState(name)
  return (
    <div>
      <label htmlFor="name">What is your name?</label>
      <Input
        id="name"
        type="text"
        value={inputName}
        onChange={(e) => setInputName(e.target.value)}
      />
      <Button onClick={() => setName(inputName)}>Submit</Button>
    </div>
  )
}
