"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { X, Hammer, AlertCircle } from "lucide-react"

export function Navbar() {
    const [isConstructionOpen, setIsConstructionOpen] = useState(false)

    return (
        <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-6">
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="h-16 px-4 bg-white/80 backdrop-blur-md rounded-full flex items-center gap-4 border border-zinc-200 shadow-sm"
            >
                {/* Logo Section */}
                <Link href="/" className="px-6 flex items-center group">
                    <span className="font-bold text-lg tracking-tight text-zinc-900">
                        My<span className="text-zinc-400">Table</span>
                    </span>
                </Link>

                {/* Navigation Links */}
                <div className="hidden lg:flex items-center gap-1">
                    <Link href="#features" className="px-4 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors">
                        Funcionalidades
                    </Link>
                    <button
                        onClick={() => setIsConstructionOpen(true)}
                        className="px-4 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
                    >
                        Preços
                    </button>
                    <button
                        onClick={() => setIsConstructionOpen(true)}
                        className="px-4 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
                    >
                        Contato
                    </button>
                </div>

                {/* Auth Buttons */}
                <div className="flex items-center gap-2 pl-4 border-l border-zinc-100">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full px-6"
                        asChild
                    >
                        <Link href="/login">Entrar</Link>
                    </Button>
                    <Button
                        size="sm"
                        className="rounded-full px-6"
                        asChild
                    >
                        <Link href="/login">Começar</Link>
                    </Button>
                </div>
            </motion.nav>

            <AnimatePresence>
                {isConstructionOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsConstructionOpen(false)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[400px] bg-white rounded-[2.5rem] p-10 shadow-2xl z-[70] text-center border border-zinc-100"
                        >
                            <button
                                onClick={() => setIsConstructionOpen(false)}
                                className="absolute top-6 right-6 text-zinc-300 hover:text-zinc-900 transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="w-20 h-20 bg-amber-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                                <Hammer className="text-amber-500 w-10 h-10" />
                            </div>

                            <h3 className="text-2xl font-bold text-zinc-900 mb-3 italic">Em Construção</h3>
                            <p className="text-sm text-zinc-500 font-medium leading-relaxed mb-8">
                                Estamos preparando algo incrível para você. <br />
                                Esta página ainda não está disponível, mas em breve teremos novidades!
                            </p>

                            <Button
                                onClick={() => setIsConstructionOpen(false)}
                                className="w-full h-14 rounded-2xl bg-zinc-900 text-white font-bold uppercase tracking-widest text-[11px]"
                            >
                                Entendi, obrigado!
                            </Button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
