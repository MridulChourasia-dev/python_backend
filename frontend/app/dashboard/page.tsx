'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authAPI, skillsAPI, projectsAPI, progressAPI } from '@/lib/api'
import { calculateStreak } from '@/lib/utils'
import SmoothLayout from '@/components/SmoothLayout'
import LoadingSpinner from '@/components/LoadingSpinner'
import EmptyState from '@/components/EmptyState'
import { 
  Flame,
  Award,
  Clock,
  Plus,
  Target,
  FolderKanban
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

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading your dashboard..." />
  }

  const completedProjects = projects.filter(p => p.status === 'completed').length
  const totalHours = recentLogs.reduce((sum, log) => sum + (log.hours_spent || 0), 0)

  // Chart data
  const activityData = recentLogs.slice(0, 7).reverse().map(log => ({
    date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    hours: log.hours_spent || 0,
  }))

  const skillLevelData = skills.slice(0, 5).map(skill => ({
    name: skill.name.length > 10 ? skill.name.substring(0, 10) + '...' : skill.name,
    hours: skill.hours_invested || 0,
  }))

  return (
    <SmoothLayout>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          Welcome back, {user?.full_name || user?.username}! 👋
        </h2>
        <p className="text-gray-400">Here's your learning progress overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
          value={Math.round(totalHours)}
          color="from-purple-500 to-pink-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Activity Chart */}
        <div className="glass rounded-2xl p-6 hover:translate-y-[-4px] transition-transform duration-300">
          <h3 className="text-xl font-bold text-white mb-4">Weekly Activity</h3>
          {activityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Line type="monotone" dataKey="hours" stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-400">
              No activity data yet
            </div>
          )}
        </div>

        {/* Skills Chart */}
        <div className="glass rounded-2xl p-6 hover:translate-y-[-4px] transition-transform duration-300">
          <h3 className="text-xl font-bold text-white mb-4">Top Skills by Hours</h3>
          {skillLevelData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={skillLevelData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="hours" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-400">
              No skills added yet
            </div>
          )}
        </div>
      </div>

      {/* Recent Projects */}
      <div className="glass rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h3 className="text-xl font-bold text-white">Recent Projects</h3>
          <button
            onClick={() => router.push('/projects')}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-all hover:scale-105 shadow-lg shadow-primary-500/30"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>

        {projects.length === 0 ? (
          <EmptyState
            icon={FolderKanban}
            title="No Projects Yet"
            description="Create your first project to start tracking your learning journey"
            actionLabel="Create Project"
            onAction={() => router.push('/projects')}
          />
        ) : (
          <div className="space-y-4">
            {projects.slice(0, 5).map((project) => (
              <ProjectCard key={project.id} project={project} onClick={() => router.push('/projects')} />
            ))}
          </div>
        )}
      </div>
    </SmoothLayout>
  )
}

function StatCard({ icon, title, value, color }: any) {
  return (
    <div className="glass rounded-2xl p-6 card-hover">
      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-white mb-4 shadow-lg`}>
        {icon}
      </div>
      <p className="text-gray-400 text-sm mb-1">{title}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  )
}

function ProjectCard({ project, onClick }: any) {
  const statusColors: any = {
    planning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    in_progress: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    completed: 'bg-green-500/20 text-green-400 border-green-500/50',
    on_hold: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
  }

  const statusLabels: any = {
    planning: 'Planning',
    in_progress: 'In Progress',
    completed: 'Completed',
    on_hold: 'On Hold',
  }

  return (
    <div 
      onClick={onClick}
      className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all cursor-pointer hover:scale-[1.02] hover:shadow-lg"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-white font-semibold mb-1">{project.title}</h4>
          <p className="text-gray-400 text-sm line-clamp-2">{project.description || 'No description'}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[project.status] || statusColors.planning}`}>
          {statusLabels[project.status] || 'Planning'}
        </span>
      </div>
    </div>
  )
}
