'use client'

import { useRouter } from 'next/navigation'
import { Rocket, Target, TrendingUp, Zap } from 'lucide-react'

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow animation-delay-2000"></div>
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            {/* Logo/Icon */}
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl shadow-2xl">
                <Rocket className="w-16 h-16 text-white" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-6xl md:text-7xl font-bold mb-6 animate-fade-in">
              <span className="gradient-text">SkillSphere</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto animate-slide-up">
              AI-Powered Learning & Project Tracker for Developers
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up">
              <button
                onClick={() => router.push('/auth/register')}
                className="px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Get Started Free
              </button>
              <button
                onClick={() => router.push('/auth/login')}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                Sign In
              </button>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 mt-20">
              <FeatureCard
                icon={<Target className="w-8 h-8" />}
                title="Track Skills"
                description="Monitor your learning progress across multiple technologies and domains"
              />
              <FeatureCard
                icon={<TrendingUp className="w-8 h-8" />}
                title="Manage Projects"
                description="Organize projects with milestones and track completion status"
              />
              <FeatureCard
                icon={<Zap className="w-8 h-8" />}
                title="AI Insights"
                description="Get personalized feedback and recommendations powered by AI"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="glass rounded-2xl p-8 card-hover">
      <div className="flex justify-center mb-4 text-primary-400">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}
