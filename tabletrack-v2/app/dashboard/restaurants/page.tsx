"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, MoreVertical, MapPin, Store, ChevronRight, Trash2, ImageIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NewRestaurantModal } from "@/components/dashboard/new-restaurant-modal"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function RestaurantsPage() {
    const [restaurants, setRestaurants] = useState<any[]>([])
    const [isLoaded, setIsLoaded] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [photoModalId, setPhotoModalId] = useState<number | null>(null)
    const photoInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    useEffect(() => {
        const saved = localStorage.getItem("tt_v2_restaurants")
        if (saved) {
            setRestaurants(JSON.parse(saved))
        } else {
            const initial = [
                { id: 1, name: "La Brasserie Paulista", location: "São Paulo, SP", tables: 24, status: "Active", cuisine: "Francesa", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800" },
                { id: 2, name: "Sushi Garden Jardins", location: "São Paulo, SP", tables: 18, status: "Active", cuisine: "Japonesa", image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=800" },
                { id: 3, name: "Burger House Central", location: "Curitiba, PR", tables: 12, status: "Inactive", cuisine: "Americana", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800" },
            ]
            setRestaurants(initial)
            localStorage.setItem("tt_v2_restaurants", JSON.stringify(initial))
        }
        setIsLoaded(true)
    }, [])

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("tt_v2_restaurants", JSON.stringify(restaurants))
        }
    }, [restaurants, isLoaded])

    const handleDelete = (id: number) => {
        setRestaurants(restaurants.filter(r => r.id !== id))
    }

    const handleAddRestaurant = (newRes: any) => {
        const restaurant = {
            ...newRes,
            id: Date.now(),
            status: "Active",
            tables: newRes.tables || 10,
            image: newRes.image || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800"
        }
        setRestaurants([...restaurants, restaurant])
        setIsModalOpen(false)
    }

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file && photoModalId !== null) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setRestaurants(restaurants.map(r =>
                    r.id === photoModalId ? { ...r, image: reader.result as string } : r
                ))
                setPhotoModalId(null)
            }
            reader.readAsDataURL(file)
        }
    }

    const renderImage = (res: any) => {
        if (res.image?.startsWith('data:')) {
            return (
                <img
                    src={res.image}
                    alt={res.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
            )
        }
        return (
            <Image
                src={res.image}
                alt={res.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
        )
    }

    return (
        <div className="space-y-12 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-bold tracking-tight text-zinc-900 italic">Meus Restaurantes</h2>
                    <p className="text-zinc-500 mt-2 font-medium">Gerencie suas unidades e localizações estratégicas.</p>
                </div>
                <Button
                    onClick={() => setIsModalOpen(true)}
                    className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] gap-3 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/10"
                >
                    <Plus size={18} />
                    Adicionar Unidade
                </Button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {restaurants.map((res, i) => (
                    <motion.div
                        key={res.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.1 }}
                        className="group relative rounded-[2.5rem] bg-white border border-zinc-200 shadow-sm overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
                    >
                        {/* Status Badge */}
                        <div className="absolute top-6 left-8 z-20">
                            <div className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 ${res.status === 'Active'
                                ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                                : 'bg-zinc-50 border-zinc-100 text-zinc-400'
                                }`}>
                                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${res.status === 'Active' ? 'bg-emerald-500' : 'bg-zinc-300'}`} />
                                <span className="text-[9px] font-black uppercase tracking-widest">{res.status === 'Active' ? 'Ativa' : 'Inativa'}</span>
                            </div>
                        </div>

                        {/* Visual Header */}
                        <div className="h-48 bg-zinc-50 border-b border-zinc-100 relative flex items-center justify-center overflow-hidden">
                            {renderImage(res)}
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                            <div className="absolute top-6 right-8">
                                <div className="relative group/menu">
                                    <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/40">
                                        <MoreVertical size={16} />
                                    </Button>
                                    <div className="absolute top-0 right-10 opacity-0 group-hover/menu:opacity-100 pointer-events-none group-hover/menu:pointer-events-auto transition-all pr-2">
                                        <div className="bg-white border border-zinc-100 shadow-xl rounded-2xl p-2 min-w-[160px]">
                                            <button
                                                onClick={() => {
                                                    setPhotoModalId(res.id)
                                                    setTimeout(() => photoInputRef.current?.click(), 100)
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:bg-zinc-50 rounded-xl transition-all"
                                            >
                                                <ImageIcon size={14} />
                                                Mudar Foto
                                            </button>
                                            <button
                                                onClick={() => handleDelete(res.id)}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                            >
                                                <Trash2 size={14} />
                                                Excluir
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 pb-10">
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-zinc-900 group-hover:text-slate-900 transition-colors">{res.name}</h3>
                                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-zinc-400 mt-2">
                                    <MapPin size={14} className="text-zinc-200" />
                                    {res.location}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                                    <p className="text-[9px] text-zinc-400 uppercase font-black tracking-[0.2em] mb-1">Capacidade</p>
                                    <p className="font-bold text-base text-zinc-900 tabular-nums tracking-tight">{res.tables} Mesas</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                                    <p className="text-[9px] text-zinc-400 uppercase font-black tracking-[0.2em] mb-1">Cozinha</p>
                                    <p className="font-bold text-base text-zinc-900 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">{res.cuisine}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Link href="/dashboard" className="w-full">
                                    <Button variant="outline" className="w-full h-12 rounded-xl text-[10px] font-black uppercase tracking-widest border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:border-zinc-300">
                                        Painel
                                    </Button>
                                </Link>
                                <Link href="/dashboard/menu" className="w-full">
                                    <Button className="w-full h-12 rounded-xl text-[10px] font-black uppercase tracking-widest bg-zinc-50 text-zinc-400 hover:bg-primary hover:text-primary-foreground transition-all border border-transparent">
                                        Cardápio
                                    </Button>
                                </Link>
                            </div>

                            <div
                                onClick={() => router.push("/dashboard/orders")}
                                className="mt-8 pt-6 border-t border-zinc-50 flex items-center justify-between text-zinc-200 group-hover:text-zinc-900 transition-colors cursor-pointer"
                            >
                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Gerenciar Unidade</span>
                                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Hidden file input for photo change */}
            <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
            />

            <NewRestaurantModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddRestaurant}
            />
        </div>
    )
}
