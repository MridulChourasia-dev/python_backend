import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
    const d = new Date(date)
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

export function calculateStreak(logs: any[]): number {
    if (!logs || logs.length === 0) return 0

    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const sortedLogs = logs.sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    for (let i = 0; i < sortedLogs.length; i++) {
        const logDate = new Date(sortedLogs[i].date)
        logDate.setHours(0, 0, 0, 0)

        const expectedDate = new Date(today)
        expectedDate.setDate(expectedDate.getDate() - i)

        if (logDate.getTime() === expectedDate.getTime()) {
            streak++
        } else {
            break
        }
    }

    return streak
}

export function calculateProgress(currentLevel: number, targetLevel: number): number {
    if (targetLevel === 0) return 0
    return Math.min(Math.round((currentLevel / targetLevel) * 100), 100)
}

export function getSkillLevelLabel(level: number): string {
    if (level === 0) return 'Not Started'
    if (level < 25) return 'Beginner'
    if (level < 50) return 'Intermediate'
    if (level < 75) return 'Advanced'
    if (level < 100) return 'Expert'
    return 'Master'
}

export function getSkillLevelColor(level: number): string {
    if (level === 0) return 'text-gray-500'
    if (level < 25) return 'text-red-500'
    if (level < 50) return 'text-yellow-500'
    if (level < 75) return 'text-blue-500'
    if (level < 100) return 'text-green-500'
    return 'text-purple-500'
}

export function groupByDate<T extends { date: string }>(items: T[]): Record<string, T[]> {
    const grouped: Record<string, T[]> = {}

    items.forEach((item) => {
        const formattedDate = formatDate(item.date)

        if (!grouped[formattedDate]) {
            grouped[formattedDate] = []
        }

        grouped[formattedDate].push(item)
    })

    return grouped
}
