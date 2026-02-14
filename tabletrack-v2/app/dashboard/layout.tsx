"use client"

import { useEffect, useState, useRef } from "react"
import { supabase } from "@/lib/supabase/client"
import { useRouter, usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
    LayoutDashboard,
    Utensils,
    Settings,
    LogOut,
    Menu,
    ChevronLeft,
    Bell,
    User,
    ShoppingBag,
    ChevronDown,
    Store,
    Check
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SettingsModal } from "@/components/dashboard/settings-modal"
import { RestaurantProvider, useRestaurant } from "@/contexts/restaurant-context"
import { ThemeProvider } from "@/contexts/theme-context"
import { OnboardingTour } from "@/components/dashboard/onboarding-tour"

function DashboardContent({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true)
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const [settingsSection, setSettingsSection] = useState("profile")
    const [selectorOpen, setSelectorOpen] = useState(false)
    const selectorRef = useRef<HTMLDivElement>(null)
    const router = useRouter()
    const pathname = usePathname()
    const { restaurants, selectedId, setSelectedId, selectedRestaurant } = useRestaurant()

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession()
                if (error || !session) {
                    router.push("/login")
                } else {
                    setLoading(false)
                }
            } catch (err) {
                setLoading(false)
            }
        }

        const timeout = setTimeout(() => {
            if (loading) setLoading(false)
        }, 3000)

        checkAuth()
        return () => clearTimeout(timeout)
    }, [router])

    // Close selector on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (selectorRef.current && !selectorRef.current.contains(e.target as Node)) {
                setSelectorOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClick)
        return () => document.removeEventListener("mousedown", handleClick)
    }, [])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push("/login")
    }

    if (loading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-background">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
                />
            </div>
        )
    }

    const selectorLabel = selectedId === "all"
        ? "Todos Restaurantes"
        : selectedRestaurant?.name || "Selecionar"

    const selectorCuisine = selectedId === "all"
        ? `${restaurants.length} unidades`
        : selectedRestaurant?.cuisine || ""

    return (
        <div className="flex h-screen bg-zinc-50 overflow-hidden p-6 md:p-8 gap-6 md:gap-8 relative">
            {/* Sidebar */}
            <motion.aside
                id="tour-sidebar"
                initial={false}
                animate={{ width: sidebarOpen ? 280 : 100 }}
                onMouseEnter={() => setSidebarOpen(true)}
                onMouseLeave={() => setSidebarOpen(false)}
                className="h-full bg-white rounded-[2.5rem] flex flex-col z-20 overflow-hidden border border-zinc-200 shadow-sm transition-all duration-500 ease-in-out"
            >
                <div className={`h-24 flex items-center shrink-0 border-b border-zinc-50 transition-all duration-500 ${sidebarOpen ? 'px-8' : 'px-0 justify-center'}`}>
                    <motion.div
                        layout
                        className="flex items-center gap-3"
                    >
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
                            <img src="/mytable-logo.png" alt="Logo" className="w-full h-full object-contain" />
                        </div>
                        <AnimatePresence>
                            {sidebarOpen && (
                                <motion.span
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: "auto" }}
                                    exit={{ opacity: 0, width: 0 }}
                                    className="font-bold text-xl tracking-tighter text-zinc-900 whitespace-nowrap italic"
                                >
                                    My<span className="text-zinc-400 not-italic">Table</span>
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>

                <nav className={`flex-1 py-6 space-y-2 overflow-y-auto scrollbar-hide transition-all duration-500 ${sidebarOpen ? 'px-6' : 'px-0'}`}>
                    {[
                        { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
                        { icon: ShoppingBag, label: "Pedidos", href: "/dashboard/orders" },
                        { icon: Menu, label: "Cardápio", href: "/dashboard/menu" },
                        { icon: Utensils, label: "Restaurantes", href: "/dashboard/restaurants" },
                        { icon: Settings, label: "Configurações", href: "/dashboard/settings" },
                    ].map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link key={item.label} href={item.href}>
                                <motion.div
                                    id={`tour-nav-${item.label.toLowerCase()}`}
                                    className={`group flex items-center rounded-2xl transition-all duration-500 cursor-pointer overflow-hidden border border-transparent relative ${sidebarOpen ? 'gap-4 px-4 py-3.5' : 'justify-center p-3.5'}`}
                                >
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 relative">
                                        {isActive && (
                                            <motion.div
                                                layoutId="active-ink"
                                                className="absolute inset-0 bg-primary rounded-xl"
                                                transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                                            />
                                        )}
                                        <item.icon
                                            size={18}
                                            className={`shrink-0 relative z-10 transition-colors duration-500 ${isActive ? 'text-primary-foreground' : 'text-zinc-400 group-hover:text-zinc-900'}`}
                                        />
                                    </div>
                                    <motion.span
                                        animate={{
                                            opacity: sidebarOpen ? 1 : 0,
                                            x: sidebarOpen ? 0 : -10,
                                            width: sidebarOpen ? "auto" : 0
                                        }}
                                        transition={{ duration: 0.3 }}
                                        className={`text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap relative z-10 transition-colors duration-500 ${isActive ? 'text-zinc-900' : 'text-zinc-400 group-hover:text-zinc-900'}`}
                                    >
                                        {item.label}
                                    </motion.span>
                                </motion.div>
                            </Link>
                        )
                    })}
                </nav>

                <div className={`h-24 flex items-center overflow-hidden border-t border-zinc-50 transition-all duration-500 ${sidebarOpen ? 'px-6' : 'px-0'}`}>
                    <Button
                        variant="ghost"
                        className={`w-full h-14 rounded-2xl hover:bg-zinc-50 text-zinc-400 hover:text-red-600 transition-all ${sidebarOpen ? 'justify-start gap-4 px-4' : 'justify-center'}`}
                        onClick={handleSignOut}
                    >
                        <LogOut size={18} className="shrink-0" />
                        <motion.span
                            animate={{ opacity: sidebarOpen ? 1 : 0, width: sidebarOpen ? "auto" : 0 }}
                            className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap"
                        >
                            Sair da Conta
                        </motion.span>
                    </Button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden gap-6 md:gap-8">
                {/* Topbar */}
                <header className="h-24 bg-white rounded-[2.5rem] flex items-center justify-between px-10 shrink-0 border border-zinc-200 shadow-sm">
                    {/* Restaurant Selector */}
                    <div ref={selectorRef} className="relative" id="tour-selector">
                        <button
                            onClick={() => setSelectorOpen(!selectorOpen)}
                            className="flex items-center gap-4 group py-2 px-1"
                        >
                            <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center shrink-0">
                                <Store size={16} className="text-white" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-bold text-zinc-900 group-hover:text-zinc-700 transition-colors leading-tight">
                                    {selectorLabel}
                                </p>
                                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-300 mt-0.5">
                                    {selectorCuisine}
                                </p>
                            </div>
                            <ChevronDown
                                size={14}
                                className={`text-zinc-300 transition-transform duration-200 ${selectorOpen ? 'rotate-180' : ''}`}
                            />
                        </button>

                        <AnimatePresence>
                            {selectorOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute top-full left-0 mt-3 bg-white border border-zinc-100 shadow-2xl rounded-2xl p-2 min-w-[280px] z-50"
                                >
                                    {/* All Restaurants option */}
                                    <button
                                        onClick={() => { setSelectedId("all"); setSelectorOpen(false) }}
                                        className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${selectedId === "all" ? 'bg-zinc-50' : 'hover:bg-zinc-50'}`}
                                    >
                                        <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0">
                                            <Store size={14} className="text-zinc-500" />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <p className="text-xs font-bold text-zinc-900">Todos Restaurantes</p>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-300 mt-0.5">{restaurants.length} unidades</p>
                                        </div>
                                        {selectedId === "all" && <Check size={14} className="text-primary shrink-0" />}
                                    </button>

                                    <div className="h-px bg-zinc-100 my-1.5" />

                                    {/* Individual restaurants */}
                                    {restaurants.map(r => (
                                        <button
                                            key={r.id}
                                            onClick={() => { setSelectedId(r.id); setSelectorOpen(false) }}
                                            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${selectedId === r.id ? 'bg-zinc-50' : 'hover:bg-zinc-50'}`}
                                        >
                                            <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0 overflow-hidden">
                                                {r.image?.startsWith('data:') ? (
                                                    <img src={r.image} alt="" className="w-full h-full object-cover" />
                                                ) : r.image ? (
                                                    <img src={r.image} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="font-bold text-zinc-400 text-xs">{r.name[0]}</span>
                                                )}
                                            </div>
                                            <div className="flex-1 text-left">
                                                <p className="text-xs font-bold text-zinc-900">{r.name}</p>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-300 mt-0.5">{r.cuisine}</p>
                                            </div>
                                            {selectedId === r.id && <Check size={14} className="text-primary shrink-0" />}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex items-center gap-6">
                        <Button
                            variant="outline"
                            size="icon"
                            className="w-12 h-12 rounded-2xl border-zinc-200 text-zinc-400 hover:text-zinc-900 transition-all hover:bg-zinc-50"
                            onClick={() => {
                                setSettingsSection("notifications")
                                setIsSettingsOpen(true)
                            }}
                        >
                            <Bell size={18} />
                        </Button>
                        <button
                            className="w-12 h-12 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-500 hover:bg-zinc-100 hover:border-zinc-300 transition-all active:scale-95"
                            onClick={() => {
                                setSettingsSection("profile")
                                setIsSettingsOpen(true)
                            }}
                        >
                            <User size={18} />
                        </button>
                    </div>
                </header>

                <main className="flex-1 bg-white rounded-[2.5rem] overflow-y-auto p-12 relative scrollbar-hide border border-zinc-200 shadow-sm">
                    {children}
                </main>
            </div>

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                initialSection={settingsSection}
            />
            <OnboardingTour />
        </div>
    )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <RestaurantProvider>
                <DashboardContent>{children}</DashboardContent>
            </RestaurantProvider>
        </ThemeProvider>
    )
}
