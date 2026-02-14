"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Plus,
    Search,
    Filter,
    Edit3,
    Trash2,
    Eye,
    EyeOff,
    ChevronRight,
    UtensilsCrossed,
    Undo2,
    CheckCircle2,
    SortAsc,
    SortDesc,
    Check
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { NewCategoryModal } from "@/components/dashboard/new-category-modal"
import { NewItemModal } from "@/components/dashboard/new-item-modal"
import { ConfigItemModal } from "@/components/dashboard/config-item-modal"
import Image from "next/image"
import { useRestaurant } from "@/contexts/restaurant-context"

export default function MenuPage() {
    const [activeCategory, setActiveCategory] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
    const [isItemModalOpen, setIsItemModalOpen] = useState(false)
    const [isConfigModalOpen, setIsConfigModalOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState<any>(null)
    const [showUndoToast, setShowUndoToast] = useState(false)
    const [lastDeletedItem, setLastDeletedItem] = useState<any>(null)
    const [undoTimer, setUndoTimer] = useState(0)
    const [showFilterMenu, setShowFilterMenu] = useState(false)
    const [activeFilter, setActiveFilter] = useState<string | null>(null)
    const filterRef = useRef<HTMLDivElement>(null)
    const { selectedId, selectedRestaurant, getKey, getAllKeys } = useRestaurant()

    const defaultCategories = [
        { id: "all", name: "Todos" },
        { id: "appetizers", name: "Entradas" },
        { id: "main", name: "Pratos Principais" },
        { id: "drinks", name: "Bebidas" },
        { id: "desserts", name: "Sobremesas" },
    ]

    const [categories, setCategories] = useState(defaultCategories)
    const [menuItems, setMenuItems] = useState<any[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    // Map of broken image URLs to working replacements
    const imageFixMap: Record<string, string> = {
        "photo-1558030006-45ef61514328": "photo-1600891964092-4316c288032e",
        "photo-1596701062351-8c2c14d1f948": "photo-1543339308-43e59d6b73a6",
    }

    const fixBrokenImages = (items: any[]) => {
        let changed = false
        const fixed = items.map(item => {
            if (!item.image || item.image.startsWith('data:')) return item
            for (const [broken, working] of Object.entries(imageFixMap)) {
                if (item.image.includes(broken)) {
                    changed = true
                    return { ...item, image: item.image.replace(broken, working) }
                }
            }
            return item
        })
        return { items: fixed, changed }
    }

    useEffect(() => {
        if (selectedId === "all") {
            // Aggregate from all restaurants
            const allItems: any[] = []
            const allCats = [...defaultCategories]
            getAllKeys("tt_v2_menu_items").forEach(key => {
                const saved = localStorage.getItem(key)
                if (saved) allItems.push(...JSON.parse(saved))
            })
            getAllKeys("tt_v2_categories").forEach(key => {
                const saved = localStorage.getItem(key)
                if (saved) {
                    JSON.parse(saved).forEach((c: any) => {
                        if (!allCats.some(ec => ec.id === c.id)) allCats.push(c)
                    })
                }
            })
            const { items: fixed } = fixBrokenImages(allItems.length > 0 ? allItems : [])
            setMenuItems(fixed)
            setCategories(allCats)
        } else {
            const menuKey = getKey("tt_v2_menu_items")
            const savedItems = localStorage.getItem(menuKey)
            if (savedItems) {
                const parsed = JSON.parse(savedItems)
                const { items: fixed, changed } = fixBrokenImages(parsed)
                setMenuItems(fixed)
                if (changed) localStorage.setItem(menuKey, JSON.stringify(fixed))
            } else {
                const initialItems = [
                    { id: 1, name: "Bruschetta Italiana", category: "appetizers", price: "R$ 32,00", available: true, orders: 145, image: "https://images.unsplash.com/photo-1572656631137-7935297eff55?auto=format&fit=crop&q=80&w=400" },
                    { id: 2, name: "Filé Mignon ao Poivre", category: "main", price: "R$ 89,00", available: true, orders: 890, image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=400" },
                    { id: 3, name: "Negroni Premium", category: "drinks", price: "R$ 42,00", available: true, orders: 230, image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=400" },
                    { id: 4, name: "Tiramisu Clássico", category: "desserts", price: "R$ 28,00", available: false, orders: 412, image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&q=80&w=400" },
                    { id: 5, name: "Burrata Fresca", category: "appetizers", price: "R$ 54,00", available: true, orders: 320, image: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&q=80&w=400" },
                    { id: 6, name: "Risoto de Cogumelos", category: "main", price: "R$ 72,00", available: true, orders: 560, image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&q=80&w=400" },
                ]
                setMenuItems(initialItems)
                localStorage.setItem(menuKey, JSON.stringify(initialItems))
            }

            const catKey = getKey("tt_v2_categories")
            const savedCategories = localStorage.getItem(catKey)
            if (savedCategories) {
                setCategories(JSON.parse(savedCategories))
            } else {
                setCategories(defaultCategories)
            }
        }
        setIsLoaded(true)
    }, [selectedId])

    useEffect(() => {
        if (isLoaded && selectedId !== "all") {
            localStorage.setItem(getKey("tt_v2_menu_items"), JSON.stringify(menuItems))
        }
    }, [menuItems, isLoaded])

    useEffect(() => {
        if (isLoaded && selectedId !== "all" && categories !== defaultCategories) {
            localStorage.setItem(getKey("tt_v2_categories"), JSON.stringify(categories))
        }
    }, [categories, isLoaded])

    // Close filter menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
                setShowFilterMenu(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const toggleAvailability = (id: number) => {
        setMenuItems(menuItems.map(item => item.id === id ? { ...item, available: !item.available } : item))
    }

    const deleteItem = (id: number) => {
        const itemToDelete = menuItems.find(item => item.id === id)
        if (itemToDelete) {
            setLastDeletedItem(itemToDelete)
            setMenuItems(menuItems.filter(item => item.id !== id))
            setShowUndoToast(true)
            setUndoTimer(6)
        }
    }

    const undoDelete = () => {
        if (lastDeletedItem) {
            setMenuItems([...menuItems, lastDeletedItem])
            setLastDeletedItem(null)
            setShowUndoToast(false)
        }
    }

    useEffect(() => {
        let interval: NodeJS.Timeout
        if (showUndoToast && undoTimer > 0) {
            interval = setInterval(() => {
                setUndoTimer(prev => prev - 1)
            }, 1000)
        } else if (undoTimer === 0 && showUndoToast) {
            setShowUndoToast(false)
            setLastDeletedItem(null)
        }
        return () => clearInterval(interval)
    }, [showUndoToast, undoTimer])

    const handleConfigure = (item: any) => {
        setSelectedItem(item)
        setIsConfigModalOpen(true)
    }

    const handleSaveItem = (updatedItem: any) => {
        setMenuItems(menuItems.map(item => item.id === updatedItem.id ? updatedItem : item))
    }

    const handleAddItem = (newItem: any) => {
        const item = {
            ...newItem,
            id: Date.now(),
        }
        setMenuItems([...menuItems, item])
    }

    const handleAddCategory = (newCat: { id: string; name: string; order: number }) => {
        const updated = [...categories, { id: newCat.id, name: newCat.name }]
        setCategories(updated)
        if (selectedId !== "all") {
            localStorage.setItem(getKey("tt_v2_categories"), JSON.stringify(updated))
        }
    }

    const applyFilter = (filterId: string) => {
        setActiveFilter(activeFilter === filterId ? null : filterId)
        setShowFilterMenu(false)
    }

    const filteredItems = menuItems
        .filter(item => {
            const matchesCategory = activeCategory === "all" || item.category === activeCategory
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesFilter =
                !activeFilter ? true :
                    activeFilter === "available" ? item.available :
                        activeFilter === "unavailable" ? !item.available :
                            true
            return matchesCategory && matchesSearch && matchesFilter
        })
        .sort((a, b) => {
            if (activeFilter === "most-orders") return b.orders - a.orders
            if (activeFilter === "price-asc") {
                const pa = parseFloat(a.price.replace(/[^\d,]/g, '').replace(',', '.'))
                const pb = parseFloat(b.price.replace(/[^\d,]/g, '').replace(',', '.'))
                return pa - pb
            }
            if (activeFilter === "price-desc") {
                const pa = parseFloat(a.price.replace(/[^\d,]/g, '').replace(',', '.'))
                const pb = parseFloat(b.price.replace(/[^\d,]/g, '').replace(',', '.'))
                return pb - pa
            }
            return 0
        })

    const filterOptions = [
        { id: "available", label: "Disponíveis", icon: Eye },
        { id: "unavailable", label: "Indisponíveis", icon: EyeOff },
        { id: "most-orders", label: "Mais Pedidos", icon: SortDesc },
        { id: "price-asc", label: "Preço Menor", icon: SortAsc },
        { id: "price-desc", label: "Preço Maior", icon: SortDesc },
    ]

    return (
        <div className="space-y-12 pb-20 relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-bold tracking-tight text-zinc-900 italic">Gestão de Cardápio</h2>
                    <p className="text-zinc-500 mt-2 font-medium">
                        {selectedId === "all"
                            ? "Visualização consolidada de todos os cardápios."
                            : `Cardápio — ${selectedRestaurant?.name || ""}`}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        onClick={() => setIsCategoryModalOpen(true)}
                        className="h-14 truncate px-6 rounded-2xl font-black uppercase tracking-widest text-[10px] gap-3 border-zinc-200 text-zinc-500 hover:text-zinc-900"
                    >
                        <Plus size={16} />
                        Nova Categoria
                    </Button>
                    <Button
                        id="tour-add-product"
                        onClick={() => setIsItemModalOpen(true)}
                        className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] gap-3 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/10"
                    >
                        <Plus size={16} />
                        Novo Item
                    </Button>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col lg:flex-row gap-10">
                <div className="flex-1 flex items-center gap-6 bg-white border border-zinc-200 rounded-2xl h-16 px-6 group transition-all duration-300 focus-within:border-zinc-400">
                    <Search size={20} className="text-zinc-300 group-focus-within:text-zinc-900 transition-colors" />
                    <input
                        type="text"
                        placeholder="Buscar no cardápio..."
                        className="flex-1 bg-transparent border-none outline-none text-sm font-medium placeholder:text-zinc-300 text-zinc-900"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="relative" ref={filterRef}>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowFilterMenu(!showFilterMenu)}
                            className={`w-10 h-10 rounded-xl hover:bg-zinc-50 border transition-all ${activeFilter ? 'border-primary bg-primary/5 text-primary' : 'border-transparent hover:border-zinc-100 text-zinc-400'}`}
                        >
                            <Filter size={16} />
                        </Button>
                        <AnimatePresence>
                            {showFilterMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                    className="absolute top-12 right-0 bg-white border border-zinc-100 shadow-xl rounded-2xl p-2 min-w-[220px] z-50"
                                >
                                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-300 px-4 py-2">Filtrar por</p>
                                    {filterOptions.map(opt => (
                                        <button
                                            key={opt.id}
                                            onClick={() => applyFilter(opt.id)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeFilter === opt.id ? 'bg-primary text-primary-foreground' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'}`}
                                        >
                                            <opt.icon size={14} />
                                            {opt.label}
                                            {activeFilter === opt.id && <Check size={12} className="ml-auto" />}
                                        </button>
                                    ))}
                                    {activeFilter && (
                                        <button
                                            onClick={() => { setActiveFilter(null); setShowFilterMenu(false) }}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl text-red-500 hover:bg-red-50 transition-all mt-1 border-t border-zinc-50"
                                        >
                                            Limpar Filtro
                                        </button>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="flex items-center gap-4 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-8 py-4 rounded-2xl h-14 text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-300 border ${activeCategory === cat.id
                                ? "bg-primary text-primary-foreground border-primary shadow-md"
                                : "bg-white text-zinc-400 border-zinc-100 hover:border-zinc-200 hover:text-zinc-600"
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                <AnimatePresence mode="popLayout">
                    {filteredItems.map((item, i) => (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.4, delay: i * 0.05 }}
                            className={`group rounded-[2.5rem] bg-white border border-zinc-200 shadow-sm overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ${!item.available && 'opacity-60 grayscale-[0.8]'}`}
                        >
                            {/* Image Header */}
                            <div className="relative h-48 w-full overflow-hidden">
                                {item.image?.startsWith('data:') ? (
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                <div className="absolute top-6 right-6 flex items-center gap-3">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => toggleAvailability(item.id)}
                                        className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white hover:text-zinc-900 transition-all border-none"
                                    >
                                        {item.available ? <Eye size={16} /> : <EyeOff size={16} />}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => deleteItem(item.id)}
                                        className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-red-500 hover:text-white transition-all border-none"
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                                <div className="absolute bottom-6 left-8">
                                    <span className="bg-white/90 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest uppercase text-zinc-900 shadow-lg">
                                        {item.price}
                                    </span>
                                </div>
                            </div>

                            <div className="p-8 pb-10">
                                <div className="space-y-3 mb-8">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-bold text-xl text-zinc-900">{item.name}</h3>
                                        {!item.available && <span className="text-[9px] font-bold uppercase text-red-500 tracking-[0.2em] bg-red-50 px-3 py-1.5 rounded-full border border-red-100">Indisponível</span>}
                                    </div>
                                    <p className="text-xs font-medium text-zinc-500 leading-relaxed uppercase tracking-wide">
                                        {categories.find(c => c.id === item.category)?.name || item.category === 'appetizers' ? 'Entrada' : item.category === 'main' ? 'Prato Principal' : item.category === 'drinks' ? 'Bebida' : 'Sobremesa'}
                                    </p>
                                    <p className="text-sm font-medium text-zinc-400 leading-relaxed line-clamp-2">Alta gastronomia preparada com insumos orgânicos e técnica clássica.</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                                        <p className="text-[9px] text-zinc-400 uppercase font-black tracking-[0.2em] mb-1">Pedidos</p>
                                        <p className="font-bold text-base text-zinc-900 tabular-nums tracking-tight">{item.orders}</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                                        <p className="text-[9px] text-zinc-400 uppercase font-black tracking-[0.2em] mb-1">Popularidade</p>
                                        <p className="font-bold text-base text-emerald-600 tracking-tight">
                                            {item.orders > 500 ? "Altíssima" : item.orders > 200 ? "Alta" : item.orders > 50 ? "Média" : "Nova"}
                                        </p>
                                    </div>
                                </div>

                                <motion.div
                                    onClick={() => handleConfigure(item)}
                                    className="mt-8 pt-6 border-t border-zinc-50 flex items-center justify-between text-zinc-300 group-hover:text-slate-900 font-black text-[10px] uppercase tracking-[0.3em] cursor-pointer transition-colors"
                                >
                                    Configurar Item
                                    <ChevronRight size={16} />
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Add Item Placeholder */}
                <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: "#f9fafb" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsItemModalOpen(true)}
                    className="rounded-[2.5rem] bg-white border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center gap-6 text-zinc-300 hover:text-zinc-600 hover:border-zinc-300 transition-all duration-500 min-h-[450px] group"
                >
                    <div className="w-16 h-16 rounded-[1.5rem] bg-zinc-50 border border-zinc-100 flex items-center justify-center group-hover:bg-white group-hover:scale-110 group-hover:shadow-md transition-all">
                        <Plus size={24} />
                    </div>
                    <div className="text-center">
                        <span className="font-black uppercase tracking-[0.4em] text-xs block mb-2">Novo Item</span>
                        <span className="text-[10px] font-medium text-zinc-400">Expandir seu cardápio</span>
                    </div>
                </motion.button>
            </div>

            {/* Undo Toast */}
            <AnimatePresence>
                {showUndoToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-6 bg-zinc-900 text-white px-8 py-4 rounded-3xl shadow-2xl border border-white/10"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400">
                                <CheckCircle2 size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold">Item excluído com sucesso</p>
                                <p className="text-[10px] text-zinc-400 font-medium">Excluindo permanentemente em {undoTimer}s...</p>
                            </div>
                        </div>
                        <div className="w-px h-10 bg-white/10" />
                        <Button
                            variant="ghost"
                            onClick={undoDelete}
                            className="h-10 px-6 rounded-xl gap-2 text-white hover:bg-white/10 font-black uppercase text-[10px] tracking-widest"
                        >
                            <Undo2 size={14} />
                            Desfazer
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            <NewCategoryModal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} onAdd={handleAddCategory} />
            <NewItemModal isOpen={isItemModalOpen} onClose={() => setIsItemModalOpen(false)} onAdd={handleAddItem} categories={categories} />
            <ConfigItemModal
                isOpen={isConfigModalOpen}
                onClose={() => setIsConfigModalOpen(false)}
                item={selectedItem}
                onSave={handleSaveItem}
                onDelete={deleteItem}
            />
        </div>
    )
}
