import { create } from 'zustand'

interface NameState {
  name: string
  setName: (name: string) => void
}

const useNameStore = create<NameState>((set) => ({
  name: '',
  setName: (name) => set({ name }),
}))

export default useNameStore
