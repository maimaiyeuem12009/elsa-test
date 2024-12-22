import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface NameState {
  name: string
  id: number
  setName: (name: { id: number, name: string }) => void
  signOut: () => void
}

const useNameStore = create<NameState>()(
  persist(
    (set) => ({
      name: '',
      id: 0,
      setName: ({
        id, name
      }) => set({ id, name }),
      signOut: () => set({ name: '', id: 0 }),
    }),
    {
      name: 'name-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export default useNameStore
