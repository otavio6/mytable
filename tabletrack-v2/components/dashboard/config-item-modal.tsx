"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Save, Settings, Eye, Globe, Zap, AlertTriangle, Truck, Smartphone, Timer, ShieldCheck, Percent, Layers, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

interface ConfigItemModalProps {
    isOpen: boolean
    onClose: () => void
    item: any
    onSave?: (updatedItem: any) => void
    onDelete?: (id: number) => void
}

export function ConfigItemModal({ isOpen, onClose, item, onSave, onDelete }: ConfigItemModalProps) {
    const [activeTab, setActiveTab] = useState("general")
    const [localItem, setLocalItem] = useState(item)

    useEffect(() => {
        setLocalItem(item)
    }, [item])

    if (!item || !localItem) return null

    const handleSave = () => {
        if (onSave) onSave(localItem)
        onClose()
    }

    const handleDelete = () => {
        if (onDelete) onDelete(item.id)
        onClose()
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
                        className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-zinc-200"
                    >
                        <div className="flex h-[600px]">
                            {/* Tabs Sidebar */}
                            <div className="w-64 bg-zinc-50/50 border-r border-zinc-100 p-8 flex flex-col gap-2">
                                <h3 className="text-xl font-bold text-zinc-900 mb-6 px-1">Configurações</h3>
                                {[
                                    { id: "general", label: "Geral", icon: Settings },
                                    { id: "visibility", label: "Visibilidade", icon: Eye },
                                    { id: "delivery", label: "Entrega/App", icon: Globe },
                                    { id: "advanced", label: "Avançado", icon: Zap },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === tab.id
                                            ? "bg-white text-zinc-900 shadow-sm border border-zinc-200"
                                            : "text-zinc-400 hover:text-zinc-600"
                                            }`}
                                    >
                                        <tab.icon size={16} />
                                        {tab.label}
                                    </button>
                                ))}

                                <div className="mt-auto">
                                    <Button
                                        variant="outline"
                                        onClick={handleDelete}
                                        className="w-full justify-start gap-3 border-red-100 text-red-500 hover:bg-red-500 hover:text-white rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all"
                                    >
                                        <AlertTriangle size={14} />
                                        Excluir Item
                                    </Button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 flex flex-col">
                                <div className="p-8 border-b border-zinc-50 flex items-center justify-between">
                                    <div>
                                        <h4 className="font-bold text-zinc-900">{localItem.name}</h4>
                                        <p className="text-zinc-400 text-xs font-medium uppercase tracking-widest">Ajustes de Produto</p>
                                    </div>
                                    <Button variant="outline" size="icon" onClick={onClose} className="rounded-xl">
                                        <X size={18} />
                                    </Button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
                                    {activeTab === "general" && (
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Nome de Exibição</label>
                                                <input
                                                    type="text"
                                                    value={localItem.name}
                                                    onChange={(e) => setLocalItem({ ...localItem, name: e.target.value })}
                                                    className="w-full h-12 bg-zinc-50 border border-zinc-100 rounded-xl px-4 text-sm font-medium focus:outline-none focus:border-zinc-300 transition-all"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Preço Atual</label>
                                                    <input
                                                        type="text"
                                                        value={localItem.price}
                                                        onChange={(e) => setLocalItem({ ...localItem, price: e.target.value })}
                                                        className="w-full h-12 bg-zinc-50 border border-zinc-100 rounded-xl px-4 text-sm font-medium focus:outline-none focus:border-zinc-300 transition-all"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Categoria</label>
                                                    <select
                                                        value={localItem.category}
                                                        onChange={(e) => setLocalItem({ ...localItem, category: e.target.value })}
                                                        className="w-full h-12 bg-zinc-50 border border-zinc-100 rounded-xl px-4 text-sm font-medium focus:outline-none focus:border-zinc-300 transition-all appearance-none"
                                                    >
                                                        <option value="appetizers">Entradas</option>
                                                        <option value="main">Pratos Principais</option>
                                                        <option value="drinks">Bebidas</option>
                                                        <option value="desserts">Sobremesas</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="space-y-4 pt-4">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Unidades Disponíveis</label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {["Matriz Paulista", "Unidade Jardins", "Delivery Central", "Express Alphaville"].map((unit) => (
                                                        <div
                                                            key={unit}
                                                            className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-100 cursor-pointer hover:bg-zinc-100 transition-all"
                                                            onClick={() => {
                                                                const units = localItem.units || []
                                                                const newUnits = units.includes(unit)
                                                                    ? units.filter((u: string) => u !== unit)
                                                                    : [...units, unit]
                                                                setLocalItem({ ...localItem, units: newUnits })
                                                            }}
                                                        >
                                                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${localItem.units?.includes(unit) ? "bg-primary border-primary" : "bg-white border-zinc-200"}`}>
                                                                {localItem.units?.includes(unit) && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                            </div>
                                                            <span className="text-xs font-medium text-zinc-600">{unit}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === "visibility" && (
                                        <div className="space-y-6">
                                            <div
                                                onClick={() => setLocalItem({ ...localItem, available: !localItem.available })}
                                                className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100 cursor-pointer hover:bg-zinc-100 transition-all"
                                            >
                                                <div>
                                                    <p className="text-sm font-bold text-zinc-900">Disponível no Cardápio</p>
                                                    <p className="text-xs text-zinc-500">Ocultar o item temporariamente.</p>
                                                </div>
                                                <div className={`w-12 h-6 rounded-full transition-all relative flex items-center px-1 ${localItem.available ? "bg-emerald-500" : "bg-zinc-300"}`}>
                                                    <motion.div
                                                        animate={{ x: localItem.available ? 24 : 0 }}
                                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                        className="w-4 h-4 bg-white rounded-full shadow-sm"
                                                    />
                                                </div>
                                            </div>
                                            <div
                                                onClick={() => setLocalItem({ ...localItem, featured: !localItem.featured })}
                                                className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100 cursor-pointer hover:bg-zinc-100 transition-all"
                                            >
                                                <div>
                                                    <p className="text-sm font-bold text-zinc-900">Destaque da Casa</p>
                                                    <p className="text-xs text-zinc-500">Exibir no topo da categoria.</p>
                                                </div>
                                                <div className={`w-12 h-6 rounded-full transition-all relative flex items-center px-1 ${localItem.featured ? "bg-amber-500" : "bg-zinc-300"}`}>
                                                    <motion.div
                                                        animate={{ x: localItem.featured ? 24 : 0 }}
                                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                        className="w-4 h-4 bg-white rounded-full shadow-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === "delivery" && (
                                        <div className="space-y-4">
                                            {[
                                                { id: 'delivery', label: "Disponível para Delivery", icon: Truck },
                                                { id: 'own_app', label: "Venda via App Próprio", icon: Smartphone },
                                            ].map((opt) => (
                                                <div
                                                    key={opt.id}
                                                    onClick={() => setLocalItem({ ...localItem, [opt.id]: !localItem[opt.id] })}
                                                    className="flex items-center justify-between p-6 bg-zinc-50 rounded-[2rem] border border-zinc-100 cursor-pointer hover:bg-zinc-100 transition-all"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-white border border-zinc-100 flex items-center justify-center text-zinc-400">
                                                            <opt.icon size={18} />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-bold text-zinc-900">{opt.label}</p>
                                                        </div>
                                                    </div>
                                                    <div className={`w-12 h-6 rounded-full transition-all relative flex items-center px-1 ${localItem[opt.id] ? "bg-emerald-500" : "bg-zinc-300"}`}>
                                                        <motion.div
                                                            animate={{ x: localItem[opt.id] ? 24 : 0 }}
                                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                            className="w-4 h-4 bg-white rounded-full shadow-sm"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="flex items-center justify-between p-6 bg-zinc-50 rounded-[2rem] border border-zinc-100">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-white border border-zinc-100 flex items-center justify-center text-zinc-400">
                                                        <Timer size={18} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-xs font-bold text-zinc-900">Tempo Médio de Preparo</p>
                                                        <input
                                                            type="text"
                                                            value={localItem.prepTime || "15-20 min"}
                                                            onChange={(e) => setLocalItem({ ...localItem, prepTime: e.target.value })}
                                                            className="text-[10px] text-zinc-500 font-medium bg-transparent border-none outline-none w-full"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === "advanced" && (
                                        <div className="space-y-4">
                                            {[
                                                { id: 'erp_code', label: "Código PDV/ERP", icon: ShieldCheck, value: localItem.erpCode || "#REF-9921" },
                                                { id: 'taxes', label: "Configurar Impostos", icon: Percent, value: localItem.taxes || "ICMS/ISS Automático" },
                                                { id: 'inventory', label: "Gestão de Insumos", icon: Layers, value: localItem.inventory || "Controlar estoque de base" },
                                            ].map((opt) => (
                                                <div key={opt.id} className="flex items-center justify-between p-6 bg-zinc-50 rounded-[2rem] border border-zinc-100 group hover:border-zinc-300 transition-all cursor-pointer">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-white border border-zinc-100 flex items-center justify-center text-zinc-400 group-hover:text-zinc-900 transition-all">
                                                            <opt.icon size={18} />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-bold text-zinc-900">{opt.label}</p>
                                                            <input
                                                                type="text"
                                                                value={opt.value}
                                                                onChange={(e) => setLocalItem({ ...localItem, [opt.id]: e.target.value })}
                                                                className="text-[10px] text-zinc-400 font-medium bg-transparent border-none outline-none w-full"
                                                            />
                                                        </div>
                                                    </div>
                                                    <ChevronRight size={14} className="text-zinc-200 group-hover:text-zinc-400" />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="p-8 bg-zinc-50/50 border-t border-zinc-100">
                                    <Button
                                        onClick={handleSave}
                                        className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-bold gap-3 hover:opacity-90 transition-all shadow-lg shadow-primary/10"
                                    >
                                        <Save size={18} />
                                        Salvar Alterações
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
