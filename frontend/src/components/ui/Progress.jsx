import React from 'react'
import { motion } from 'framer-motion'

export function ProgressBar({ value }) {
  return (
    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
      <motion.div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500" initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ type: 'spring', stiffness: 80, damping: 14 }} />
    </div>
  )
}

export function ProgressRing({ value = 0, size = 72, stroke = 8, color = '#6366F1' }) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference
  return (
    <svg width={size} height={size} className="overflow-visible">
      <circle cx={size/2} cy={size/2} r={radius} stroke="#E5E7EB" strokeWidth={stroke} fill="none" />
      <motion.circle cx={size/2} cy={size/2} r={radius} stroke={color} strokeWidth={stroke} strokeLinecap="round" fill="none" initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }} animate={{ strokeDashoffset: offset }} />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="fill-gray-900 text-sm font-semibold">{value}%</text>
    </svg>
  )
}



