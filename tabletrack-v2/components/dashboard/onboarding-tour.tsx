"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronRight, ChevronLeft, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter, usePathname } from "next/navigation"

interface Step {
    targetId: string
    title: string
    content: string
    position?: "top" | "bottom" | "left" | "right"
    href?: string
}

const STEPS: Step[] = [
    {
        targetId: "tour-sidebar",
        title: "Navegação Principal",
        content: "Use a barra lateral para navegar entre as seções do seu restaurante.",
        position: "right",
        href: "/dashboard"
    },
    {
        targetId: "tour-selector",
        title: "Seletor de Unidades",
        content: "Troque rapidamente entre restaurantes ou veja a visão geral de todas as suas lojas.",
        position: "bottom",
        href: "/dashboard"
    },
    {
        targetId: "tour-new-order",
        title: "Fluxo de Pedidos",
        content: "Aqui você gerencia ordens em tempo real. Clique em 'Novo Pedido' para simular uma venda.",
        position: "bottom",
        href: "/dashboard/orders"
    },
    {
        targetId: "tour-add-product",
        title: "Gestão de Cardápio",
        content: "Adicione pratos, configure preços e categorias para manter seu menu sempre atualizado.",
        position: "bottom",
        href: "/dashboard/menu"
    },
    {
        targetId: "tour-nav-settings",
        title: "Personalização",
        content: "Ajuste o tema visual, gerencie seu perfil e configure as notificações do sistema.",
        position: "right",
        href: "/dashboard/settings"
    }
]

export function OnboardingTour() {
    const [currentStep, setCurrentStep] = useState(0)
    const [isVisible, setIsVisible] = useState(false)
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, height: 0 })
    const [showFinished, setShowFinished] = useState(false)
    const router = useRouter()
    const pathname = usePathname()

    const updateCoords = useCallback(() => {
        const step = STEPS[currentStep]

        // If step requires navigation, wait for it
        if (step.href && pathname !== step.href) {
            setCoords({ top: 0, left: 0, width: 0, height: 0 })
            return
        }

        const element = document.getElementById(step.targetId)
        if (element) {
            const rect = element.getBoundingClientRect()
            setCoords({
                top: rect.top + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
                height: rect.height
            })
        } else {
            setCoords({ top: 0, left: 0, width: 0, height: 0 })
        }
    }, [currentStep])

    useEffect(() => {
        const hasSeenTour = localStorage.getItem("tt_onboarding_seen")
        if (!hasSeenTour) {
            setIsVisible(true)
        }
    }, [])

    useEffect(() => {
        if (isVisible) {
            const step = STEPS[currentStep]
            if (step.href && pathname !== step.href) {
                router.push(step.href)
            }

            // Re-check coords after a small delay to allow for page load/renders
            const timer = setTimeout(updateCoords, 500)

            window.addEventListener("resize", updateCoords)
            window.addEventListener("scroll", updateCoords)
            return () => {
                clearTimeout(timer)
                window.removeEventListener("resize", updateCoords)
                window.removeEventListener("scroll", updateCoords)
            }
        }
    }, [isVisible, currentStep, pathname, router, updateCoords])

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(prev => prev + 1)
        } else {
            setShowFinished(true)
        }
    }

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1)
        }
    }

    const handleSkip = () => {
        setIsVisible(false)
    }

    const handleFinish = (dontShowAgain: boolean) => {
        if (dontShowAgain) {
            localStorage.setItem("tt_onboarding_seen", "true")
        }
        setIsVisible(false)
    }

    if (!isVisible) return null

    const step = STEPS[currentStep]

    return (
        <div className="fixed inset-0 z-[100] pointer-events-none">
            {/* Overlay Backdrop - Optional, let's keep it subtle */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/20 pointer-events-auto"
                onClick={handleSkip}
            />

            <AnimatePresence mode="wait">
                {!showFinished ? (
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            top: coords.width > 0 ? (
                                step.position === "bottom" ? coords.top + coords.height + 20 :
                                    step.position === "top" ? coords.top - 200 :
                                        coords.top + (coords.height / 2) - 100
                            ) : "40%",
                            left: coords.width > 0 ? (
                                step.position === "right" ? coords.left + coords.width + 20 :
                                    step.position === "left" ? coords.left - 300 :
                                        coords.left + (coords.width / 2) - 150
                            ) : "50%",
                            x: coords.width > 0 ? 0 : "-50%",
                        }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute w-[300px] bg-white rounded-[2rem] border border-zinc-100 shadow-2xl p-8 pointer-events-auto z-[110]"
                    >
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-[.2em] text-primary">
                                    Passo {currentStep + 1} de {STEPS.length}
                                </span>
                                <button onClick={handleSkip} className="text-zinc-300 hover:text-zinc-900 transition-colors">
                                    <X size={16} />
                                </button>
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 italic leading-tight">{step.title}</h3>
                            <p className="text-sm text-zinc-500 font-medium leading-relaxed">{step.content}</p>

                            <div className="flex items-center justify-between pt-4">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleBack}
                                    disabled={currentStep === 0}
                                    className="rounded-xl h-10 px-4 text-[10px] font-bold uppercase tracking-widest disabled:opacity-30"
                                >
                                    <ChevronLeft size={14} className="mr-1" /> Voltar
                                </Button>
                                <Button
                                    onClick={handleNext}
                                    size="sm"
                                    className="rounded-xl h-10 px-6 text-[10px] font-bold uppercase tracking-widest bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg shadow-zinc-200"
                                >
                                    {currentStep === STEPS.length - 1 ? "Finalizar" : "Próximo"} <ChevronRight size={14} className="ml-1" />
                                </Button>
                            </div>
                        </div>

                        {/* Tooltip Arrow */}
                        {coords.width > 0 && (
                            <div className={`absolute w-4 h-4 bg-white border-l border-t border-zinc-100 rotate-45 
                ${step.position === "right" ? "-left-2 top-1/2 -translate-y-1/2 -rotate-45 border-l border-b" :
                                    step.position === "bottom" ? "left-1/2 -translate-x-1/2 -top-2 rotate-45 border-l border-t" :
                                        ""}`}
                            />
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] bg-white rounded-[2.5rem] border border-zinc-100 shadow-2xl p-10 pointer-events-auto z-[120] text-center"
                    >
                        <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                            <Check className="text-emerald-500 w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-bold text-zinc-900 mb-3 italic">Tour concluído!</h3>
                        <p className="text-sm text-zinc-500 font-medium leading-relaxed mb-8">
                            Agora você está pronto para dominar o MyTable. Explore as funcionalidades e qualquer dúvida estamos aqui.
                        </p>
                        <div className="space-y-3">
                            <Button
                                onClick={() => handleFinish(false)}
                                className="w-full h-14 rounded-2xl bg-zinc-900 text-white font-bold uppercase tracking-widest text-[11px]"
                            >
                                Começar a usar
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => handleFinish(true)}
                                className="w-full h-14 rounded-2xl text-zinc-400 hover:text-zinc-900 font-bold uppercase tracking-widest text-[10px]"
                            >
                                Não mostrar novamente
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Target Highlight Effect */}
            {coords.width > 0 && !showFinished && (
                <motion.div
                    animate={{
                        top: coords.top - 8,
                        left: coords.left - 8,
                        width: coords.width + 16,
                        height: coords.height + 16,
                    }}
                    className="absolute border-2 border-primary rounded-[2rem] z-[105] pointer-events-none shadow-[0_0_0_9999px_rgba(0,0,0,0.3)]"
                    transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                />
            )}
        </div>
    )
}
