'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authAPI, skillsAPI, projectsAPI, progressAPI } from '@/lib/api'
import { calculateStreak } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Target, 
  FolderKanban, 
  TrendingUp, 
  LogOut,
  Flame,
  Award,
  Clock,
  Plus
} from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [skills, setSkills] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [recentLogs, setRecentLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [userRes, skillsRes, projectsRes, logsRes] = await Promise.all([
        authAPI.getCurrentUser(),
        skillsAPI.getSkills(),
        projectsAPI.getProjects(),
        progressAPI.getRecentLogs(30),
      ])

      setUser(userRes.data)
      setSkills(skillsRes.data)
      setProjects(projectsRes.data)
      setRecentLogs(logsRes.data)
      setStreak(calculateStreak(logsRes.data))
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      router.push('/auth/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  const completedProjects = projects.filter(p => p.status === 'completed').length
  const totalHours = recentLogs.reduce((sum, log) => sum + (log.hours_spent || 0), 0)

  // Chart data
  const activityData = recentLogs.slice(0, 7).reverse().map(log => ({
    date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    hours: log.hours_spent || 0,
  }))

  const skillLevelData = skills.map(skill => ({
    name: skill.name,
    hours: skill.hours_invested || 0,
  })).slice(0, 5)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 glass border-r border-white/10 p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold gradient-text">SkillSphere</h1>
        </div>

        <nav className="space-y-2">
          <NavItem icon={<LayoutDashboard />} label="Dashboard" active />
          <NavItem icon={<Target />} label="Skills" onClick={() => router.push('/skills')} />
          <NavItem icon={<FolderKanban />} label="Projects" onClick={() => router.push('/projects')} />
          <NavItem icon={<TrendingUp />} label="Progress" onClick={() => router.push('/progress')} />
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.full_name || user?.username}! 👋
          </h2>
          <p className="text-gray-400">Here's your learning progress overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Flame className="w-6 h-6" />}
            title="Current Streak"
            value={`${streak} days`}
            color="from-orange-500 to-red-500"
          />
          <StatCard
            icon={<Target className="w-6 h-6" />}
            title="Active Skills"
            value={skills.length}
            color="from-blue-500 to-cyan-500"
          />
          <StatCard
            icon={<Award className="w-6 h-6" />}
            title="Completed Projects"
            value={completedProjects}
            color="from-green-500 to-emerald-500"
          />
          <StatCard
            icon={<Clock className="w-6 h-6" />}
            title="Hours This Month"
            value={totalHours}
            color="from-purple-500 to-pink-500"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Activity Chart */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Weekly Activity</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                />
                <Line type="monotone" dataKey="hours" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Skills Chart */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Top Skills by Hours</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={skillLevelData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="hours" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Recent Projects</h3>
            <button
              onClick={() => router.push('/projects')}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              New Project
            </button>
          </div>

          {projects.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No projects yet. Create your first project!</p>
          ) : (
            <div className="space-y-4">
              {projects.slice(0, 5).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function NavItem({ icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        active
          ? 'bg-primary-500 text-white'
          : 'text-gray-400 hover:text-white hover:bg-white/5'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

function StatCard({ icon, title, value, color }: any) {
  return (
    <div className="glass rounded-2xl p-6 card-hover">
      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-white mb-4`}>
        {icon}
      </div>
      <p className="text-gray-400 text-sm mb-1">{title}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  )
}

function ProjectCard({ project }: any) {
  const statusColors: any = {
    planning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    in_progress: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    completed: 'bg-green-500/20 text-green-400 border-green-500/50',
    on_hold: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-white font-semibold mb-1">{project.title}</h4>
          <p className="text-gray-400 text-sm line-clamp-2">{project.description}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[project.status] || statusColors.planning}`}>
          {project.status.replace('_', ' ')}
        </span>
      </div>
    </div>
  )
}
