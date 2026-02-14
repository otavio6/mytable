"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, Reorder } from "framer-motion"
import {
    ChevronRight,
    CheckCircle2,
    Timer,
    XCircle,
    RotateCcw,
    PackageCheck,
    Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { NumberCounter } from "@/components/ui/number-counter"
import { useRestaurant } from "@/contexts/restaurant-context"
import { NewOrderModal } from "@/components/dashboard/new-order-modal"

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([])
    const [isLoaded, setIsLoaded] = useState(false)
    const [isNewOrderOpen, setIsNewOrderOpen] = useState(false)
    const { selectedId, selectedRestaurant, restaurants, getKey, getAllKeys } = useRestaurant()


    // Load orders scoped to selected restaurant
    useEffect(() => {
        if (selectedId === "all") {
            // Aggregate from all restaurants
            const allOrders: any[] = []
            getAllKeys("tt_v2_orders").forEach(key => {
                const saved = localStorage.getItem(key)
                if (saved) {
                    allOrders.push(...JSON.parse(saved))
                }
            })
            setOrders(allOrders)
        } else {
            const key = getKey("tt_v2_orders")
            const saved = localStorage.getItem(key)
            if (saved) {
                setOrders(JSON.parse(saved))
            } else {
                setOrders([])
            }
        }
        setIsLoaded(true)
    }, [selectedId])

    // Save when orders change (only when a specific restaurant is selected)
    useEffect(() => {
        if (isLoaded && selectedId !== "all") {
            const key = getKey("tt_v2_orders")
            localStorage.setItem(key, JSON.stringify(orders))
        }
    }, [orders, isLoaded])

    const columns = [
        { id: "pending", name: "Aguardando", color: "bg-amber-500", badgeColor: "bg-amber-50 text-amber-600 border-amber-100" },
        { id: "preparing", name: "Em Preparo", color: "bg-blue-500", badgeColor: "bg-blue-50 text-blue-600 border-blue-100" },
        { id: "ready", name: "Pronto", color: "bg-emerald-500", badgeColor: "bg-emerald-50 text-emerald-600 border-emerald-100" },
        { id: "delivered", name: "Entregue", color: "bg-violet-500", badgeColor: "bg-violet-50 text-violet-600 border-violet-100" },
    ]

    const moveOrder = (id: string, newStatus: string) => {
        setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o))
    }

    const cancelOrder = (id: string) => {
        setOrders(orders.filter(o => o.id !== id))
    }

    const reorderColumn = (newOrder: any[], status: string) => {
        const otherOrders = orders.filter(o => o.status !== status)
        setOrders([...otherOrders, ...newOrder])
    }

    const getNextOrderId = () => {
        // Find the max order number across ALL restaurants to avoid duplicates
        let maxNum = 100
        const idPrefix = selectedId === "all" ? "" : `ORD-${selectedId}-`

        restaurants.forEach(r => {
            const key = `tt_v2_orders_${r.id}`
            const saved = localStorage.getItem(key)
            if (saved) {
                const parsed = JSON.parse(saved)
                parsed.forEach((o: any) => {
                    // Match the last number in the ID (e.g. 105 in ORD-1-105 or ORD-105)
                    const match = o.id?.match(/ORD-.*-(\d+)$/) || o.id?.match(/ORD-(\d+)$/)
                    if (match) {
                        maxNum = Math.max(maxNum, parseInt(match[1]))
                    }
                })
            }
        })

        // Also check current local state (optimistic)
        orders.forEach(o => {
            const match = o.id?.match(/ORD-.*-(\d+)$/) || o.id?.match(/ORD-(\d+)$/)
            if (match) {
                maxNum = Math.max(maxNum, parseInt(match[1]))
            }
        })

        const nextNum = maxNum + 1
        return selectedId === "all" ? `ORD-TEMP-${nextNum}` : `ORD-${selectedId}-${nextNum}`
    }

    const handleNewOrder = (order: { table: string; items: string[]; price: string; obs: string }) => {
        const now = new Date()
        const newOrder = {
            id: getNextOrderId(),
            table: order.table,
            items: order.items,
            price: order.price,
            time: "agora",
            status: "pending",
            obs: order.obs,
        }
        setOrders(prev => [...prev, newOrder])
        setIsNewOrderOpen(false)
    }

    const isReadonly = selectedId === "all"

    return (
        <div className="h-full flex flex-col gap-8 pb-10">
            {/* Header */}
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h2 className="text-4xl font-bold tracking-tight text-zinc-900 italic">Fluxo de Pedidos</h2>
                    <p className="text-zinc-500 mt-2 font-medium">
                        {selectedId === "all"
                            ? "Visualização consolidada de todas as unidades."
                            : `Pedidos — ${selectedRestaurant?.name || ""}`}
                    </p>
                </div>
                <div className="flex items-center gap-6">
                    {!isReadonly && (
                        <Button
                            id="tour-new-order"
                            onClick={() => setIsNewOrderOpen(true)}
                            className="h-12 px-6 rounded-2xl gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/10"
                        >
                            <Plus size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Novo Pedido</span>
                        </Button>
                    )}
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300 mb-1">Total Hoje</span>
                        <div className="text-2xl font-bold text-zinc-900 tabular-nums">
                            <NumberCounter value={orders.length} />
                        </div>
                    </div>
                    <div className="w-px h-10 bg-zinc-100" />
                    <div className="flex items-center gap-3 px-5 py-2.5 bg-zinc-50 border border-zinc-100 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Sincronizado
                    </div>
                </div>
            </div>

            {isReadonly && (
                <div className="px-5 py-3 bg-amber-50 border border-amber-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-amber-600 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                    Modo Leitura — Selecione um restaurante específico para gerenciar pedidos
                </div>
            )}

            {/* Kanban Board */}
            <div className="flex-1 min-h-0 overflow-x-auto pb-4 scrollbar-hide">
                <div className="flex h-full gap-5 min-w-[1100px] lg:min-w-0">
                    {columns.map((col) => {
                        const colOrders = orders.filter(o => o.status === col.id)
                        return (
                            <div key={col.id} className="flex-1 flex flex-col h-full min-w-[260px]">
                                {/* Column Header */}
                                <div className="flex items-center gap-3 mb-5 px-4">
                                    <div className={`w-2 h-2 rounded-full ${col.color}`} />
                                    <h3 className="font-black uppercase tracking-[.2em] text-[9px] text-zinc-400">{col.name}</h3>
                                    <div className="bg-zinc-100 px-2.5 py-0.5 rounded-full text-[9px] font-black text-zinc-500 tabular-nums">
                                        {colOrders.length}
                                    </div>
                                </div>

                                {/* Column Body */}
                                <div className="flex-1 bg-zinc-50/50 rounded-2xl p-3 border border-zinc-100 overflow-y-auto scrollbar-hide">
                                    <Reorder.Group
                                        axis="y"
                                        values={colOrders}
                                        onReorder={(newVal) => !isReadonly && reorderColumn(newVal, col.id)}
                                        className="space-y-3"
                                    >
                                        <AnimatePresence mode="popLayout">
                                            {colOrders.map((order) => (
                                                <Reorder.Item
                                                    key={order.id}
                                                    value={order}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    drag={!isReadonly}
                                                    className={`p-4 rounded-xl bg-white border border-zinc-100 shadow-sm group relative transition-all duration-200 hover:shadow-md ${!isReadonly ? 'cursor-grab active:cursor-grabbing' : ''} ${col.id === 'delivered' ? 'opacity-60' : ''}`}
                                                >
                                                    {/* Top Row */}
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center text-xs font-bold">
                                                                {order.table}
                                                            </div>
                                                            <div>
                                                                <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-wider uppercase border ${col.badgeColor}`}>
                                                                    {order.id}
                                                                </span>
                                                                <p className="text-xs font-bold text-zinc-900 mt-0.5">Mesa {order.table}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-400 bg-zinc-50 px-2 py-1 rounded-lg">
                                                            <Timer size={10} />
                                                            {order.time}
                                                        </div>
                                                    </div>

                                                    {/* Items */}
                                                    <div className="mb-3 pl-1">
                                                        {order.items.map((item: string, idx: number) => (
                                                            <p key={idx} className="text-[11px] text-zinc-500 font-medium leading-relaxed flex items-center gap-2">
                                                                <span className="w-1 h-1 rounded-full bg-zinc-300 shrink-0" />
                                                                {item}
                                                            </p>
                                                        ))}
                                                    </div>

                                                    {/* Observation */}
                                                    {order.obs && (
                                                        <div className="mb-3 px-3 py-2 bg-amber-50 border border-amber-100 rounded-lg">
                                                            <p className="text-[10px] text-amber-700 font-medium italic">"{order.obs}"</p>
                                                        </div>
                                                    )}

                                                    {/* Footer */}
                                                    <div className="flex items-center justify-between pt-3 border-t border-zinc-50">
                                                        <p className="font-black text-zinc-900 text-[10px] tracking-wider tabular-nums">{order.price}</p>
                                                        {!isReadonly && (
                                                            <div className="flex items-center gap-1.5">
                                                                {col.id !== 'delivered' && (
                                                                    <button
                                                                        onClick={(e) => { e.stopPropagation(); cancelOrder(order.id) }}
                                                                        className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                                                                    >
                                                                        <XCircle size={14} />
                                                                    </button>
                                                                )}
                                                                {col.id !== 'pending' && col.id !== 'delivered' && (
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation()
                                                                            moveOrder(order.id, col.id === 'ready' ? 'preparing' : 'pending')
                                                                        }}
                                                                        className="w-7 h-7 rounded-lg border border-zinc-100 flex items-center justify-center text-zinc-300 hover:text-zinc-900 hover:bg-zinc-50 transition-all"
                                                                    >
                                                                        <RotateCcw size={12} />
                                                                    </button>
                                                                )}
                                                                {col.id === 'pending' && (
                                                                    <Button size="sm" variant="outline" className="h-7 text-[8px] font-black uppercase tracking-widest rounded-lg px-3 border-zinc-200 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all" onClick={(e) => { e.stopPropagation(); moveOrder(order.id, 'preparing') }}>
                                                                        Aceitar <ChevronRight size={10} className="ml-0.5" />
                                                                    </Button>
                                                                )}
                                                                {col.id === 'preparing' && (
                                                                    <Button size="sm" variant="outline" className="h-7 text-[8px] font-black uppercase tracking-widest rounded-lg px-3 border-emerald-200 text-emerald-600 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all" onClick={(e) => { e.stopPropagation(); moveOrder(order.id, 'ready') }}>
                                                                        Pronto <CheckCircle2 size={10} className="ml-0.5" />
                                                                    </Button>
                                                                )}
                                                                {col.id === 'ready' && (
                                                                    <Button size="sm" variant="outline" className="h-7 text-[8px] font-black uppercase tracking-widest rounded-lg px-3 border-violet-200 text-violet-600 hover:bg-violet-600 hover:text-white hover:border-violet-600 transition-all" onClick={(e) => { e.stopPropagation(); moveOrder(order.id, 'delivered') }}>
                                                                        <PackageCheck size={10} className="mr-0.5" /> Entregar
                                                                    </Button>
                                                                )}
                                                                {col.id === 'delivered' && (
                                                                    <span className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-violet-500">
                                                                        <CheckCircle2 size={10} /> OK
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </Reorder.Item>
                                            ))}
                                        </AnimatePresence>
                                    </Reorder.Group>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* New Order Modal */}
            <NewOrderModal
                isOpen={isNewOrderOpen}
                onClose={() => setIsNewOrderOpen(false)}
                onSubmit={handleNewOrder}
                restaurantId={typeof selectedId === "number" ? selectedId : null}
            />
        </div>
    )
}
