"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Plus, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useRef } from "react"

interface NewItemModalProps {
    isOpen: boolean
    onClose: () => void
    onAdd?: (item: any) => void
    categories?: { id: string; name: string }[]
}

export function NewItemModal({ isOpen, onClose, onAdd, categories }: NewItemModalProps) {
    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("")
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const defaultCategories = categories || [
        { id: "appetizers", name: "Entradas" },
        { id: "main", name: "Pratos Principais" },
        { id: "drinks", name: "Bebidas" },
        { id: "desserts", name: "Sobremesas" },
    ]

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = () => {
        if (!name.trim()) return

        setIsSaving(true)
        setTimeout(() => {
            if (onAdd) {
                onAdd({
                    name: name.trim(),
                    price: price.trim() || "R$ 0,00",
                    description: description.trim(),
                    category: category || defaultCategories[0]?.id || "main",
                    image: imagePreview || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400",
                    available: true,
                    orders: 0,
                })
            }
            setName("")
            setPrice("")
            setDescription("")
            setCategory("")
            setImagePreview(null)
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
                        className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-zinc-200"
                    >
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-bold text-zinc-900">Novo Item</h3>
                                    <p className="text-zinc-500 text-sm font-medium">Adicione uma nova delícia ao seu cardápio.</p>
                                </div>
                                <Button variant="outline" size="icon" onClick={onClose} className="rounded-xl">
                                    <X size={18} />
                                </Button>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Nome do Prato</label>
                                        <input
                                            type="text"
                                            placeholder="Ex: Risoto de Trufas"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full h-14 bg-zinc-50 border border-zinc-100 rounded-2xl px-6 text-sm font-medium focus:outline-none focus:border-zinc-300 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Preço</label>
                                        <input
                                            type="text"
                                            placeholder="R$ 0,00"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            className="w-full h-14 bg-zinc-50 border border-zinc-100 rounded-2xl px-6 text-sm font-medium focus:outline-none focus:border-zinc-300 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Categoria</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full h-14 bg-zinc-50 border border-zinc-100 rounded-2xl px-6 text-sm font-medium focus:outline-none focus:border-zinc-300 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="">Selecione uma categoria</option>
                                        {defaultCategories.filter(c => c.id !== "all").map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Descrição Curta</label>
                                    <textarea
                                        placeholder="Descreva os ingredientes e o preparo..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full h-32 bg-zinc-50 border border-zinc-100 rounded-3xl p-6 text-sm font-medium focus:outline-none focus:border-zinc-300 transition-all resize-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Foto do Prato (Opcional)</label>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full h-40 bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-[2rem] flex flex-col items-center justify-center gap-3 text-zinc-400 hover:bg-zinc-100 hover:border-zinc-300 transition-all cursor-pointer group overflow-hidden relative"
                                    >
                                        {imagePreview ? (
                                            <>
                                                <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span className="text-white text-xs font-bold uppercase tracking-widest">Alterar Imagem</span>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <ImageIcon size={20} />
                                                </div>
                                                <span className="text-xs font-bold uppercase tracking-widest">Upload de Imagem</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <Button
                                    onClick={handleSubmit}
                                    disabled={isSaving || !name.trim()}
                                    className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-bold gap-3 mt-4 hover:opacity-90 transition-all"
                                >
                                    {isSaving ? (
                                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <Plus size={18} />
                                    )}
                                    {isSaving ? "Criando..." : "Criar Item no Cardápio"}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
