import { create } from 'zustand'
import type { User, Conversation } from '@/types'

interface AppState {
  user: User | null
  setUser: (user: User | null) => void
  conversations: Conversation[]
  setConversations: (conversations: Conversation[]) => void
  unreadCount: number
  setUnreadCount: (count: number) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  conversations: [],
  setConversations: (conversations) => set({ conversations }),
  unreadCount: 0,
  setUnreadCount: (count) => set({ unreadCount: count }),
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}))
