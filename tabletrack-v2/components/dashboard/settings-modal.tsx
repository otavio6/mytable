"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Save, User, Bell, Lock, Globe, Camera, Shield, Check, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useTheme } from "@/contexts/theme-context"

interface SettingsModalProps {
    isOpen: boolean
    onClose: () => void
    initialSection?: string
}

export function SettingsModal({ isOpen, onClose, initialSection = "profile" }: SettingsModalProps) {
    const [activeTab, setActiveTab] = useState(initialSection)
    const [settings, setSettings] = useState({
        profile: { name: "Otávio Silva", email: "otavio@tabletrack.com" },
        notifications: { orders: true, reports: true, stock: false },
        security: { twoFactor: true },
        preferences: { language: "pt-BR", timezone: "GMT-3" }
    })
    const [isLoaded, setIsLoaded] = useState(false)
    const { theme, setTheme, themes } = useTheme()

    useEffect(() => {
        const saved = localStorage.getItem("tt_v2_settings")
        if (saved) {
            setSettings(JSON.parse(saved))
        }
        setIsLoaded(true)
    }, [])

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("tt_v2_settings", JSON.stringify(settings))
        }
    }, [settings, isLoaded])

    const [isSaving, setIsSaving] = useState(false)

    // Sync active tab when initialSection changes (modal re-opens)
    useEffect(() => {
        if (isOpen) {
            setActiveTab(initialSection)
        }
    }, [isOpen, initialSection])

    const handleSave = () => {
        setIsSaving(true)
        setTimeout(() => {
            setIsSaving(false)
            onClose()
        }, 800)
    }

    const toggle = (section: keyof typeof settings, field: string) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...(prev[section] as any),
                [field]: !((prev[section] as any)[field])
            }
        }))
    }

    const tabs = [
        { id: "profile", label: "Perfil", icon: User },
        { id: "notifications", label: "Notificações", icon: Bell },
        { id: "security", label: "Segurança", icon: Lock },
        { id: "preferences", label: "Preferências", icon: Globe },
        { id: "styling", label: "Personalização", icon: Palette },
    ]

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
                        className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-zinc-100 flex h-[700px]"
                    >
                        {/* Sidebar */}
                        <div className="w-72 bg-zinc-50 border-r border-zinc-100 p-10 flex flex-col gap-2">
                            <h3 className="text-2xl font-bold text-zinc-900 mb-8 px-2 italic">Configurações</h3>
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id
                                        ? "bg-white text-zinc-900 shadow-sm border border-zinc-200"
                                        : "text-zinc-400 hover:text-zinc-600"
                                        }`}
                                >
                                    <tab.icon size={18} />
                                    {tab.label}
                                </button>
                            ))}

                            <div className="mt-auto p-6 rounded-3xl bg-primary text-primary-foreground space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                        <Shield size={14} />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary-foreground/70">Plano Premium</p>
                                </div>
                                <p className="text-xs font-medium text-primary-foreground/50 leading-relaxed">Você tem acesso a todas as funcionalidades táteis do sistema.</p>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex flex-col">
                            <div className="p-10 border-b border-zinc-50 flex items-center justify-between">
                                <div>
                                    <h4 className="text-xl font-bold text-zinc-900">{tabs.find(t => t.id === activeTab)?.label}</h4>
                                    <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em]">Ajustes da sua experiência</p>
                                </div>
                                <button onClick={onClose} className="p-3 hover:bg-zinc-100 rounded-2xl transition-colors">
                                    <X size={20} className="text-zinc-400" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-10 space-y-10 scrollbar-hide">
                                {activeTab === "profile" && (
                                    <div className="space-y-10">
                                        <div className="flex items-center gap-8">
                                            <div className="relative group">
                                                <div className="w-24 h-24 rounded-[2.5rem] bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-300">
                                                    <User size={40} />
                                                </div>
                                                <button className="absolute -bottom-2 -right-2 p-3 bg-white border border-zinc-200 rounded-xl shadow-lg text-zinc-400 hover:text-zinc-900 transition-all">
                                                    <Camera size={16} />
                                                </button>
                                            </div>
                                            <div>
                                                <h5 className="font-bold text-lg text-zinc-900 uppercase tracking-tight">Foto do Perfil</h5>
                                                <p className="text-sm text-zinc-400 font-medium">PNG ou JPG até 5MB.</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Nome Completo</label>
                                                <input
                                                    type="text"
                                                    value={settings.profile.name}
                                                    onChange={(e) => setSettings({ ...settings, profile: { ...settings.profile, name: e.target.value } })}
                                                    className="w-full h-14 bg-zinc-50 border border-zinc-100 rounded-2xl px-6 text-sm font-medium focus:outline-none focus:border-zinc-300 transition-all"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Endereço de E-mail</label>
                                                <input
                                                    type="email"
                                                    value={settings.profile.email}
                                                    onChange={(e) => setSettings({ ...settings, profile: { ...settings.profile, email: e.target.value } })}
                                                    className="w-full h-14 bg-zinc-50 border border-zinc-100 rounded-2xl px-6 text-sm font-medium focus:outline-none focus:border-zinc-300 transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "notifications" && (
                                    <div className="space-y-6">
                                        {[
                                            { id: 'orders', title: "Pedidos em Tempo Real", desc: "Alertas visuais e sonoros para novos pedidos." },
                                            { id: 'reports', title: "Relatórios Semanais", desc: "Resumo de desempenho no seu e-mail." },
                                            { id: 'stock', title: "Alertas de Estoque", desc: "Avisar quando itens estiverem acabando." },
                                        ].map((item) => (
                                            <div
                                                key={item.id}
                                                onClick={() => toggle('notifications', item.id)}
                                                className="flex items-center justify-between p-6 bg-zinc-50 rounded-[2rem] border border-zinc-100 hover:border-zinc-200 transition-all cursor-pointer group"
                                            >
                                                <div>
                                                    <p className="font-bold text-zinc-900">{item.title}</p>
                                                    <p className="text-xs text-zinc-400 font-medium">{item.desc}</p>
                                                </div>
                                                <div className={`w-14 h-8 rounded-full border flex items-center transition-all px-1.5 ${settings.notifications[item.id as keyof typeof settings.notifications] ? "bg-emerald-500 border-emerald-600 justify-end" : "bg-zinc-200 border-zinc-300 justify-start"}`}>
                                                    <motion.div layout className="w-5 h-5 rounded-full bg-white shadow-sm" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeTab === "security" && (
                                    <div className="space-y-8">
                                        <div className="p-8 rounded-[2rem] bg-zinc-50 border border-zinc-100 space-y-6">
                                            <h5 className="font-bold text-zinc-900">Alterar Senha</h5>
                                            <div className="space-y-4">
                                                <input type="password" placeholder="Senha Atual" className="w-full h-12 bg-white border border-zinc-200 rounded-xl px-4 text-sm font-medium focus:outline-none focus:border-zinc-300 transition-all" />
                                                <input type="password" placeholder="Nova Senha" className="w-full h-12 bg-white border border-zinc-200 rounded-xl px-4 text-sm font-medium focus:outline-none focus:border-zinc-300 transition-all" />
                                            </div>
                                            <Button variant="outline" className="h-10 rounded-xl px-6 text-[10px] font-black tracking-widest uppercase border-zinc-200">Atualizar</Button>
                                        </div>

                                        <div className="flex items-center justify-between p-8 rounded-[2rem] bg-zinc-50 border border-zinc-100">
                                            <div className="flex items-center gap-6">
                                                <div className={`w-12 h-12 rounded-xl bg-white border border-zinc-100 flex items-center justify-center shadow-sm transition-colors ${settings.security.twoFactor ? "text-emerald-500" : "text-zinc-300"}`}>
                                                    <Check size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-zinc-900">Autenticação em Dois Fatores</p>
                                                    <p className="text-xs text-zinc-400 font-medium">Camada extra de segurança para sua conta.</p>
                                                </div>
                                            </div>
                                            <Button
                                                onClick={() => toggle('security', 'twoFactor')}
                                                className={`h-10 rounded-xl px-6 text-[10px] font-black tracking-widest uppercase transition-all ${settings.security.twoFactor ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" : "bg-primary text-primary-foreground hover:opacity-90"}`}
                                            >
                                                {settings.security.twoFactor ? "Desativar" : "Configurar"}
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "preferences" && (
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Idioma do Sistema</label>
                                            <select
                                                value={settings.preferences.language}
                                                onChange={(e) => setSettings({ ...settings, preferences: { ...settings.preferences, language: e.target.value } })}
                                                className="w-full h-14 bg-zinc-50 border border-zinc-100 rounded-2xl px-6 text-sm font-medium focus:outline-none focus:border-zinc-300 transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="pt-BR">Português (Brasil)</option>
                                                <option value="en-US">English (US)</option>
                                                <option value="es">Español</option>
                                            </select>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Fuso Horário</label>
                                            <select
                                                value={settings.preferences.timezone}
                                                onChange={(e) => setSettings({ ...settings, preferences: { ...settings.preferences, timezone: e.target.value } })}
                                                className="w-full h-14 bg-zinc-50 border border-zinc-100 rounded-2xl px-6 text-sm font-medium focus:outline-none focus:border-zinc-300 transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="GMT-3">(GMT-03:00) São Paulo</option>
                                                <option value="GMT-5">(GMT-05:00) New York</option>
                                            </select>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "styling" && (
                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <h5 className="font-bold text-zinc-900">Tema do Sistema</h5>
                                            <p className="text-sm text-zinc-500">Escolha a cor de destaque que melhor combina com a identidade do seu restaurante.</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            {themes.map((t) => (
                                                <button
                                                    key={t.id}
                                                    onClick={() => setTheme(t.id)}
                                                    className={`group relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${theme === t.id
                                                        ? "bg-zinc-50 border-primary ring-1 ring-primary"
                                                        : "bg-white border-zinc-100 hover:border-zinc-300 hover:shadow-sm"
                                                        }`}
                                                >
                                                    <div className={`w-12 h-12 rounded-xl shrink-0 ${t.color} shadow-sm group-hover:scale-110 transition-transform duration-300`} />
                                                    <div className="text-left">
                                                        <p className={`text-xs font-bold transition-colors ${theme === t.id ? "text-primary" : "text-zinc-900"}`}>{t.name}</p>
                                                        {theme === t.id && <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mt-1">Ativo</p>}
                                                    </div>
                                                    {theme === t.id && (
                                                        <div className="absolute top-4 right-4 text-primary">
                                                            <Check size={16} />
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-10 bg-zinc-50/50 border-t border-zinc-100 flex items-center justify-end gap-4">
                                <Button variant="ghost" onClick={onClose} className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] text-zinc-400 hover:text-zinc-600">Descartar</Button>
                                <Button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="h-14 px-10 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-[10px] gap-3 shadow-lg shadow-primary/10 hover:opacity-90 transition-all min-w-[200px]"
                                >
                                    {isSaving ? (
                                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <Save size={18} />
                                    )}
                                    {isSaving ? "Salvando..." : "Salvar Alterações"}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
