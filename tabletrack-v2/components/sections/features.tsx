"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { AppPreview } from "@/components/landing/app-preview"
import { Check, CheckCircle2 } from "lucide-react"

export function Features() {
    const words = ["escala", "ajuda", "lucra", "fatura", "surpreende"]
    const [index, setIndex] = useState(0)
    const [subIndex, setSubIndex] = useState(0)
    const [isDeleting, setIsDeleting] = useState(false)
    const [blink, setBlink] = useState(true)

    // Typewriter effect logic
    useEffect(() => {
        if (subIndex === words[index].length + 1 && !isDeleting) {
            setTimeout(() => setIsDeleting(true), 1500)
            return
        }

        if (subIndex === 0 && isDeleting) {
            setIsDeleting(false)
            setIndex((prev) => (prev + 1) % words.length)
            return
        }

        const timeout = setTimeout(() => {
            setSubIndex((prev) => prev + (isDeleting ? -1 : 1))
        }, isDeleting ? 70 : 150)

        return () => clearTimeout(timeout)
    }, [subIndex, index, isDeleting])

    // Blinking cursor
    useEffect(() => {
        const timeout2 = setTimeout(() => {
            setBlink((prev) => !prev)
        }, 500)
        return () => clearTimeout(timeout2)
    }, [blink])

    return (
        <section id="features" className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    <motion.div
                        className="flex-1 space-y-12 pl-8 lg:pl-32"
                        initial={{ opacity: 1, x: 0 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="space-y-6">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                                Poder Operacional
                            </span>
                            <h2 className="text-4xl md:text-5xl lg:text-5xl font-bold italic text-zinc-900 leading-tight min-h-[1.2em]">
                                Simplicidade que <br />
                                <span className="text-zinc-900">
                                    {`${words[index].substring(0, subIndex)}`}
                                    <span className={`inline-block w-[3px] h-[0.9em] bg-zinc-900 ml-1 align-middle transition-opacity duration-100 ${blink ? 'opacity-100' : 'opacity-0'}`} />
                                </span>
                            </h2>
                            <p className="text-lg text-zinc-500 leading-relaxed max-w-md">
                                Não importa se você tem um pequeno bistrô ou uma rede de restaurantes.
                                O MyTable foi desenhado para ser intuitivo para seus garçons e poderoso para seu gerente.
                            </p>
                        </div>

                        <ul className="space-y-8">
                            {[
                                { title: "Sincronização instantânea", desc: "Pedidos aparecem na cozinha em milissegundos." },
                                { title: "Relatórios automatizados", desc: "Fechamento de caixa e DRE em tempo real." },
                                { title: "Gestão completa", desc: "Estoque, compras e escala de funcionários." }
                            ].map((item, i) => (
                                <motion.li
                                    key={item.title}
                                    className="flex items-center gap-6 group cursor-default force-visible"
                                    drag
                                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                                    dragElastic={0.4}
                                    dragSnapToOrigin
                                    initial={false}
                                    animate={{
                                        y: [0, -8, 0],
                                        x: [0, 2, 0],
                                    }}
                                    transition={{
                                        y: {
                                            duration: 5 + i,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                            delay: i * 0.8
                                        },
                                        x: {
                                            duration: 4 + i,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                            delay: i * 0.5
                                        }
                                    }}
                                    style={{ opacity: 1, visibility: 'visible', pointerEvents: 'auto' }}
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-white border border-zinc-100 flex items-center justify-center shrink-0 shadow-sm group-hover:shadow-md transition-all duration-500" style={{ opacity: 1 }}>
                                        <CheckCircle2 className="w-6 h-6 text-zinc-900" strokeWidth={1.5} style={{ opacity: 1 }} />
                                    </div>
                                    <div style={{ opacity: 1 }}>
                                        <h4 className="text-xl font-bold text-zinc-900 mb-1" style={{ opacity: 1 }}>{item.title}</h4>
                                        <p className="text-zinc-600 text-sm font-medium" style={{ opacity: 1 }}>{item.desc}</p>
                                    </div>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    <motion.div
                        className="flex-1 w-full max-w-xl lg:max-w-none perspective-1000"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="aspect-[4/3] rounded-[3rem] bg-zinc-100 p-4 border border-zinc-200 shadow-2xl relative">
                            {/* Decorative blobs */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-zinc-100/50 blur-3xl rounded-full -z-10" />

                            <AppPreview />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
