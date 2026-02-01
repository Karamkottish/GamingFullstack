"use client"
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme()

    return (
        <motion.button
            onClick={toggleTheme}
            className="relative h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-white/10 flex items-center justify-center group overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-20 blur transition duration-300" />

            {/* Icon Container */}
            <div className="relative z-10">
                <AnimatePresence mode="wait">
                    {theme === 'dark' ? (
                        <motion.div
                            key="moon"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Moon className="h-5 w-5 text-purple-400" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="sun"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Sun className="h-5 w-5 text-amber-400" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Tooltip */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/90 backdrop-blur-sm rounded-lg text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </div>
        </motion.button>
    )
}
