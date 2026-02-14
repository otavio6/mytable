"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { seedRestaurantData, migrateRestaurantData } from "@/lib/seed-data"

interface Restaurant {
    id: number
    name: string
    location: string
    tables: number
    status: string
    cuisine: string
    image: string
}

interface RestaurantContextType {
    restaurants: Restaurant[]
    setRestaurants: (restaurants: Restaurant[]) => void
    selectedId: number | "all"
    setSelectedId: (id: number | "all") => void
    selectedRestaurant: Restaurant | null
    /** Get the localStorage key scoped to the selected restaurant */
    getKey: (base: string) => string
    /** Get all keys for a base (for "all" mode aggregation) */
    getAllKeys: (base: string) => string[]
}

const RestaurantContext = createContext<RestaurantContextType | null>(null)

const DEFAULT_RESTAURANTS: Restaurant[] = [
    { id: 1, name: "La Brasserie Paulista", location: "São Paulo, SP", tables: 24, status: "Active", cuisine: "Francesa", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800" },
    { id: 2, name: "Sushi Garden Jardins", location: "São Paulo, SP", tables: 18, status: "Active", cuisine: "Japonesa", image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=800" },
    { id: 3, name: "Burger House Central", location: "Curitiba, PR", tables: 12, status: "Inactive", cuisine: "Americana", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800" },
]

function migrateGlobalToScoped(restaurants: Restaurant[]) {
    const firstId = restaurants[0]?.id
    if (!firstId) return

    // Migrate orders
    const globalOrders = localStorage.getItem("tt_v2_orders")
    if (globalOrders && !localStorage.getItem(`tt_v2_orders_${firstId}`)) {
        localStorage.setItem(`tt_v2_orders_${firstId}`, globalOrders)
        localStorage.removeItem("tt_v2_orders")
    }

    // Migrate menu items
    const globalMenu = localStorage.getItem("tt_v2_menu_items")
    if (globalMenu && !localStorage.getItem(`tt_v2_menu_items_${firstId}`)) {
        localStorage.setItem(`tt_v2_menu_items_${firstId}`, globalMenu)
        localStorage.removeItem("tt_v2_menu_items")
    }

    // Migrate categories
    const globalCats = localStorage.getItem("tt_v2_categories")
    if (globalCats && !localStorage.getItem(`tt_v2_categories_${firstId}`)) {
        localStorage.setItem(`tt_v2_categories_${firstId}`, globalCats)
        localStorage.removeItem("tt_v2_categories")
    }

    localStorage.setItem("tt_v2_migrated", "true")
}

export function RestaurantProvider({ children }: { children: ReactNode }) {
    const [restaurants, setRestaurantsState] = useState<Restaurant[]>([])
    const [selectedId, setSelectedId] = useState<number | "all">("all")
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        const saved = localStorage.getItem("tt_v2_restaurants")
        let parsed: Restaurant[]
        if (saved) {
            parsed = JSON.parse(saved)
        } else {
            parsed = DEFAULT_RESTAURANTS
            localStorage.setItem("tt_v2_restaurants", JSON.stringify(parsed))
        }
        setRestaurantsState(parsed)

        // Run migration if needed
        if (!localStorage.getItem("tt_v2_migrated")) {
            migrateGlobalToScoped(parsed)
        }

        // Seed data for all restaurants (idempotent)
        parsed.forEach(r => {
            seedRestaurantData(r.id, r.cuisine)
            migrateRestaurantData(r.id, r.cuisine)
        })

        // Restore selected restaurant
        const savedSelected = localStorage.getItem("tt_v2_selected_restaurant")
        if (savedSelected === "all") {
            setSelectedId("all")
        } else if (savedSelected) {
            const id = parseInt(savedSelected)
            if (parsed.some(r => r.id === id)) {
                setSelectedId(id)
            }
        }

        setLoaded(true)
    }, [])

    useEffect(() => {
        if (loaded) {
            localStorage.setItem("tt_v2_restaurants", JSON.stringify(restaurants))
        }
    }, [restaurants, loaded])

    useEffect(() => {
        if (loaded) {
            localStorage.setItem("tt_v2_selected_restaurant", String(selectedId))
        }
    }, [selectedId, loaded])

    const setRestaurants = (newList: Restaurant[]) => {
        setRestaurantsState(newList)
    }

    const selectedRestaurant = typeof selectedId === "number"
        ? restaurants.find(r => r.id === selectedId) || null
        : null

    const getKey = (base: string): string => {
        if (selectedId === "all") {
            // For "all" mode, we use the first restaurant as fallback for writes
            return restaurants[0] ? `${base}_${restaurants[0].id}` : base
        }
        return `${base}_${selectedId}`
    }

    const getAllKeys = (base: string): string[] => {
        return restaurants.map(r => `${base}_${r.id}`)
    }

    if (!loaded) return null

    return (
        <RestaurantContext.Provider value={{
            restaurants,
            setRestaurants,
            selectedId,
            setSelectedId,
            selectedRestaurant,
            getKey,
            getAllKeys,
        }}>
            {children}
        </RestaurantContext.Provider>
    )
}

export function useRestaurant() {
    const ctx = useContext(RestaurantContext)
    if (!ctx) throw new Error("useRestaurant must be used within RestaurantProvider")
    return ctx
}
