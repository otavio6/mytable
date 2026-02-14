"use client"

import { useEffect, useState } from "react"
import { motion, useSpring, useTransform } from "framer-motion"

interface NumberCounterProps {
    value: number
    duration?: number
    prefix?: string
    suffix?: string
    decimals?: number
}

export function NumberCounter({ value, duration = 2, prefix = "", suffix = "", decimals = 0 }: NumberCounterProps) {
    const spring = useSpring(0, { bounce: 0, duration: duration * 1000 })
    const display = useTransform(spring, (current) =>
        prefix + current.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix
    )

    useEffect(() => {
        spring.set(value)
    }, [value, spring])

    return <motion.span>{display}</motion.span>
}
