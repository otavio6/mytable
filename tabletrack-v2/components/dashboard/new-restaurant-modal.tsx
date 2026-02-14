"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Save, Upload, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useRef } from "react"

interface NewRestaurantModalProps {
    isOpen: boolean
    onClose: () => void
    onAdd?: (restaurant: any) => void
}

export function NewRestaurantModal({ isOpen, onClose, onAdd }: NewRestaurantModalProps) {
    const [name, setName] = useState("")
    const [cuisine, setCuisine] = useState("")
    const [tables, setTables] = useState("")
    const [location, setLocation] = useState("")
    const [isSaving, setIsSaving] = useState(false)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => setImagePreview(reader.result as string)
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return

        setIsSaving(true)
        setTimeout(() => {
            if (onAdd) {
                onAdd({
                    name: name.trim(),
                    cuisine: cuisine.trim() || "Geral",
                    tables: parseInt(tables) || 10,
                    location: location.trim() || "Não informado",
                    image: imagePreview || null,
                })
            }
            setName("")
            setCuisine("")
            setTables("")
            setLocation("")
            setImagePreview(null)
            setIsSaving(false)
            onClose()
        }, 400)
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
                        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-zinc-100"
                    >
                        <div className="p-8 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                            <div>
                                <h3 className="text-xl font-bold text-zinc-900">Novo Restaurante</h3>
                                <p className="text-sm text-zinc-500 mt-1">Registre uma nova unidade no sistema.</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                                <X size={20} className="text-zinc-400" />
                            </button>
                        </div>

                        <form className="p-8 space-y-6" onSubmit={handleSubmit}>
                            {/* Image Upload */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Foto do Restaurante</label>
                                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="relative w-full h-40 rounded-2xl border-2 border-dashed border-zinc-200 hover:border-zinc-400 transition-all cursor-pointer overflow-hidden group/img flex items-center justify-center bg-zinc-50"
                                >
                                    {imagePreview ? (
                                        <>
                                            <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/40 transition-colors flex items-center justify-center">
                                                <span className="text-white text-[10px] font-black uppercase tracking-widest opacity-0 group-hover/img:opacity-100 transition-opacity">Trocar Foto</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center gap-3 text-zinc-300 group-hover/img:text-zinc-500 transition-colors">
                                            <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center">
                                                <Upload size={20} />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest">Clique para enviar</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Nome da Unidade</label>
                                <input
                                    type="text"
                                    placeholder="Ex: La Brasserie Gourmet"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full h-12 px-4 rounded-xl border border-zinc-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900 focus:ring-offset-1 outline-none transition-all placeholder:text-zinc-300"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Tipo de Cozinha</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Francesa"
                                        value={cuisine}
                                        onChange={(e) => setCuisine(e.target.value)}
                                        className="w-full h-12 px-4 rounded-xl border border-zinc-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900 focus:ring-offset-1 outline-none transition-all placeholder:text-zinc-300"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Capacidade</label>
                                    <input
                                        type="number"
                                        placeholder="Ex: 50"
                                        value={tables}
                                        onChange={(e) => setTables(e.target.value)}
                                        className="w-full h-12 px-4 rounded-xl border border-zinc-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900 focus:ring-offset-1 outline-none transition-all placeholder:text-zinc-300"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Endereço Completo</label>
                                <input
                                    type="text"
                                    placeholder="Rua, Número, Bairro, Cidade"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full h-12 px-4 rounded-xl border border-zinc-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900 focus:ring-offset-1 outline-none transition-all placeholder:text-zinc-300"
                                />
                            </div>

                            <div className="pt-4 flex items-center justify-end gap-3">
                                <Button type="button" variant="outline" onClick={onClose} className="rounded-xl px-8">
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={isSaving || !name.trim()} className="rounded-xl px-8 gap-2">
                                    {isSaving ? (
                                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <Save size={18} />
                                    )}
                                    {isSaving ? "Salvando..." : "Salvar Unidade"}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
