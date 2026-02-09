'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { progressAPI } from '@/lib/api'
import { formatDate, getMoodEmoji, groupByDate } from '@/lib/utils'
import { 
  TrendingUp, 
  Plus, 
  Calendar,
  Clock,
  Smile,
  X,
  Save
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
      await progressAPI.createLog(formData)
      await loadLogs()
      handleCloseModal()
    } catch (error) {
      console.error('Failed to save log:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this log?')) {
      try {
        await progressAPI.deleteLog(id)
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  const totalHours = logs.reduce((sum, log) => sum + (log.hours_spent || 0), 0)
  const avgHours = logs.length > 0 ? (totalHours / logs.length).toFixed(1) : 0
  const groupedLogs = groupByDate(logs)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Progress</h1>
            <p className="text-gray-400">Track your daily learning progress</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all"
          >
            <Plus className="w-5 h-5" />
            Log Progress
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Logs</p>
                <p className="text-3xl font-bold text-white mt-1">{logs.length}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-primary-500" />
            </div>
          </div>
          
          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Hours</p>
                <p className="text-3xl font-bold text-white mt-1">{totalHours.toFixed(1)}</p>
              </div>
              <Clock className="w-10 h-10 text-blue-500" />
            </div>
          </div>
          
          <div className="glass rounded-xl p-6">
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
        <div className="space-y-8">
          {Object.entries(groupedLogs).map(([date, dateLogs]) => (
            <div key={date}>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2 glass rounded-lg px-4 py-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-white font-semibold">{date}</span>
                </div>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              <div className="grid grid-cols-1 gap-4">
                {dateLogs.map((log) => (
                  <div key={log.id} className="glass rounded-xl p-6 hover:scale-[1.02] transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-start gap-3">
                        {log.mood && (
                          <span className="text-3xl">{getMoodEmoji(log.mood)}</span>
                        )}
                        <div>
                          <h3 className="text-xl font-bold text-white">{log.title}</h3>
                          {log.hours_spent !== undefined && log.hours_spent > 0 && (
                            <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                              <Clock className="w-4 h-4" />
                              <span>{log.hours_spent} {log.hours_spent === 1 ? 'hour' : 'hours'}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(log.id)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
                      </button>
                    </div>

                    {log.description && (
                      <p className="text-gray-300 leading-relaxed">{log.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {logs.length === 0 && (
          <div className="text-center py-16">
            <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No progress logs yet. Start logging your progress!</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass rounded-2xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Log Progress</h2>
              <button onClick={handleCloseModal} className="p-2 hover:bg-white/10 rounded-lg">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

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
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  rows={3}
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
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Mood
                  </label>
                  <select
                    value={formData.mood}
                    onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {moodOptions.map((option) => (
                      <option key={option.value} value={option.value} className="bg-gray-900">
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
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
