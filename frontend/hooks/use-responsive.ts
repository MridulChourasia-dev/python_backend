'use client'

import { useEffect } from 'react'
import { useUIStore } from '@/lib/store/ui-store'

export const useResponsive = () => {
    const setDeviceType = useUIStore((state) => state.setDeviceType)

    useEffect(() => {
        const handleResize = () => {
            setDeviceType(window.innerWidth)
        }

        // Initialize
        handleResize()

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [setDeviceType])
}
