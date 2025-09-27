import React from 'react'

export default function Card({ children, className = '', variant = 'glass' }) {
  const variants = {
    glass: 'bg-white/90 backdrop-blur border',
    gradient: 'bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400 text-white',
    soft: 'bg-gray-50 border',
  }
  return <div className={`${variants[variant]} rounded-2xl shadow-soft ${className}`}>{children}</div>
}


