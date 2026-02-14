"use client"

import { useState } from "react"
import { Bell, Lock, Globe, User, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SettingsModal } from "@/components/dashboard/settings-modal"

export default function SettingsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedSection, setSelectedSection] = useState("profile")

    const handleManage = (sectionId: string) => {
        setSelectedSection(sectionId)
        setIsModalOpen(true)
    }

    const sections = [
        { id: "profile", icon: User, label: "Perfil da Conta", desc: "Gerencie suas informações pessoais e de acesso." },
        { id: "notifications", icon: Bell, label: "Notificações", desc: "Configure como você deseja ser avisado sobre novos pedidos." },
        { id: "security", icon: Lock, label: "Segurança", desc: "Alterar senha e gerenciar autenticação em dois fatores." },
        { id: "preferences", icon: Globe, label: "Preferências do Sistema", desc: "Idioma, fuso horário e configurações regionais." },
    ]

    return (
        <div className="max-w-4xl space-y-12 pb-20">
            <div>
                <h2 className="text-4xl font-bold tracking-tight text-zinc-900 italic">Configurações</h2>
                <p className="text-zinc-500 mt-2 font-medium">Personalize sua experiência tátil no MyTable.</p>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {sections.map((section, i) => (
                    <div
                        key={section.id}
                        onClick={() => handleManage(section.id)}
                        className="p-10 rounded-[2.5rem] bg-white border border-zinc-200 shadow-sm flex items-center justify-between group hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer"
                    >
                        <div className="flex items-center gap-10">
                            <div className="w-16 h-16 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-300 group-hover:bg-zinc-100 group-hover:text-zinc-900 transition-all duration-300">
                                <section.icon size={24} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-bold text-xl text-zinc-900">{section.label}</h3>
                                <p className="text-sm font-medium text-zinc-400">{section.desc}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <Button
                                variant="outline"
                                className="h-12 px-8 rounded-xl font-black uppercase text-[10px] tracking-widest border-zinc-200 text-zinc-400 group-hover:text-zinc-900 group-hover:border-zinc-300 transition-all"
                            >
                                Gerenciar
                            </Button>
                            <ChevronRight size={20} className="text-zinc-200 group-hover:text-zinc-400 transition-all" />
                        </div>
                    </div>
                ))}
            </div>

            <SettingsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialSection={selectedSection}
            />
        </div>
    )
}
