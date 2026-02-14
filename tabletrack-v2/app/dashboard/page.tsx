"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { TrendingUp, Users, ShoppingBag, DollarSign, Plus, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NumberCounter } from "@/components/ui/number-counter"
import { NewRestaurantModal } from "@/components/dashboard/new-restaurant-modal"
import { UnitsModal } from "@/components/dashboard/units-modal"
import { useRestaurant } from "@/contexts/restaurant-context"
import { generateRandomStats } from "@/lib/seed-data"

export default function DashboardPage() {
    const [isNewModalOpen, setIsNewModalOpen] = useState(false)
    const [isUnitsModalOpen, setIsUnitsModalOpen] = useState(false)
    const [financialRange, setFinancialRange] = useState<'7d' | '30d'>('7d')
    const { restaurants, setRestaurants, selectedId, selectedRestaurant, getKey, getAllKeys } = useRestaurant()

    const handleAddRestaurant = (newRes: any) => {
        const restaurant = {
            ...newRes,
            id: Date.now(),
            status: "Active",
            image: newRes.image || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800"
        }
        setRestaurants([...restaurants, restaurant])
        setIsNewModalOpen(false)
    }

    // Scoped stats: generate per-restaurant or aggregate
    const generateStats = () => {
        let revenue = 0
        let ordersCount = 0
        let newClients = 0
        let occupancy = 0

        // 1. Calculate base stats (deterministic random)
        if (selectedId === "all") {
            restaurants.forEach(r => {
                const s = generateRandomStats(r.id)
                revenue += s.revenue
                ordersCount += s.orders
                newClients += s.newClients
                occupancy += s.occupancy
            })
            if (restaurants.length > 0) occupancy = Math.round(occupancy / restaurants.length)
        } else if (typeof selectedId === 'number') {
            const s = generateRandomStats(selectedId)
            revenue += s.revenue
            ordersCount += s.orders
            newClients += s.newClients
            occupancy += s.occupancy
        }

        // 2. Add real-time session data from localStorage
        const keys = selectedId === "all" ? getAllKeys("tt_v2_orders") : [getKey("tt_v2_orders")]
        keys.forEach(key => {
            const saved = localStorage.getItem(key)
            if (saved) {
                const orders = JSON.parse(saved)
                orders.forEach((o: any) => {
                    const price = parseFloat(o.price?.replace("R$", "").replace(".", "").replace(",", ".") || "0")
                    revenue += price
                    ordersCount += 1
                })
            }
        })

        return [
            { label: "Receita do Dia", value: revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 }), icon: DollarSign, trend: 12, prefix: "R$ " },
            { label: "Pedidos Hoje", value: ordersCount, icon: ShoppingBag, trend: 5 },
            { label: "Novos Clientes Hoje", value: newClients, icon: Users, trend: 18 },
            { label: "Taxa de Ocupação", value: occupancy, icon: TrendingUp, trend: 2, suffix: "%" },
        ]
    }

    const stats = generateStats()

    const chartData = financialRange === '7d'
        ? [40, 70, 45, 90, 65, 80, 55]
        : [50, 60, 40, 85, 75, 95, 60, 45, 70, 80, 55, 65]

    // Operation data: show all restaurants or just the selected one
    const operationData = selectedId === "all"
        ? restaurants.map(res => {
            const s = generateRandomStats(res.id)
            return {
                name: res.name,
                status: res.status === "Active" ? "Aberto" : "Fechado",
                occupancy: s.occupancy
            }
        })
        : selectedRestaurant
            ? (() => {
                const s = generateRandomStats(selectedRestaurant.id)
                return [{
                    name: selectedRestaurant.name,
                    status: selectedRestaurant.status === "Active" ? "Aberto" : "Fechado",
                    occupancy: s.occupancy
                }]
            })()
            : []

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12 pb-20"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-4xl font-bold tracking-tight text-zinc-900 italic">Dashboard</h2>
                    <p className="text-zinc-500 mt-2">
                        {selectedId === "all"
                            ? "Visão consolidada de todas as unidades."
                            : `Painel de controle — ${selectedRestaurant?.name || ""}`}
                    </p>
                </div>
                <Button
                    onClick={() => setIsNewModalOpen(true)}
                    className="h-14 px-8 rounded-2xl gap-3 shadow-xl shadow-primary/10 bg-primary text-primary-foreground hover:opacity-90 transition-all font-black uppercase text-[10px] tracking-widest"
                >
                    <Plus size={18} />
                    <span>Novo Restaurante</span>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm overflow-hidden">
                {stats.map((stat, i) => (
                    <div
                        key={stat.label}
                        className={`p-10 group transition-all duration-500 hover:bg-zinc-50/50 ${i !== stats.length - 1 ? 'border-r border-zinc-100' : ''}`}
                    >
                        <div className="flex items-center justify-between mb-10">
                            <div className="w-14 h-14 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 group-hover:text-primary transition-all duration-300">
                                <stat.icon size={26} />
                            </div>
                            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                                <ArrowUpRight size={14} strokeWidth={3} />
                                <span className="text-[10px] font-black tracking-widest leading-none">
                                    {stat.trend}%
                                </span>
                            </div>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{stat.label}</p>
                        <h3 className="text-4xl font-bold mt-2 text-zinc-900 tracking-tight tabular-nums">
                            {stat.label.includes("Taxa") ? `${stat.value}%` : <NumberCounter value={typeof stat.value === 'string' ? parseFloat(stat.value.replace("R$ ", "").replace(".", "").replace(",", ".")) : stat.value} prefix={stat.prefix} suffix={stat.suffix} />}
                        </h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 p-12 premium-card flex flex-col">
                    <div className="flex items-center justify-between mb-12">
                        <h3 className="text-2xl font-bold text-zinc-900 italic">Resumo Financeiro</h3>
                        <div className="flex gap-1 bg-zinc-100 p-1.5 rounded-xl">
                            <button
                                onClick={() => setFinancialRange('7d')}
                                className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${financialRange === '7d' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
                            >
                                7 Dias
                            </button>
                            <button
                                onClick={() => setFinancialRange('30d')}
                                className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${financialRange === '30d' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
                            >
                                30 Dias
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 flex items-end justify-between px-6 pb-4 min-h-[250px] gap-4">
                        {chartData.map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ delay: i * 0.05, duration: 0.8, ease: "easeOut" }}
                                className="flex-1 bg-zinc-100 rounded-2xl relative group cursor-pointer hover:bg-zinc-200 transition-colors"
                            >
                                <div className="absolute inset-x-2 bottom-2 top-2 bg-primary/5 rounded-xl group-hover:bg-primary/10 transition-colors" />
                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-10">
                                    R$ {h * 100}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="flex justify-between px-6 mt-10 text-[10px] uppercase font-black text-zinc-300 tracking-[0.3em]">
                        {financialRange === '7d'
                            ? ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"].map(d => <span key={d}>{d}</span>)
                            : ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9", "S10", "S11", "S12"].map(d => <span key={d}>{d}</span>)
                        }
                    </div>
                </div>

                <div className="p-12 premium-card flex flex-col">
                    <h3 className="text-2xl font-bold mb-10 text-zinc-900 italic">Operação em Tempo Real</h3>
                    <div className="space-y-8 flex-1 overflow-y-auto max-h-[400px] scrollbar-hide pr-2">
                        {operationData.length > 0 ? operationData.map((res) => (
                            <div key={res.name} className="flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center font-bold text-zinc-400 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shrink-0">
                                        {res.name[0]}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-zinc-900 group-hover:translate-x-1 transition-transform">{res.name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="w-20 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${res.occupancy}%` }} />
                                            </div>
                                            <span className="text-[9px] font-bold text-zinc-400">{res.occupancy}%</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={`w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm shrink-0 ${res.status === 'Aberto' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                            </div>
                        )) : (
                            <div className="flex-1 flex items-center justify-center text-zinc-300">
                                <p className="text-sm font-medium">Nenhum restaurante cadastrado</p>
                            </div>
                        )}
                    </div>
                    <Button
                        onClick={() => setIsUnitsModalOpen(true)}
                        variant="secondary"
                        className="mt-12 w-full h-14 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900"
                    >
                        <span className="uppercase text-[10px] font-black tracking-widest">Ver Todas Unidades</span>
                    </Button>
                </div>
            </div>

            <NewRestaurantModal isOpen={isNewModalOpen} onClose={() => setIsNewModalOpen(false)} onAdd={handleAddRestaurant} />
            <UnitsModal isOpen={isUnitsModalOpen} onClose={() => setIsUnitsModalOpen(false)} />
        </motion.div>
    )
}
