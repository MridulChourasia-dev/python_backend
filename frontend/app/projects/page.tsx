'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { projectsAPI } from '@/lib/api'
import { formatDate } from '@/lib/utils'

const getProjectStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    planning: 'text-blue-400',
    active: 'text-green-400',
    completed: 'text-emerald-400',
    on_hold: 'text-yellow-400'
  }
  return colorMap[status] || 'text-gray-400'
}
import { 
  FolderKanban, 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Save,
  Calendar,
  CheckCircle2,
  Clock,
  Pause
} from 'lucide-react'

interface Project {
  id: number
  title: string
  description?: string
  status: string
  start_date?: string
  end_date?: string
  created_at: string
  updated_at: string
}

const statusOptions = [
  { value: 'planning', label: 'Planning', icon: Clock },
  { value: 'active', label: 'Active', icon: FolderKanban },
  { value: 'completed', label: 'Completed', icon: CheckCircle2 },
  { value: 'on_hold', label: 'On Hold', icon: Pause }
]

export default function ProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'planning',
    start_date: '',
    end_date: ''
  })

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const response = await projectsAPI.getProjects()
      setProjects(response.data)
    } catch (error) {
      console.error('Failed to load projects:', error)
      router.push('/auth/login')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingProject) {
        await projectsAPI.updateProject(editingProject.id, formData)
      } else {
        await projectsAPI.createProject(formData)
      }
      await loadProjects()
      handleCloseModal()
    } catch (error) {
      console.error('Failed to save project:', error)
    }
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description || '',
      status: project.status,
      start_date: project.start_date || '',
      end_date: project.end_date || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await projectsAPI.deleteProject(id)
        await loadProjects()
      } catch (error) {
        console.error('Failed to delete project:', error)
      }
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingProject(null)
    setFormData({
      title: '',
      description: '',
      status: 'planning',
      start_date: '',
      end_date: ''
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  const groupedProjects = statusOptions.map(status => ({
    ...status,
    projects: projects.filter(p => p.status === status.value)
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Projects</h1>
            <p className="text-gray-400">Manage your learning projects</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all"
          >
            <Plus className="w-5 h-5" />
            New Project
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {statusOptions.map((status) => {
            const Icon = status.icon
            const count = projects.filter(p => p.status === status.value).length
            return (
              <div key={status.value} className="glass rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{status.label}</p>
                    <p className="text-3xl font-bold text-white mt-1">{count}</p>
                  </div>
                  <Icon className={`w-10 h-10 ${getProjectStatusColor(status.value)}`} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {groupedProjects.map((column) => {
            const Icon = column.icon
            return (
              <div key={column.value} className="glass rounded-xl p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Icon className={`w-5 h-5 ${getProjectStatusColor(column.value)}`} />
                  <h3 className="text-lg font-semibold text-white">{column.label}</h3>
                  <span className="ml-auto text-sm text-gray-400">{column.projects.length}</span>
                </div>

                <div className="space-y-3">
                  {column.projects.map((project) => (
                    <div key={project.id} className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-white/20 transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-white font-semibold">{project.title}</h4>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEdit(project)}
                            className="p-1 hover:bg-white/10 rounded transition-colors"
                          >
                            <Edit className="w-3 h-3 text-gray-400 hover:text-white" />
                          </button>
                          <button
                            onClick={() => handleDelete(project.id)}
                            className="p-1 hover:bg-white/10 rounded transition-colors"
                          >
                            <Trash2 className="w-3 h-3 text-gray-400 hover:text-red-500" />
                          </button>
                        </div>
                      </div>

                      {project.description && (
                        <p className="text-gray-400 text-sm mb-3">{project.description}</p>
                      )}

                      {(project.start_date || project.end_date) && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {project.start_date && <span>{formatDate(project.start_date)}</span>}
                          {project.start_date && project.end_date && <span>-</span>}
                          {project.end_date && <span>{formatDate(project.end_date)}</span>}
                        </div>
                      )}
                    </div>
                  ))}

                  {column.projects.length === 0 && (
                    <div className="text-center py-8 text-gray-500 text-sm">
                      No projects
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-16">
            <FolderKanban className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No projects yet. Create your first project!</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass rounded-2xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingProject ? 'Edit Project' : 'New Project'}
              </h2>
              <button onClick={handleCloseModal} className="p-2 hover:bg-white/10 rounded-lg">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Build Portfolio Website"
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
                  placeholder="What is this project about?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-gray-900">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
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
                  {editingProject ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
