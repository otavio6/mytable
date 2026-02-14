"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LayoutGrid, UtensilsCrossed, Clock, CheckCircle2, Plus, Users, DollarSign, X } from "lucide-react"

export function AppPreview() {
    // Phases: 
    // 0-3s: Show Kanban, Mouse moves to Add
    // 3-6s: Modal Open, Typing/Selecting
    // 6-7s: Add clicked, Card appears
    // 7-9s: Mouse moves to Dashboard nav
    // 9-12s: Dashboard View
    // Loop

    const [uiState, setUiState] = useState<"kanban" | "modal" | "dashboard">("kanban")
    const [ordersCount, setOrdersCount] = useState(2)

    useEffect(() => {
        const sequence = async () => {
            while (true) {
                // Assert Initial State
                setUiState("kanban")
                setOrdersCount(2)

                // Wait for initial view (3s)
                await new Promise(r => setTimeout(r, 2500))

                // Open Modal
                setUiState("modal")
                await new Promise(r => setTimeout(r, 3000)) // Filling form

                // Close Modal & Add Order
                setUiState("kanban")
                setOrdersCount(3)
                await new Promise(r => setTimeout(r, 1500)) // Admire new card

                // Switch to Dashboard
                setUiState("dashboard")
                await new Promise(r => setTimeout(r, 4000)) // View stats
            }
        }
        sequence()
    }, [])

    return (
        <div className="w-full h-full bg-zinc-50 rounded-3xl overflow-hidden border border-zinc-200/50 shadow-2xl flex flex-col relative select-none font-sans">
            {/* Topbar */}
            <div className="h-10 border-b border-zinc-100 bg-white flex items-center px-4 justify-between shrink-0 z-20">
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="h-6 w-32 bg-zinc-50 rounded-lg border border-zinc-100" />
                <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">G</div>
            </div>

            <div className="flex-1 flex overflow-hidden relative">
                {/* Sidebar */}
                <div className="w-14 border-r border-zinc-100 bg-white flex flex-col items-center py-4 gap-4 shrink-0 z-20">
                    <div className={`p-2.5 rounded-xl transition-all duration-500 ${uiState !== "dashboard" ? 'bg-zinc-900 text-white shadow-lg shadow-zinc-900/20' : 'text-zinc-300 hover:bg-zinc-50'}`}>
                        <UtensilsCrossed size={16} />
                    </div>
                    <div className={`p-2.5 rounded-xl transition-all duration-500 ${uiState === "dashboard" ? 'bg-zinc-900 text-white shadow-lg shadow-zinc-900/20' : 'text-zinc-300 hover:bg-zinc-50'}`}>
                        <LayoutGrid size={16} />
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 bg-zinc-50/50 p-4 relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {uiState !== "dashboard" ? (
                            <motion.div
                                key="kanban-view"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full flex gap-3"
                            >
                                {/* Kanban Columns */}
                                <div className="flex-1 flex flex-col gap-3">
                                    <div className="h-3 w-16 bg-zinc-200 rounded-full mb-1" />
                                    {/* Existing Cards */}
                                    <motion.div layoutId="card-1" className="p-3 bg-white rounded-2xl border border-zinc-100 shadow-sm">
                                        <div className="w-16 h-2 bg-zinc-100 rounded-full mb-2" />
                                        <div className="w-full h-8 bg-zinc-50 rounded-lg" />
                                    </motion.div>

                                    {/* New Card Animation */}
                                    <AnimatePresence>
                                        {ordersCount === 3 && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                className="p-3 bg-white rounded-xl border border-zinc-100 shadow-sm ring-1 ring-emerald-500/20"
                                            >
                                                <div className="flex justify-between mb-2">
                                                    <div className="w-12 h-2 bg-zinc-100 rounded-full" />
                                                    <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                                        <Clock size={8} />
                                                    </div>
                                                </div>
                                                <div className="w-20 h-2 bg-zinc-100 rounded-full" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <div className="flex-1 flex flex-col gap-3 opacity-50">
                                    <div className="h-3 w-16 bg-zinc-200 rounded-full mb-1" />
                                    <div className="p-3 bg-white rounded-2xl border border-zinc-100 shadow-sm" />
                                </div>
                                <div className="flex-1 flex flex-col gap-3 opacity-50">
                                    <div className="h-3 w-16 bg-zinc-200 rounded-full mb-1" />
                                </div>

                                {/* Floating Action Button */}
                                <motion.div
                                    className="absolute bottom-6 right-6 w-10 h-10 bg-zinc-900 rounded-full shadow-xl shadow-zinc-900/20 text-white flex items-center justify-center z-10"
                                    whileHover={{ scale: 1.1 }}
                                >
                                    <Plus size={18} />
                                </motion.div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="dashboard-view"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="h-full flex flex-col gap-4"
                            >
                                <div className="flex gap-4">
                                    <div className="flex-1 p-4 bg-white rounded-2xl border border-zinc-100 shadow-sm">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                                            <DollarSign size={16} />
                                        </div>
                                        <div className="w-16 h-3 bg-zinc-100 rounded-full" />
                                    </div>
                                    <div className="flex-1 p-4 bg-white rounded-2xl border border-zinc-100 shadow-sm">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                                            <Users size={16} />
                                        </div>
                                        <div className="w-16 h-3 bg-zinc-100 rounded-full" />
                                    </div>
                                </div>
                                <div className="flex-1 bg-white rounded-2xl border border-zinc-100 shadow-sm p-4 flex items-end gap-2 px-6 pb-2">
                                    {[40, 70, 50, 85, 60, 90, 45].map((h, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ height: 0 }}
                                            animate={{ height: `${h}%` }}
                                            transition={{ delay: i * 0.1 }}
                                            className="flex-1 bg-zinc-900 rounded-t-md opacity-80 hover:opacity-100"
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* MODAL OVERLAY */}
                    <AnimatePresence>
                        {uiState === "modal" && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/5 backdrop-blur-[1px] z-30 flex items-center justify-center p-6"
                            >
                                <motion.div
                                    initial={{ scale: 0.9, y: 20 }}
                                    animate={{ scale: 1, y: 0 }}
                                    exit={{ scale: 0.9, y: 20 }}
                                    className="bg-white w-full max-w-[200px] rounded-2xl shadow-2xl p-4 border border-zinc-100"
                                >
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="w-20 h-3 bg-zinc-100 rounded-full" />
                                        <div className="w-4 h-4 bg-zinc-50 rounded-full" />
                                    </div>
                                    <div className="space-y-2 mb-4">
                                        <div className="h-8 w-full bg-zinc-50 rounded-lg border border-zinc-100" />
                                        <div className="h-8 w-full bg-zinc-50 rounded-lg border border-zinc-100" />
                                    </div>
                                    <div className="h-8 w-full bg-zinc-900 rounded-lg shadow-lg shadow-zinc-900/10" />
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* CURSOR ANIMATION */}
                    <motion.div
                        className="absolute w-4 h-4 z-50 pointer-events-none drop-shadow-xl"
                        animate={{
                            x: [20, 260, 260, 260, 150, 150, 150, 20, 20], // X coordinates
                            y: [50, 250, 250, 250, 150, 220, 220, 80, 80], // Y coordinates (approx)
                            scale: [1, 1, 0.9, 1, 1, 0.9, 1, 1, 1] // Click effect
                        }}
                        transition={{
                            duration: 11, // Total loop time match
                            times: [0, 0.2, 0.22, 0.25, 0.5, 0.55, 0.58, 0.7, 1], // Keyframe timing
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z" fill="black" stroke="white" strokeWidth="2" />
                        </svg>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
