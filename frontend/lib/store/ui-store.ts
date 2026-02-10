import { create } from 'zustand'

interface UIState {
    isMobile: boolean
    isTablet: boolean
    isDesktop: boolean
    isSidebarOpen: boolean
    activeTab: string

    // Setters
    setDeviceType: (width: number) => void
    toggleSidebar: () => void
    setSidebarOpen: (isOpen: boolean) => void
    setActiveTab: (tab: string) => void
}

export const useUIStore = create<UIState>((set) => ({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isSidebarOpen: false,
    activeTab: 'dashboard',

    setDeviceType: (width: number) => {
        const isMobile = width < 768
        const isTablet = width >= 768 && width < 1024
        const isDesktop = width >= 1024
        set({ isMobile, isTablet, isDesktop, isSidebarOpen: isDesktop ? true : false })
    },

    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    setSidebarOpen: (isOpen: boolean) => set({ isSidebarOpen: isOpen }),
    setActiveTab: (tab: string) => set({ activeTab: tab }),
}))
