"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Mail, Lock, Loader2, Github } from "lucide-react"
import { useRouter } from "next/navigation"

export function LoginForm() {
    const [mode, setMode] = useState<"login" | "register">("login")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const router = useRouter()

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(null)

        if (mode === "login") {
            const cleanEmail = email.trim()

            // Developer Bypass
            if (cleanEmail.toLowerCase() === "guilherme@otahstudio.com" && password === "guilherme123") {
                // Update local profile name
                const savedSettings = localStorage.getItem("tt_v2_settings")
                if (savedSettings) {
                    const parsed = JSON.parse(savedSettings)
                    localStorage.setItem("tt_v2_settings", JSON.stringify({
                        ...parsed,
                        profile: { ...parsed.profile, name: "Guilherme", email: cleanEmail }
                    }))
                } else {
                    // Create default if missing
                    localStorage.setItem("tt_v2_settings", JSON.stringify({
                        profile: { name: "Guilherme", email: cleanEmail, phone: "" },
                        notifications: { orders: true, reports: false, stock: true },
                        security: { twoFactor: false },
                        preferences: { language: "pt-BR", timezone: "GMT-3" },
                        styling: { theme: "slate", radius: "medium" }
                    }))
                }

                console.log("BYPASS: Developer account detected")
                setSuccess("Acesso de desenvolvedor autorizado!")
                localStorage.setItem("tt_v2_bypass", "true")

                // Clear loading to unlock UI
                setLoading(false)

                console.log("BYPASS: Redirecting to dashboard...")
                router.push("/dashboard")

                // Fallback for extreme cases
                setTimeout(() => {
                    if (window.location.pathname === "/login") {
                        console.log("BYPASS: Router failed, using window.location fallback")
                        window.location.href = "/dashboard"
                    }
                }, 2000)
                return
            }

            const { error: authError } = await supabase.auth.signInWithPassword({
                email: cleanEmail,
                password,
            })

            if (authError) {
                setError("Credenciais inválidas. Tente novamente.")
                setLoading(false)
            } else {
                router.push("/dashboard")
            }
        } else {
            const cleanEmail = email.trim()
            const { error: authError } = await supabase.auth.signUp({
                email: cleanEmail,
                password,
                options: {
                    emailRedirectTo: window.location.origin + '/auth/callback'
                }
            })

            if (authError) {
                setError(authError.message)
                setLoading(false)
            } else {
                setSuccess("Conta criada com sucesso! Verifique seu email para confirmar.")
                setLoading(false)
            }
        }
    }

    const handleGoogleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + '/auth/callback'
            }
        })
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md p-12 rounded-[3.5rem] bg-white border border-zinc-200 shadow-2xl shadow-zinc-200/50 relative overflow-hidden"
        >
            <div className="text-center mb-10">
                <h2 className="text-4xl font-bold tracking-tight text-zinc-900 italic">
                    {mode === "login" ? "Bem-vindo" : "Criar Conta"}
                </h2>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mt-4 leading-relaxed">
                    {mode === "login" ? "Acesso ao Centro de Comando" : "Inicie sua jornada operacional hoje"}
                </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-6">
                <div className="space-y-4">
                    <div className="relative group">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 transition-colors group-focus-within:text-zinc-900" />
                        <input
                            type="email"
                            placeholder="EMAIL"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-16 pr-8 h-16 bg-zinc-50 border border-zinc-100 rounded-2xl text-[10px] font-bold tracking-[0.2em] outline-none focus:bg-white focus:border-zinc-300 transition-all placeholder:text-zinc-300 text-zinc-900"
                        />
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="relative group">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 transition-colors group-focus-within:text-zinc-900" />
                        <input
                            type="password"
                            placeholder="SENHA"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-16 pr-8 h-16 bg-zinc-50 border border-zinc-100 rounded-2xl text-[10px] font-bold tracking-[0.2em] outline-none focus:bg-white focus:border-zinc-300 transition-all placeholder:text-zinc-300 text-zinc-900"
                        />
                    </div>
                </div>

                {error && (
                    <p className="text-[10px] font-black text-red-500 uppercase tracking-widest text-center animate-pulse">{error}</p>
                )}

                {success && (
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest text-center">{success}</p>
                )}

                <Button
                    type="submit"
                    className="w-full h-16 rounded-2xl bg-zinc-900 text-white hover:bg-zinc-800 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-zinc-900/10 transition-all"
                    disabled={loading}
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    {mode === "login" ? "Acessar Plataforma" : "Confirmar Cadastro"}
                </Button>
            </form>

            <div className="relative my-10">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-zinc-100" />
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-white px-6 text-[8px] uppercase font-black tracking-[0.4em] text-zinc-300">Autenticação Social</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <Button
                    variant="outline"
                    onClick={handleGoogleLogin}
                    className="h-16 rounded-2xl border-zinc-100 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-50 hover:border-zinc-200 text-zinc-400 hover:text-zinc-900 transition-all"
                >
                    <svg className="mr-3 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                    </svg>
                    Continuar com Google
                </Button>

                <Button
                    variant="ghost"
                    onClick={() => {
                        localStorage.setItem("tt_v2_bypass", "true")
                        setSuccess("Acesso Convidado Ativado!")
                        window.location.href = "/dashboard"
                    }}
                    className="h-14 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-900 transition-all"
                >
                    Acessar como Convidado (Teste)
                </Button>
            </div>

            <div className="text-center mt-10">
                <button
                    onClick={() => setMode(mode === "login" ? "register" : "login")}
                    className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors"
                >
                    {mode === "login" ? "Solicitar Novo Acesso?" : "Já possui uma credencial?"}
                    <span className="ml-2 text-zinc-900 underline underline-offset-4">
                        {mode === "login" ? "Cadastre-se" : "Entrar"}
                    </span>
                </button>
            </div>
        </motion.div>
    )
}
