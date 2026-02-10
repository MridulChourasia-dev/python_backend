import axios from 'axios'

let API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Ensure URL starts with protocol for Render/Production
if (API_URL && !API_URL.startsWith('http')) {
    API_URL = `https://${API_URL}`
}

// Fix Render's internal host mapping if it's missing the domain
if (API_URL && !API_URL.includes('.') && !API_URL.includes('localhost')) {
    API_URL = `${API_URL}.onrender.com`
}

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Token expired, redirect to login
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            window.location.href = '/auth/login'
        }
        return Promise.reject(error)
    }
)

// Auth API
export const authAPI = {
    register: (data: { email: string; username: string; password: string; full_name?: string }) =>
        api.post('/api/auth/register', data),

    login: (data: { email: string; password: string }) =>
        api.post('/api/auth/login', data),

    getCurrentUser: () =>
        api.get('/api/auth/me'),
}

// Users API
export const usersAPI = {
    getUsers: () => api.get('/api/users/'),
    getUser: (id: number) => api.get(`/api/users/${id}`),
    updateCurrentUser: (data: any) => api.put('/api/users/me', data),
    deleteCurrentUser: () => api.delete('/api/users/me'),
}

// Skills API
export const skillsAPI = {
    getSkills: () => api.get('/api/skills/'),
    createSkill: (data: any) => api.post('/api/skills/', data),
    getSkill: (id: number) => api.get(`/api/skills/${id}`),
    updateSkill: (id: number, data: any) => api.put(`/api/skills/${id}`, data),
    deleteSkill: (id: number) => api.delete(`/api/skills/${id}`),
}

// Projects API
export const projectsAPI = {
    getProjects: () => api.get('/api/projects/'),
    createProject: (data: any) => api.post('/api/projects/', data),
    getProject: (id: number) => api.get(`/api/projects/${id}`),
    updateProject: (id: number, data: any) => api.put(`/api/projects/${id}`, data),
    deleteProject: (id: number) => api.delete(`/api/projects/${id}`),
}

// Milestones API
export const milestonesAPI = {
    createMilestone: (data: any) => api.post('/api/milestones/', data),
    getMilestone: (id: number) => api.get(`/api/milestones/${id}`),
    updateMilestone: (id: number, data: any) => api.put(`/api/milestones/${id}`, data),
    deleteMilestone: (id: number) => api.delete(`/api/milestones/${id}`),
}

// Progress Logs API
export const progressAPI = {
    getProgressLogs: () => api.get('/api/progress/'),
    getRecentLogs: (days: number = 7) => api.get(`/api/progress/recent?days=${days}`),
    createProgressLog: (data: any) => api.post('/api/progress/', data),
    getProgressLog: (id: number) => api.get(`/api/progress/${id}`),
    updateProgressLog: (id: number, data: any) => api.put(`/api/progress/${id}`, data),
    deleteProgressLog: (id: number) => api.delete(`/api/progress/${id}`),
}

// AI Feedback API
export const aiFeedbackAPI = {
    getFeedbacks: (type?: string) => api.get(`/api/ai-feedback/${type ? `?feedback_type=${type}` : ''}`),
    createFeedback: (data: any) => api.post('/api/ai-feedback/', data),
    getFeedback: (id: number) => api.get(`/api/ai-feedback/${id}`),
    deleteFeedback: (id: number) => api.delete(`/api/ai-feedback/${id}`),
}

export default api
