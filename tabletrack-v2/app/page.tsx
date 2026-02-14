import { Navbar } from "@/components/sections/navbar"
import { Hero } from "@/components/sections/hero"
import { Features } from "@/components/sections/features"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />

      <footer className="py-12 border-t border-zinc-100 bg-zinc-50">
        <div className="container mx-auto px-4 text-center text-sm text-zinc-400">
          © 2026 MyTable. Todos os direitos reservados.
        </div>
      </footer>
    </main>
  )
}
