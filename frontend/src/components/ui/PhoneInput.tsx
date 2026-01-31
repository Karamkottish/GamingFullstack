"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search, Phone } from 'lucide-react'
import { countryCodes } from '@/lib/country-codes'

interface PhoneInputProps {
    value: string
    onChange: (value: string) => void
    className?: string
}

export default function PhoneInput({ value, onChange, className = '' }: PhoneInputProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [selectedCountry, setSelectedCountry] = useState(countryCodes[0])
    const [phoneNumber, setPhoneNumber] = useState('')
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
                setSearch('')
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Parse initial value
    useEffect(() => {
        if (value && value.startsWith('+')) {
            // Find matching country code
            const country = countryCodes.find(c => value.startsWith(c.dial))
            if (country) {
                setSelectedCountry(country)
                setPhoneNumber(value.slice(country.dial.length))
            }
        }
    }, [])

    // Update parent value when country or number changes
    useEffect(() => {
        const fullNumber = phoneNumber ? `${selectedCountry.dial}${phoneNumber}` : ''
        onChange(fullNumber)
    }, [selectedCountry, phoneNumber])

    const filteredCountries = countryCodes.filter(country =>
        country.name.toLowerCase().includes(search.toLowerCase()) ||
        country.code.toLowerCase().includes(search.toLowerCase()) ||
        country.dial.includes(search)
    )

    return (
        <div className={`relative ${className}`}>
            <div className="flex gap-2">
                {/* Country Code Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-2 px-4 py-3 bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl hover:border-primary/50 transition-all focus:outline-none focus:border-primary group"
                    >
                        <span className="text-xl">{selectedCountry.flag}</span>
                        <span className="text-sm font-semibold text-foreground">{selectedCountry.dial}</span>
                        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-full left-0 mt-2 w-80 bg-card/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                            >
                                {/* Search */}
                                <div className="p-3 border-b border-white/10">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Search countries..."
                                            className="w-full pl-10 pr-4 py-2 bg-background/50 border border-white/5 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                {/* Country List */}
                                <div className="max-h-64 overflow-y-auto custom-scrollbar">
                                    {filteredCountries.length > 0 ? (
                                        filteredCountries.map((country) => (
                                            <button
                                                key={country.code}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedCountry(country)
                                                    setIsOpen(false)
                                                    setSearch('')
                                                }}
                                                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-primary/10 transition-colors ${selectedCountry.code === country.code ? 'bg-primary/20' : ''
                                                    }`}
                                            >
                                                <span className="text-2xl">{country.flag}</span>
                                                <div className="flex-1 text-left">
                                                    <p className="text-sm font-semibold text-foreground">{country.name}</p>
                                                    <p className="text-xs text-muted-foreground">{country.code}</p>
                                                </div>
                                                <span className="text-sm font-mono text-primary">{country.dial}</span>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                                            No countries found
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Phone Number Input */}
                <div className="flex-1 relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                    <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => {
                            // Only allow numbers
                            const cleaned = e.target.value.replace(/\D/g, '')
                            setPhoneNumber(cleaned)
                        }}
                        placeholder="Phone number"
                        className="w-full pl-12 pr-4 py-3 bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all"
                    />
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: hsl(var(--primary) / 0.3);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: hsl(var(--primary) / 0.5);
                }
            `}</style>
        </div>
    )
}
