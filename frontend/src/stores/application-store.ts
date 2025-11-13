import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ApplicationState = {
  appliedJobIds: Set<string>
  applyForJob: (jobId: string) => void
  hasApplied: (jobId: string) => boolean
}

export const useApplicationStore = create<ApplicationState>()(
  persist(
    (set, get) => ({
      appliedJobIds: new Set(),
      applyForJob: (jobId: string) => {
        set((state) => ({
          appliedJobIds: new Set(state.appliedJobIds).add(jobId),
        }))
      },
      hasApplied: (jobId: string) => {
        return get().appliedJobIds.has(jobId)
      },
    }),
    {
      name: 'job-application-storage',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name)
          if (!str) return null
          const { state } = JSON.parse(str)
          return {
            state: {
              ...state,
              appliedJobIds: new Set(state.appliedJobIds),
            },
          }
        },
        setItem: (name, newValue) => {
          const str = JSON.stringify({
            state: {
              ...newValue.state,
              appliedJobIds: Array.from(newValue.state.appliedJobIds),
            },
          })
          localStorage.setItem(name, str)
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    },
  ),
)
