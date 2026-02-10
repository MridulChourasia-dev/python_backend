'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { skillsAPI } from '@/lib/api'
import { getSkillLevelLabel, getSkillLevelColor, calculateProgress } from '@/lib/utils'
import SmoothLayout from '@/components/SmoothLayout'
import LoadingSpinner from '@/components/LoadingSpinner'
import EmptyState from '@/components/EmptyState'
import Modal from '@/components/Modal'
import { 
  Target, 
  Plus, 
  Edit, 
  Trash2,
  Save,
  TrendingUp,
  BookOpen,
  Code,
  Database,
  Cpu,
  Globe,
  Palette
} from 'lucide-react'

interface Skill {
  id: number
  name: string
  category: string
  current_level: number
  target_level: number
  description?: string
  created_at: string
  updated_at: string
}

const categoryIcons: Record<string, any> = {
  'Programming': Code,
  'Frontend': Globe,
  'Backend': Database,
  'DevOps': Cpu,
  'Design': Palette,
  'Other': BookOpen
}

export default function SkillsPage() {
  const router = useRouter()
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    category: 'Programming',
    current_level: 0,
    target_level: 100,
    description: ''
  })

  useEffect(() => {
    loadSkills()
  }, [])

  const loadSkills = async () => {
    try {
      const response = await skillsAPI.getSkills()
      setSkills(response.data)
    } catch (error) {
      console.error('Failed to load skills:', error)
      router.push('/auth/login')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingSkill) {
        await skillsAPI.updateSkill(editingSkill.id, formData)
      } else {
        await skillsAPI.createSkill(formData)
      }
      await loadSkills()
      handleCloseModal()
    } catch (error) {
      console.error('Failed to save skill:', error)
    }
  }

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill)
    setFormData({
      name: skill.name,
      category: skill.category,
      current_level: skill.current_level,
      target_level: skill.target_level,
      description: skill.description || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this skill?')) {
      try {
        await skillsAPI.deleteSkill(id)
        await loadSkills()
      } catch (error) {
        console.error('Failed to delete skill:', error)
      }
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingSkill(null)
    setFormData({
      name: '',
      category: 'Programming',
      current_level: 0,
      target_level: 100,
      description: ''
    })
  }

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading your skills..." />
  }

  const categories = ['Programming', 'Frontend', 'Backend', 'DevOps', 'Design', 'Other']

  return (
    <SmoothLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Skills</h1>
            <p className="text-gray-400">Track and improve your skills</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all shadow-lg shadow-primary-500/30 w-full sm:w-auto justify-center"
          >
            <Plus className="w-5 h-5" />
            Add Skill
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="glass rounded-xl p-6 hover:translate-y-[-4px] transition-transform shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Skills</p>
                <p className="text-3xl font-bold text-white mt-1">{skills.length}</p>
              </div>
              <Target className="w-10 h-10 text-primary-500" />
            </div>
          </div>
          
          <div className="glass rounded-xl p-6 hover:translate-y-[-4px] transition-transform shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Average Progress</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {skills.length > 0 
                    ? Math.round(skills.reduce((acc, s) => acc + calculateProgress(s.current_level, s.target_level), 0) / skills.length)
                    : 0}%
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-green-500" />
            </div>
          </div>
          
          <div className="glass rounded-xl p-6 hover:translate-y-[-4px] transition-transform shadow-xl sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Categories</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {new Set(skills.map(s => s.category)).size}
                </p>
              </div>
              <BookOpen className="w-10 h-10 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill) => {
            const progress = calculateProgress(skill.current_level, skill.target_level)
            const Icon = categoryIcons[skill.category] || BookOpen
            
            return (
              <div key={skill.id} className="glass rounded-xl p-6 hover:border-primary-500/50 transition-all group shadow-lg">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-500/10 rounded-lg group-hover:bg-primary-500/20 transition-colors">
                      <Icon className="w-6 h-6 text-primary-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{skill.name}</h3>
                      <p className="text-sm text-gray-400">{skill.category}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(skill)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4 text-gray-400 hover:text-white" />
                    </button>
                    <button
                      onClick={() => handleDelete(skill.id)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                </div>

                {skill.description && (
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{skill.description}</p>
                )}

                <div className="mt-auto">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Progress</span>
                    <span className={`font-semibold ${getSkillLevelColor(skill.current_level)}`}>
                      {getSkillLevelLabel(skill.current_level)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-700 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-500 mt-2 uppercase tracking-wider">
                    <span>Lvl {skill.current_level}</span>
                    <span className="text-primary-400 font-bold">{progress}%</span>
                    <span>Goal {skill.target_level}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {skills.length === 0 && (
          <EmptyState
            icon={Target}
            title="No Skills Yet"
            description="Start your learning journey by adding your first skill"
            actionLabel="Add Skill"
            onAction={() => setShowModal(true)}
          />
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingSkill ? 'Edit Skill' : 'Add New Skill'}
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Skill Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              placeholder="e.g., Python, React, Docker"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 bg-[#111827] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Current Level
              </label>
              <input
                type="number"
                required
                min="0"
                max="100"
                value={formData.current_level}
                onChange={(e) => setFormData({ ...formData, current_level: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Target Level
              </label>
              <input
                type="number"
                required
                min="0"
                max="100"
                value={formData.target_level}
                onChange={(e) => setFormData({ ...formData, target_level: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none h-24 transition-all"
              placeholder="What do you want to learn?"
            />
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
              {editingSkill ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </SmoothLayout>
  )
}
