"use client"
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextType {
    theme: Theme
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>('dark')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const savedTheme = localStorage.getItem('nexusplay-theme') as Theme
        if (savedTheme) {
            setTheme(savedTheme)
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setTheme('dark')
        } else {
            setTheme('light')
        }
    }, [])

    useEffect(() => {
        if (!mounted) return
        const root = document.documentElement
        root.classList.remove('light', 'dark')
        root.classList.add(theme)
        root.setAttribute('data-theme', theme)
        localStorage.setItem('nexusplay-theme', theme)
    }, [theme, mounted])

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark')
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <div style={{ visibility: mounted ? 'visible' : 'hidden' }}>
                {children}
            </div>
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}
