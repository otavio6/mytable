"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"

export type Theme = 'slate' | 'teal' | 'emerald' | 'amber' | 'stone' | 'violet'

interface ThemeContextType {
    theme: Theme
    setTheme: (theme: Theme) => void
    themes: { id: Theme, name: string, color: string }[]
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export const THEMES = [
    { id: 'slate', name: 'Slate (Padrão Antigo)', color: 'bg-slate-900' },
    { id: 'teal', name: 'Turquesa (Novo Padrão)', color: 'bg-teal-900' },
    { id: 'emerald', name: 'Jade / Esmeralda', color: 'bg-emerald-900' },
    { id: 'amber', name: 'Terra / Âmbar', color: 'bg-amber-700' },
    { id: 'stone', name: 'Cinza Quente', color: 'bg-stone-800' },
    { id: 'violet', name: 'Violeta', color: 'bg-violet-900' },
] as const

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('teal')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        // Load saved theme
        const saved = localStorage.getItem("tt_v2_theme") as Theme
        if (saved && THEMES.some(t => t.id === saved)) {
            setThemeState(saved)
            applyTheme(saved)
        } else {
            // Default to teal if no saved theme
            applyTheme('teal')
        }
        setMounted(true)
    }, [])

    const applyTheme = (newTheme: Theme) => {
        const root = document.documentElement
        // Remove old theme classes
        THEMES.forEach(t => root.classList.remove(`theme-${t.id}`))
        // Add new theme class
        root.classList.add(`theme-${newTheme}`)
    }

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme)
        localStorage.setItem("tt_v2_theme", newTheme)
        applyTheme(newTheme)
    }

    if (!mounted) {
        return <>{children}</>
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme, themes: [...THEMES] }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const ctx = useContext(ThemeContext)
    if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
    return ctx
}
