'use client'

import { useRouter, usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Target, 
  FolderKanban, 
  TrendingUp, 
  LogOut,
  Rocket
} from 'lucide-react'
import { useUIStore } from '@/lib/store/ui-store'

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { isMobile, setSidebarOpen } = useUIStore()

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    router.push('/')
  }

  const navigate = (path: string) => {
    router.push(path)
    if (isMobile) setSidebarOpen(false)
  }

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Target, label: 'Skills', path: '/skills' },
    { icon: FolderKanban, label: 'Projects', path: '/projects' },
    { icon: TrendingUp, label: 'Progress', path: '/progress' },
  ]

  return (
    <aside className="h-full w-full glass border-r border-white/10 p-6 flex flex-col relative">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg">
          <Rocket className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold gradient-text">SkillSphere</h1>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 flex-1">
        {navItems.map((item) => (
          <NavItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            active={pathname === item.path}
            onClick={() => navigate(item.path)}
          />
        ))}
      </nav>

      {/* Logout Button */}
      <div className="mt-auto pt-6 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all group"
        >
          <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

function NavItem({ icon: Icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        active
          ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/50'
          : 'text-gray-400 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  )
}
