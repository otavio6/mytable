import { LoginForm } from "@/components/auth/login-form"
import Link from "next/link"

export default function LoginPage() {
    return (
        <main className="min-h-screen flex items-center justify-center p-4 bg-zinc-50 relative overflow-hidden">
            {/* Decorative background elements consistent with Hero */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-zinc-100 rounded-full blur-[120px] opacity-50" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-zinc-100 rounded-full blur-[120px] opacity-50" />
            </div>

            <div className="absolute top-10 left-10 z-10">
                <Link href="/" className="flex items-center group transition-all duration-300">
                    <span className="font-bold text-2xl tracking-tighter text-zinc-900">
                        My<span className="text-zinc-400">Table</span>
                    </span>
                </Link>
            </div>
            <LoginForm />
        </main>
    )
}
