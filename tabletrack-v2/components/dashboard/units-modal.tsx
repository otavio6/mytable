"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, MapPin, ShoppingBag, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState, useEffect } from "react"

interface UnitsModalProps {
    isOpen: boolean
    onClose: () => void
}

export function UnitsModal({ isOpen, onClose }: UnitsModalProps) {
    const [units, setUnits] = useState<any[]>([])

    useEffect(() => {
        if (isOpen) {
            const saved = localStorage.getItem("tt_v2_restaurants")
            if (saved) {
                const restaurants = JSON.parse(saved)
                setUnits(restaurants.map((r: any) => ({
                    name: r.name,
                    status: r.status === "Active" ? "Aberto" : "Fechado",
                    orders: r.status === "Active" ? Math.floor(Math.random() * 20) + 1 : 0,
                    address: r.location || "Não informado",
                    type: r.cuisine || "Geral",
                })))
            } else {
                setUnits([
                    { name: "La Brasserie", status: "Aberto", orders: 12, address: "Av. Paulista, 1000", type: "Francesa" },
                    { name: "Sushi Garden", status: "Aberto", orders: 8, address: "Rua Augusta, 450", type: "Japonesa" },
                    { name: "Burger House", status: "Fechado", orders: 0, address: "Al. Lorena, 12", type: "Americana" },
                ])
            }
        }
    }, [isOpen])

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
                        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-zinc-100 flex flex-col max-h-[80vh]"
                    >
                        <div className="p-8 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                            <div>
                                <h3 className="text-xl font-bold text-zinc-900">Todas as Unidades</h3>
                                <p className="text-sm text-zinc-500 mt-1">Visão geral de todas as operações em tempo real.</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                                <X size={20} className="text-zinc-400" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar">
                            {units.length === 0 ? (
                                <div className="flex items-center justify-center py-20 text-zinc-300">
                                    <p className="text-sm font-medium">Nenhuma unidade cadastrada</p>
                                </div>
                            ) : units.map((unit, i) => (
                                <motion.div
                                    key={unit.name + i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="p-6 rounded-2xl border border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50 transition-all group flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-xl bg-zinc-100 flex items-center justify-center font-bold text-zinc-400 group-hover:bg-white group-hover:text-zinc-900 transition-all border border-transparent group-hover:border-zinc-200">
                                            {unit.name[0]}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h4 className="font-bold text-zinc-900">{unit.name}</h4>
                                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${unit.status === 'Aberto' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-zinc-100 text-zinc-400 border border-zinc-200'}`}>
                                                    {unit.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 mt-2">
                                                <div className="flex items-center gap-1.5 text-zinc-400">
                                                    <MapPin size={12} />
                                                    <span className="text-[10px] font-medium">{unit.address}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-zinc-400">
                                                    <ShoppingBag size={12} />
                                                    <span className="text-[10px] font-medium">{unit.orders} pedidos</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <Link href="/dashboard/restaurants" onClick={onClose}>
                                        <Button variant="ghost" size="sm" className="rounded-full gap-2 text-[10px] uppercase font-bold tracking-widest hover:bg-zinc-900 hover:text-white transition-all">
                                            <Eye size={14} />
                                            Gerenciar
                                        </Button>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        <div className="p-6 border-t border-zinc-100 bg-zinc-50/50 flex justify-end">
                            <Button onClick={onClose} className="rounded-xl px-8">
                                Fechar Janela
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
