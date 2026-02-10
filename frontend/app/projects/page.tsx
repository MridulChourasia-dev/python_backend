'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { projectsAPI } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import SmoothLayout from '@/components/SmoothLayout'
import LoadingSpinner from '@/components/LoadingSpinner'
import Modal from '@/components/Modal'
import { 
  FolderKanban, 
  Plus, 
  Edit, 
  Trash2, 
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

const getProjectStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    planning: 'text-blue-400',
    active: 'text-green-400',
    completed: 'text-emerald-400',
    on_hold: 'text-yellow-400'
  }
  return colorMap[status] || 'text-gray-400'
}

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
    return <LoadingSpinner fullScreen message="Loading your projects..." />
  }

  const groupedProjects = statusOptions.map(status => ({
    ...status,
    projects: projects.filter(p => p.status === status.value)
  }))

  return (
    <SmoothLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Projects</h1>
            <p className="text-gray-400">Manage your learning projects</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all shadow-lg shadow-primary-500/30 w-full sm:w-auto justify-center"
          >
            <Plus className="w-5 h-5" />
            New Project
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statusOptions.map((status) => {
            const Icon = status.icon
            const count = projects.filter(p => p.status === status.value).length
            return (
              <div key={status.value} className="glass rounded-xl p-6 hover:translate-y-[-4px] transition-transform shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{status.label}</p>
                    <p className="text-3xl font-bold text-white mt-1">{count}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-white/5`}>
                    <Icon className={`w-8 h-8 ${getProjectStatusColor(status.value)}`} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {groupedProjects.map((column) => {
            const Icon = column.icon
            return (
              <div key={column.value} className="bg-white/5 rounded-2xl p-4 border border-white/5 h-full min-h-[500px] flex flex-col">
                <div className="flex items-center gap-2 mb-6 px-2">
                  <div className={`p-1.5 rounded-md bg-white/5`}>
                    <Icon className={`w-4 h-4 ${getProjectStatusColor(column.value)}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{column.label}</h3>
                  <span className="ml-auto px-2 py-0.5 rounded text-xs font-bold bg-white/10 text-gray-400">{column.projects.length}</span>
                </div>

                <div className="space-y-4 flex-1">
                  {column.projects.map((project) => (
                    <div key={project.id} className="bg-secondary-800/50 backdrop-blur-md rounded-xl p-5 border border-white/10 hover:border-primary-500/30 transition-all hover:shadow-lg group">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="text-white font-bold group-hover:text-primary-400 transition-colors uppercase tracking-tight">{project.title}</h4>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(project)}
                            className="p-1.5 hover:bg-white/10 rounded transition-colors"
                          >
                            <Edit className="w-4 h-4 text-gray-400 hover:text-white" />
                          </button>
                          <button
                            onClick={() => handleDelete(project.id)}
                            className="p-1.5 hover:bg-white/10 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                          </button>
                        </div>
                      </div>

                      {project.description && (
                        <p className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">{project.description}</p>
                      )}

                      {(project.start_date || project.end_date) && (
                        <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-gray-500 pt-3 border-t border-white/5 mt-auto">
                          <Calendar className="w-3 h-3" />
                          {project.start_date && <span>{formatDate(project.start_date)}</span>}
                          {project.start_date && project.end_date && <span className="mx-1">→</span>}
                          {project.end_date && <span>{formatDate(project.end_date)}</span>}
                        </div>
                      )}
                    </div>
                  ))}

                  {column.projects.length === 0 && (
                    <div className="flex-1 flex flex-col items-center justify-center py-12 border-2 border-dashed border-white/5 rounded-xl">
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                        <Icon className="w-6 h-6 text-gray-600" />
                      </div>
                      <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">No projects</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10 mt-8">
            <div className="p-6 bg-primary-500/10 rounded-full w-fit mx-auto mb-6">
              <FolderKanban className="w-16 h-16 text-primary-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight">Your project board is empty</h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-8">Break down your big goals into manageable projects and track your progress here.</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-bold transition-all shadow-xl shadow-primary-500/20"
            >
              Get Started Now
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingProject ? 'Edit Project' : 'New Project'}
        maxWidth="md"
      >
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
              className="w-full px-4 py-3 bg-[#111827] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-semibold"
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
              className="w-full px-4 py-3 bg-[#111827] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none h-28 transition-all"
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
              className="w-full px-4 py-3 bg-[#111827] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
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
                className="w-full px-4 py-3 bg-[#111827] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                className="w-full px-4 py-3 bg-[#111827] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
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
              <Save className="w-4 h-4" />
              {editingProject ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </Modal>
    </SmoothLayout>
  )
}
