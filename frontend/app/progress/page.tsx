'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { progressAPI } from '@/lib/api'
import { formatDate,  groupByDate } from '@/lib/utils'
import SmoothLayout from '@/components/SmoothLayout'
import LoadingSpinner from '@/components/LoadingSpinner'
import Modal from '@/components/Modal'
import { 
  TrendingUp, 
  Plus, 
  Calendar,
  Clock,
  Save,
  Trash2
} from 'lucide-react'

interface ProgressLog {
  id: number
  date: string
  title: string
  description?: string
  hours_spent?: number
  mood?: string
  created_at: string
  updated_at: string
}

const moodOptions = [
  { value: 'excellent', label: 'Excellent', emoji: '🤩' },
  { value: 'good', label: 'Good', emoji: '😊' },
  { value: 'okay', label: 'Okay', emoji: '😐' },
  { value: 'bad', label: 'Bad', emoji: '😞' },
  { value: 'terrible', label: 'Terrible', emoji: '😢' }
]

const getMoodEmoji = (mood: string): string => {
  const option = moodOptions.find(opt => opt.value === mood)
  return option?.emoji || '😐'
}

export default function ProgressPage() {
  const router = useRouter()
  const [logs, setLogs] = useState<ProgressLog[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    title: '',
    description: '',
    hours_spent: 0,
    mood: 'good'
  })

  useEffect(() => {
    loadLogs()
  }, [])

  const loadLogs = async () => {
    try {
      const response = await progressAPI.getRecentLogs(90)
      setLogs(response.data)
    } catch (error) {
      console.error('Failed to load progress logs:', error)
      router.push('/auth/login')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await progressAPI.createProgressLog(formData)
      await loadLogs()
      handleCloseModal()
    } catch (error) {
      console.error('Failed to save log:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this log?')) {
      try {
        await progressAPI.deleteProgressLog(id)
        await loadLogs()
      } catch (error) {
        console.error('Failed to delete log:', error)
      }
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setFormData({
      date: new Date().toISOString().split('T')[0],
      title: '',
      description: '',
      hours_spent: 0,
      mood: 'good'
    })
  }

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading your progress..." />
  }

  const totalHours = logs.reduce((sum, log) => sum + (log.hours_spent || 0), 0)
  const avgHours = logs.length > 0 ? (totalHours / logs.length).toFixed(1) : 0
  const groupedLogs = groupByDate(logs)

  return (
    <SmoothLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Progress</h1>
            <p className="text-gray-400">Track your daily learning progress</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all shadow-lg shadow-primary-500/30 w-full sm:w-auto justify-center"
          >
            <Plus className="w-5 h-5" />
            Log Progress
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="glass rounded-xl p-6 hover:translate-y-[-4px] transition-transform shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Logs</p>
                <p className="text-3xl font-bold text-white mt-1">{logs.length}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-primary-500" />
            </div>
          </div>
          
          <div className="glass rounded-xl p-6 hover:translate-y-[-4px] transition-transform shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Hours</p>
                <p className="text-3xl font-bold text-white mt-1">{totalHours.toFixed(1)}</p>
              </div>
              <Clock className="w-10 h-10 text-blue-500" />
            </div>
          </div>
          
          <div className="glass rounded-xl p-6 hover:translate-y-[-4px] transition-transform shadow-xl sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avg Hours/Day</p>
                <p className="text-3xl font-bold text-white mt-1">{avgHours}</p>
              </div>
              <Calendar className="w-10 h-10 text-green-500" />
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-12 relative before:absolute before:inset-y-0 before:left-8 before:w-px before:bg-white/5">
          {Object.entries(groupedLogs).map(([date, dateLogs]) => (
            <div key={date} className="relative pl-16">
              {/* Date Marker */}
              <div className="absolute left-6 top-1 w-4 h-4 rounded-full bg-primary-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] z-10" />
              
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-primary-400 bg-primary-500/10 px-3 py-1 rounded-full">{date}</span>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {dateLogs.map((log) => (
                  <div key={log.id} className="glass rounded-2xl p-6 hover:border-white/20 transition-all group relative overflow-hidden shadow-lg">
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleDelete(log.id)}
                        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors group/del"
                      >
                        <Trash2 className="w-4 h-4 text-gray-500 group-hover/del:text-red-500" />
                      </button>
                    </div>

                    <div className="flex items-start gap-5">
                      {log.mood && (
                        <div className="text-4xl filter drop-shadow-lg shrink-0">{getMoodEmoji(log.mood)}</div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">{log.title}</h3>
                        
                        <div className="flex flex-wrap gap-4 items-center">
                          {log.hours_spent !== undefined && log.hours_spent > 0 && (
                            <div className="flex items-center gap-1.5 text-sm font-semibold text-blue-400">
                              <Clock className="w-4 h-4" />
                              <span>{log.hours_spent} {log.hours_spent === 1 ? 'hour' : 'hours'}</span>
                            </div>
                          )}
                          <div className="text-xs text-gray-500 flex items-center gap-1.5 uppercase font-bold tracking-tighter">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Logged at {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>

                        {log.description && (
                          <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/5">
                            <p className="text-gray-300 leading-relaxed text-sm">{log.description}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {logs.length === 0 && (
          <div className="text-center py-24 bg-white/5 rounded-3xl border border-dashed border-white/10 mt-8">
            <div className="p-6 bg-primary-500/10 rounded-full w-fit mx-auto mb-6">
              <TrendingUp className="w-16 h-16 text-primary-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight">No progress track yet</h2>
            <p className="text-gray-500 max-w-sm mx-auto mb-8">Consistency is key. Start logging your daily wins and watch your growth over time.</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-bold transition-all shadow-xl shadow-primary-500/20"
            >
              Log Your First Entry
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title="Log Progress"
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Date
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-3 bg-[#111827] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 font-semibold"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-[#111827] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 font-semibold"
              placeholder="What did you work on?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-[#111827] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none h-28"
              placeholder="Describe what you learned or accomplished..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Hours Spent
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={formData.hours_spent}
                onChange={(e) => setFormData({ ...formData, hours_spent: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-[#111827] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Mood
              </label>
              <select
                value={formData.mood}
                onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                className="w-full px-4 py-3 bg-[#111827] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {moodOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.emoji} {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 text-white rounded-lg font-bold hover:bg-white/10 transition-colors uppercase tracking-widest text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs shadow-xl shadow-primary-500/20"
            >
              <Save className="w-5 h-5" />
              Save entry
            </button>
          </div>
        </form>
      </Modal>
    </SmoothLayout>
  )
}
