'use client'

import { useResponsive } from '@/hooks/use-responsive'
import { useUIStore } from '@/lib/store/ui-store'
import Sidebar from '@/components/Sidebar'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SmoothLayout({ children }: { children: React.ReactNode }) {
  // Sync screen size to Zustand
  useResponsive()
  
  const { isMobile, isSidebarOpen, toggleSidebar, setSidebarOpen } = useUIStore()

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
      {/* Sidebar - Desktop or Mobile Drawer */}
      <AnimatePresence mode="wait">
        {(isSidebarOpen || !isMobile) && (
          <motion.div
            initial={isMobile ? { x: -300 } : { width: 0 }}
            animate={isMobile ? { x: 0 } : { width: '256px' }}
            exit={isMobile ? { x: -300 } : { width: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed inset-y-0 left-0 z-50 ${!isMobile ? 'relative' : ''}`}
          >
            <Sidebar />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 relative flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Mobile Header */}
        {isMobile && (
          <header className="h-16 border-b border-white/10 flex items-center px-4 glass shrink-0">
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <span className="ml-4 font-bold gradient-text">SkillSphere</span>
          </header>
        )}

        {/* Dynamic Content Area with smooth transitions */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  )
}
