"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Search, Minus, Plus, ShoppingBag, MessageSquare, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NewOrderModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (order: { table: string; items: string[]; price: string; obs: string }) => void
    restaurantId: number | null
}

export function NewOrderModal({ isOpen, onClose, onSubmit, restaurantId }: NewOrderModalProps) {
    const [table, setTable] = useState("")
    const [search, setSearch] = useState("")
    const [obs, setObs] = useState("")
    const [cart, setCart] = useState<Record<number, number>>({}) // itemId -> qty
    const [menuItems, setMenuItems] = useState<any[]>([])

    // Load menu items for the selected restaurant
    useEffect(() => {
        if (isOpen && restaurantId) {
            const key = `tt_v2_menu_items_${restaurantId}`
            const saved = localStorage.getItem(key)
            if (saved) {
                const items = JSON.parse(saved).filter((i: any) => i.available !== false)
                setMenuItems(items)
            } else {
                setMenuItems([])
            }
        }
    }, [isOpen, restaurantId])

    // Reset state on close
    useEffect(() => {
        if (!isOpen) {
            setTable("")
            setSearch("")
            setObs("")
            setCart({})
        }
    }, [isOpen])

    const filteredMenu = useMemo(() => {
        if (!search.trim()) return menuItems
        return menuItems.filter(i =>
            i.name.toLowerCase().includes(search.toLowerCase())
        )
    }, [search, menuItems])

    const addToCart = (id: number) => {
        setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }))
    }

    const removeFromCart = (id: number) => {
        setCart(prev => {
            const qty = (prev[id] || 0) - 1
            if (qty <= 0) {
                const next = { ...prev }
                delete next[id]
                return next
            }
            return { ...prev, [id]: qty }
        })
    }

    const clearFromCart = (id: number) => {
        setCart(prev => {
            const next = { ...prev }
            delete next[id]
            return next
        })
    }

    const cartEntries = Object.entries(cart)
        .filter(([, qty]) => qty > 0)
        .map(([idStr, qty]) => {
            const id = parseInt(idStr)
            const item = menuItems.find(i => i.id === id)
            return item ? { ...item, qty } : null
        })
        .filter(Boolean) as (any & { qty: number })[]

    const total = cartEntries.reduce((sum, entry) => {
        const price = parseFloat(entry.price.replace("R$", "").replace(".", "").replace(",", ".").trim())
        return sum + price * entry.qty
    }, 0)

    const formattedTotal = `R$ ${total.toFixed(2).replace('.', ',')}`

    const handleSubmit = () => {
        if (!table.trim() || cartEntries.length === 0) return
        const items = cartEntries.map(e => `${e.qty}x ${e.name}`)
        onSubmit({
            table: table.padStart(2, '0'),
            items,
            price: formattedTotal,
            obs: obs.trim(),
        })
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6"
                onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden relative"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 pb-0 shrink-0">
                        <div>
                            <h2 className="text-2xl font-bold text-zinc-900 italic">Novo Pedido</h2>
                            <p className="text-xs text-zinc-400 mt-1 font-medium">Selecione os itens e informe a mesa</p>
                        </div>
                        <button onClick={onClose} className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all">
                            <X size={18} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                        {/* Table Input */}
                        <div>
                            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block mb-2">Mesa</label>
                            <input
                                type="number"
                                min="1"
                                value={table}
                                onChange={(e) => setTable(e.target.value)}
                                placeholder="Número da mesa"
                                className="w-full h-14 rounded-2xl border border-zinc-200 px-5 text-sm font-medium text-zinc-900 placeholder:text-zinc-300 outline-none focus:border-zinc-400 transition-colors bg-zinc-50/50"
                            />
                        </div>

                        {/* Menu Item Search */}
                        <div>
                            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block mb-2">Adicionar Itens</label>
                            <div className="flex items-center gap-3 h-14 rounded-2xl border border-zinc-200 px-5 bg-zinc-50/50 focus-within:border-zinc-400 transition-colors mb-3">
                                <Search size={16} className="text-zinc-300 shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Buscar no cardápio..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="flex-1 bg-transparent border-none outline-none text-sm font-medium placeholder:text-zinc-300 text-zinc-900"
                                />
                            </div>

                            {/* Menu Items List */}
                            <div className="border border-zinc-100 rounded-2xl overflow-hidden max-h-[200px] overflow-y-auto scrollbar-hide">
                                {filteredMenu.length > 0 ? filteredMenu.map(item => {
                                    const qty = cart[item.id] || 0
                                    return (
                                        <div key={item.id} className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-50 last:border-none hover:bg-zinc-50/50 transition-colors">
                                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                                <div className="w-10 h-10 rounded-xl bg-zinc-100 overflow-hidden shrink-0">
                                                    {item.image && (
                                                        <img src={item.image} alt="" className="w-full h-full object-cover" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-bold text-zinc-900 truncate">{item.name}</p>
                                                    <p className="text-[10px] font-bold text-zinc-400 mt-0.5">{item.price}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0 ml-4">
                                                {qty > 0 && (
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500 hover:bg-zinc-200 transition-colors"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                )}
                                                {qty > 0 && (
                                                    <span className="w-8 text-center text-xs font-bold text-zinc-900 tabular-nums">{qty}</span>
                                                )}
                                                <button
                                                    onClick={() => addToCart(item.id)}
                                                    className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground hover:opacity-90 transition-colors"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    )
                                }) : (
                                    <div className="p-8 text-center">
                                        <p className="text-xs text-zinc-300 font-medium">
                                            {menuItems.length === 0
                                                ? "Nenhum item disponível no cardápio deste restaurante"
                                                : "Nenhum item encontrado"}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Cart */}
                        {cartEntries.length > 0 && (
                            <div>
                                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block mb-2">
                                    <ShoppingBag size={10} className="inline mr-2" />
                                    Itens Selecionados ({cartEntries.length})
                                </label>
                                <div className="space-y-2">
                                    {cartEntries.map(entry => (
                                        <div key={entry.id} className="flex items-center justify-between px-4 py-3 bg-zinc-50 rounded-xl border border-zinc-100">
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <span className="text-xs font-black text-zinc-900 bg-white px-2.5 py-1 rounded-lg border border-zinc-100 tabular-nums">{entry.qty}x</span>
                                                <span className="text-xs font-bold text-zinc-700 truncate">{entry.name}</span>
                                            </div>
                                            <div className="flex items-center gap-3 shrink-0 ml-2">
                                                <span className="text-xs font-bold text-zinc-500 tabular-nums">{entry.price}</span>
                                                <button
                                                    onClick={() => clearFromCart(entry.id)}
                                                    className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-300 hover:text-red-500 hover:bg-red-50 transition-all"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Observation */}
                        <div>
                            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block mb-2">
                                <MessageSquare size={10} className="inline mr-2" />
                                Observação (opcional)
                            </label>
                            <textarea
                                value={obs}
                                onChange={(e) => setObs(e.target.value)}
                                placeholder="Ex: sem cebola, ponto mal passado..."
                                rows={2}
                                className="w-full rounded-2xl border border-zinc-200 px-5 py-4 text-sm font-medium text-zinc-900 placeholder:text-zinc-300 outline-none focus:border-zinc-400 transition-colors bg-zinc-50/50 resize-none"
                            />
                        </div>
                    </div>

                    {/* Footer / Total + Submit */}
                    <div className="p-6 pt-4 border-t border-zinc-100 shrink-0 bg-white">
                        {cartEntries.length > 0 && (
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Total do Pedido</span>
                                <span className="text-xl font-bold text-zinc-900 tabular-nums">{formattedTotal}</span>
                            </div>
                        )}
                        <Button
                            onClick={handleSubmit}
                            disabled={!table.trim() || cartEntries.length === 0}
                            className="w-full h-14 rounded-2xl gap-3 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/10 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <ShoppingBag size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Solicitar Pedido</span>
                        </Button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
