"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, UtensilsCrossed, Package, BarChart3 } from "lucide-react"
import Link from "next/link"

export function Hero() {
    return (
        <section className="relative pt-32 pb-20 overflow-hidden bg-zinc-50">
            <div className="container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="inline-block px-4 py-1.5 mb-8 text-[11px] font-bold tracking-widest text-zinc-500 uppercase border border-zinc-200 rounded-full bg-white">
                        Gerenciamento de Restaurantes 2.0
                    </span>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 text-zinc-900 leading-[1.1]">
                        Sua gestão na{" "}
                        <motion.span
                            initial={{ x: 150, opacity: 0, filter: "blur(20px)" }}
                            animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
                            transition={{
                                duration: 0.5,
                                ease: [0.23, 1, 0.32, 1],
                                delay: 0.4
                            }}
                            className="inline-block"
                        >
                            velocidade
                        </motion.span>
                        <br /> do seu atendimento.
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-500 mb-12">
                        MyTable é a plataforma SaaS definitiva para restaurantes modernos.
                        Controle pedidos, mesas e pagamentos em tempo real, de qualquer lugar.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button size="lg" className="h-14 px-10 text-base rounded-full" asChild>
                            <Link href="/login">
                                Começar Agora
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="h-14 px-10 text-base rounded-full" asChild>
                            <Link href="/dashboard">Ver Demonstração</Link>
                        </Button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {[
                        {
                            icon: UtensilsCrossed,
                            title: "Pedidos Inteligentes",
                            description: "Sistema de KOT digital que elimina erros e acelera o despacho dos pratos."
                        },
                        {
                            icon: Package,
                            title: "Controle de Estoque",
                            description: "Gestão automática de insumos e alerta de reposição para evitar desperdícios."
                        },
                        {
                            icon: BarChart3,
                            title: "Relatórios Financeiros",
                            description: "Análise detalhada de faturamento, lucro por prato e desempenho da equipe."
                        }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            className="p-12 premium-card group hover:bg-zinc-900 transition-all duration-500"
                            animate={{
                                y: [0, -40, 0],
                                x: [0, 8, 0]
                            }}
                            transition={{
                                duration: 5 + i,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 0.8
                            }}
                        >
                            <div className="w-14 h-14 mx-auto mb-8 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-900 border border-zinc-100 group-hover:bg-white group-hover:scale-110 transition-all duration-500 shadow-sm">
                                <feature.icon className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-zinc-900 group-hover:text-white transition-colors">{feature.title}</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed group-hover:text-zinc-400 transition-colors">{feature.description}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
