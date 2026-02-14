
export const MENU_TEMPLATES: Record<string, any[]> = {
    "Francesa": [
        // Food
        { name: "Coq au Vin", category: "main", price: "R$ 89,00", available: true, image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=400" },
        { name: "Ratatouille", category: "main", price: "R$ 65,00", available: true, image: "https://images.unsplash.com/photo-1572656631137-7935297eff55?auto=format&fit=crop&q=80&w=400" },
        { name: "Escargot", category: "appetizers", price: "R$ 120,00", available: true, image: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&q=80&w=400" },
        { name: "Crème Brûlée", category: "desserts", price: "R$ 35,00", available: true, image: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?auto=format&fit=crop&q=80&w=400" },
        // Drinks
        { name: "Vinho Bordeaux", category: "drinks", price: "R$ 150,00", available: true, image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=400" },
        { name: "Champagne", category: "drinks", price: "R$ 220,00", available: true, image: "https://images.unsplash.com/photo-1598155523122-38423bb4d6cf?auto=format&fit=crop&q=80&w=400" },
    ],
    "Japonesa": [
        // Food
        { name: "Combinado Sushi 30pc", category: "main", price: "R$ 110,00", available: true, image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=400" },
        { name: "Temaki Salmão", category: "appetizers", price: "R$ 24,00", available: true, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400" },
        { name: "Ramen Tonkotsu", category: "main", price: "R$ 55,00", available: true, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=400" },
        { name: "Mochi Sorvete", category: "desserts", price: "R$ 18,00", available: true, image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80&w=400" },
        // Drinks
        { name: "Sake Junmai", category: "drinks", price: "R$ 45,00", available: true, image: "https://images.unsplash.com/photo-1582294471242-b9e380e227a9?auto=format&fit=crop&q=80&w=400" }, // Kept but hopefully works, otherwise use tea
        { name: "Chá Verde", category: "drinks", price: "R$ 12,00", available: true, image: "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&q=80&w=400" },
    ],
    "Americana": [
        // Food
        { name: "X-Bacon Duplo", category: "main", price: "R$ 48,00", available: true, image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=80&w=400" },
        { name: "Chicken Sandwich", category: "main", price: "R$ 38,00", available: true, image: "https://images.unsplash.com/photo-1615557960638-8faddec944e2?auto=format&fit=crop&q=80&w=400" },
        { name: "Onion Rings", category: "appetizers", price: "R$ 28,00", available: true, image: "https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&q=80&w=400" },
        { name: "Milkshake Oreo", category: "desserts", price: "R$ 26,00", available: true, image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=400" },
        // Drinks
        { name: "Cola Artesanal", category: "drinks", price: "R$ 14,00", available: true, image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=400" },
        { name: "Limonada Rosa", category: "drinks", price: "R$ 16,00", available: true, image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400" },
    ]
}

const DEFAULT_CATEGORIES = [
    { id: "all", name: "Todos" },
    { id: "appetizers", name: "Entradas" },
    { id: "main", name: "Pratos Principais" },
    { id: "drinks", name: "Bebidas" },
    { id: "desserts", name: "Sobremesas" },
]

export function seedRestaurantData(restaurantId: number, cuisine: string) {
    // 1. Seed Menu Items
    const menuKey = `tt_v2_menu_items_${restaurantId}`
    if (!localStorage.getItem(menuKey)) {
        const template = MENU_TEMPLATES[cuisine] || MENU_TEMPLATES["Americana"] // Fallback
        const items = template.map((item, index) => ({
            id: index + 1,
            ...item,
            orders: Math.floor(Math.random() * 500) + 50
        }))
        localStorage.setItem(menuKey, JSON.stringify(items))
    }

    // 2. Seed Categories
    const catKey = `tt_v2_categories_${restaurantId}`
    if (!localStorage.getItem(catKey)) {
        localStorage.setItem(catKey, JSON.stringify(DEFAULT_CATEGORIES))
    }

    // 3. Seed Orders
    const ordersKey = `tt_v2_orders_${restaurantId}`
    if (!localStorage.getItem(ordersKey)) {
        const orders = generateDefaultOrders(restaurantId, cuisine)
        localStorage.setItem(ordersKey, JSON.stringify(orders))
    }
}

export function generateRandomStats(restaurantId: number) {
    // Deterministic random based on ID (simple hash)
    const seed = restaurantId * 12345
    const random = (min: number, max: number) => {
        const x = Math.sin(seed + min) * 10000
        return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min
    }

    return {
        revenue: random(15000, 45000),
        orders: random(120, 400),
        newClients: random(15, 60),
        occupancy: random(40, 95)
    }
}

export function generateDefaultOrders(restaurantId: number, cuisine: string) {
    const template = MENU_TEMPLATES[cuisine] || MENU_TEMPLATES["Americana"]
    // Pick 3 random items from template
    const getItem = (idx: number) => {
        const item = template[idx % template.length]
        return item ? `1x ${item.name}` : "1x Item Surpresa"
    }

    // Deterministic "random" logic or just hardcoded slots with current menu items
    return [
        {
            id: `ORD-${restaurantId}-101`,
            table: "04",
            items: [`2x ${template[0]?.name || "Prato"}`, `1x ${template[4]?.name || "Bebida"}`],
            price: "R$ 156,00", // Fixed price for simplicity or calculate
            time: "5 min",
            status: "pending",
            obs: ""
        },
        {
            id: `ORD-${restaurantId}-102`,
            table: "12",
            items: [`1x ${template[1]?.name || "Prato"}`],
            price: "R$ 65,00",
            time: "12 min",
            status: "preparing",
            obs: "Sem cebola"
        },
        {
            id: `ORD-${restaurantId}-103`,
            table: "08",
            items: [`3x ${template[2]?.name || "Lanche"}`],
            price: "R$ 135,00",
            time: "18 min",
            status: "ready",
            obs: ""
        },
        {
            id: `ORD-${restaurantId}-104`,
            table: "15",
            items: [`2x ${template[3]?.name || "Sobremesa"}`],
            price: "R$ 70,00",
            time: "24 min",
            status: "ready",
            obs: "Colher extra"
        }
    ]
}

export function migrateRestaurantData(restaurantId: number, cuisine: string) {
    const menuKey = `tt_v2_menu_items_${restaurantId}`
    const savedMenu = localStorage.getItem(menuKey)

    if (savedMenu) {
        const items = JSON.parse(savedMenu)
        // Detect old American menu (Costela BBC) OR missing Japanese images (Mochi Sorvete with old URL or no image)
        const hasOldAmerican = items.some((i: any) => i.name === "Costela BBC" || i.name === "Asinhas de Frango")
        const hasBrokenJapanese = items.some((i: any) => i.name === "Mochi Sorvete" && (!i.image || !i.image.includes("1563805042")))
        const hasBrokenSake = items.some((i: any) => i.name === "Sake Junmai" && (!i.image || !i.image.includes("1582294471")))

        if (hasOldAmerican || hasBrokenJapanese || hasBrokenSake) {
            // Force re-seed from new template
            const template = MENU_TEMPLATES[cuisine] || MENU_TEMPLATES["Americana"]
            const newItems = template.map((item, index) => ({
                id: index + 1,
                ...item,
                orders: Math.floor(Math.random() * 500) + 50
            }))
            localStorage.setItem(menuKey, JSON.stringify(newItems))
        }
    }

    // 2. Migrate order IDs to include restaurantId if they don't have it
    const ordersKey = `tt_v2_orders_${restaurantId}`
    const savedOrders = localStorage.getItem(ordersKey)
    if (savedOrders) {
        const orders = JSON.parse(savedOrders)
        let changed = false
        const migratedOrders = orders.map((o: any) => {
            // If ID is like ORD-101 (legacy), change to ORD-{restaurantId}-101
            if (o.id && !o.id.includes(`ORD-${restaurantId}-`)) {
                changed = true
                const numMatch = o.id.match(/ORD-(\d+)/)
                const num = numMatch ? numMatch[1] : Math.floor(Math.random() * 1000)
                return { ...o, id: `ORD-${restaurantId}-${num}` }
            }
            return o
        })
        if (changed) {
            localStorage.setItem(ordersKey, JSON.stringify(migratedOrders))
        }
    }
}
