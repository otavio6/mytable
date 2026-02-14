"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface NewCategoryModalProps {
    isOpen: boolean
    onClose: () => void
    onAdd?: (category: { id: string; name: string; order: number }) => void
}

export function NewCategoryModal({ isOpen, onClose, onAdd }: NewCategoryModalProps) {
    const [name, setName] = useState("")
    const [order, setOrder] = useState("")
    const [isSaving, setIsSaving] = useState(false)

    const handleSubmit = () => {
        if (!name.trim()) return

        setIsSaving(true)
        setTimeout(() => {
            if (onAdd) {
                onAdd({
                    id: name.trim().toLowerCase().replace(/\s+/g, '-'),
                    name: name.trim(),
                    order: parseInt(order) || 0,
                })
            }
            setName("")
            setOrder("")
            setIsSaving(false)
            onClose()
        }, 400)
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-zinc-200"
                    >
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-bold text-zinc-900">Nova Categoria</h3>
                                    <p className="text-zinc-500 text-sm font-medium">Organize seu cardápio em grupos.</p>
                                </div>
                                <Button variant="outline" size="icon" onClick={onClose} className="rounded-xl">
                                    <X size={18} />
                                </Button>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Nome da Categoria</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Entradas Gourmet"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full h-14 bg-zinc-50 border border-zinc-100 rounded-2xl px-6 text-sm font-medium focus:outline-none focus:border-zinc-300 transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Ordem de Exibição</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={order}
                                        onChange={(e) => setOrder(e.target.value)}
                                        className="w-full h-14 bg-zinc-50 border border-zinc-100 rounded-2xl px-6 text-sm font-medium focus:outline-none focus:border-zinc-300 transition-all"
                                    />
                                </div>

                                <Button
                                    onClick={handleSubmit}
                                    disabled={isSaving || !name.trim()}
                                    className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-bold gap-3 mt-4 hover:opacity-90 transition-all"
                                >
                                    {isSaving ? (
                                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <Save size={18} />
                                    )}
                                    {isSaving ? "Salvando..." : "Salvar Categoria"}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
